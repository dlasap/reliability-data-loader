import axios from "axios";
import Promise from "bluebird";

export const apiPostCall = async (url = "", params) => {
  try {
    const {
      data: result,
      success,
      message,
    } = await axios.post(url, {
      prompts: params.prompts ?? [],
    });
    console.log("%c  result:", "color: #0e93e0;background: #aaefe5;", result);

    return result;
  } catch (error) {
    console.log(
      "%c  API CALL error:",
      "color: #0e93e0;background: #aaefe5;",
      error
    );
  }
};

// export const batchApiPostCall = async (url = "", formData) => {
//   try {
//     let paramsBatches = [];

//     const batchSize = Number(formData.get("batchSize"));
//     const AI_SETTINGS = JSON.parse(formData.get("aiSettings"));
//     const generatedPrompts = JSON.parse(formData.get("prompts"));
//     const context = formData.get("context");

//     const params = { prompts: generatedPrompts, context };

//     const totalBatches = Math.ceil(params.prompts.length / batchSize);

//     //BATCHING
//     for (let i = 1; i <= totalBatches; i++) {
//       paramsBatches.push([params.prompts.slice((i - 1) * 10, i !== totalBatches ? batchSize * i : params.prompts.length % (batchSize * i))]);
//     }

//     const allData = await Promise.map(paramsBatches, async (batch) => {
//       const { context = "" } = params;

//       formData.append("flatBatch", batch.flat() ?? []);
//       formData.delete("prompts");
//       console.log("%c  batch:", "color: #0e93e0;background: #aaefe5;", batch);
//       const {
//         data: result,
//         success,
//         message,
//       } = await axios.post(
//         url,
//         // {
//         //   prompts: batch.flat() ?? [],
//         //   ...(context ? { context: [context] } : {}),
//         //   ...(AI_SETTINGS ? { settings: AI_SETTINGS } : {}),
//         //   supportFile: supportFile,
//         // },
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       console.log("%c  url:", "color: #0e93e0;background: #aaefe5;", url);
//       console.log("%c  result:", "color: #0e93e0;background: #aaefe5;", result);
//       return result;
//     });

//     const reformedReturnedData = await allData.map((ad) => {
//       return ad.data;
//     });

//     return {
//       data: reformedReturnedData.flat(),
//       success: true,
//     };
//   } catch (error) {
//     console.log("%c  API CALL error:", "color: #0e93e0;background: #aaefe5;", error);
//   }
// };

export const batchApiPostCall = async (url = "", originalFormData) => {
  try {
    const batchSize = Number(originalFormData.get("batchSize"));
    const AI_SETTINGS = JSON.parse(originalFormData.get("aiSettings"));
    const generatedPrompts = JSON.parse(originalFormData.get("prompts"));
    const context = originalFormData.get("context");

    const paramsBatches = [];

    // ✅ Safe batching logic
    for (let i = 0; i < generatedPrompts.length; i += batchSize) {
      paramsBatches.push(generatedPrompts.slice(i, i + batchSize));
    }

    const allData = await Promise.all(
      paramsBatches.map(async (batch) => {
        const formData = new FormData();

        formData.append("flatBatch", JSON.stringify(batch));
        formData.append("context", context || "");
        formData.append("aiSettings", JSON.stringify(AI_SETTINGS));
        formData.append("batchSize", String(batchSize));

        const supportFile = originalFormData.get("supportFile");
        if (supportFile) formData.append("supportFile", supportFile);

        console.log("%c  batch:", "color: #0e93e0;background: #aaefe5;", batch);

        const response = await axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log(
          "%c  result:",
          "color: #0e93e0;background: #aaefe5;",
          response.data
        );
        return response.data;
      })
    );

    // ✅ Flatten and return
    const reformedReturnedData = allData.map((d) => d.data ?? []);

    return {
      data: reformedReturnedData.flat(),
      success: true,
    };
  } catch (error) {
    console.log(
      "%c  API CALL error:",
      "color: #ff0000;background: #fff0f0;",
      error
    );
    return {
      data: [],
      success: false,
      error: error.message || "Unknown error",
    };
  }
};

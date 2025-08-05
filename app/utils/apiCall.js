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

// export const batchApiPostCall = async (url = "", originalFormData) => {
//   try {
//     const batchSize = Number(originalFormData.get("batchSize"));
//     const AI_SETTINGS = JSON.parse(originalFormData.get("aiSettings"));
//     const generatedPrompts = JSON.parse(originalFormData.get("prompts"));
//     const context = originalFormData.get("context");

//     const paramsBatches = [];

//     // ✅ Safe batching logic
//     for (let i = 0; i < generatedPrompts.length; i += batchSize) {
//       paramsBatches.push(generatedPrompts.slice(i, i + batchSize));
//     }

//     const allData = await Promise.all(
//       paramsBatches.map(async (batch) => {
//         const formData = new FormData();

//         formData.append("flatBatch", JSON.stringify(batch));
//         formData.append("context", context || "");
//         formData.append("aiSettings", JSON.stringify(AI_SETTINGS));
//         formData.append("batchSize", String(batchSize));

//         const supportFile = originalFormData.get("supportFile");
//         if (supportFile) formData.append("supportFile", supportFile);


//         const response = await axios.post(url, formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });

//         console.log(
//           "%c  result:",
//           "color: #0e93e0;background: #aaefe5;",
//           response.data
//         );
//         return response.data;
//       })
//     );

//     // ✅ Flatten and return
//     const reformedReturnedData = allData.map((d) => d.data ?? []);

//     return {
//       data: reformedReturnedData.flat(),
//       success: true,
//     };
//   } catch (error) {
//     console.log(
//       "%c  API CALL error:",
//       "color: #ff0000;background: #fff0f0;",
//       error
//     );
//     return {
//       data: [],
//       success: false,
//       error: error.message || "Unknown error",
//     };
//   }
// };

// export const batchApiPostCall = async (url = "", originalFormData) => {
//   const batchSize = Number(originalFormData.get("batchSize"));
//   const AI_SETTINGS = JSON.parse(originalFormData.get("aiSettings"));
//   const generatedPrompts = JSON.parse(originalFormData.get("prompts"));
//   const context = originalFormData.get("context");
//   const supportFile = originalFormData.get("supportFile");

//   const maxRetries = 5;
//   const retryDelay = (attempt) => Math.min(1000 * 2 ** attempt, 10000); // Exponential backoff

//   const callApiWithPrompt = async (prompt, attempt = 0) => {
//     try {
//       const formData = new FormData();
//       formData.append("flatBatch", JSON.stringify([prompt]));
//       formData.append("context", context || "");
//       formData.append("aiSettings", JSON.stringify(AI_SETTINGS));
//       formData.append("batchSize", "1");
//       if (supportFile) formData.append("supportFile", supportFile);

//       const response = await axios.post(url, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       const result = response?.data?.data;
//       if (result && result.length > 0) {
//         return result[0];
//       } else {
//         throw new Error("Empty data received");
//       }
//     } catch (error) {
//       console.warn(
//         `%cRetry attempt ${attempt + 1} for prompt: ${prompt}`,
//         "color: orange;"
//       );

//       if (attempt < maxRetries) {
//         await new Promise((res) => setTimeout(res, retryDelay(attempt)));
//         return callApiWithPrompt(prompt, attempt + 1);
//       } else {
//         console.error(
//           `%cFailed after ${maxRetries} retries for prompt: ${prompt}`,
//           "color: red;"
//         );
//         return { error: "Failed after retries", prompt };
//       }
//     }
//   };

//   try {
//     const results = await Promise.all(
//       generatedPrompts.map((prompt) => callApiWithPrompt(prompt))
//     );

//     return {
//       data: results,
//       success: true,
//     };
//   } catch (error) {
//     console.log(
//       "%c  API CALL error:",
//       "color: #ff0000;background: #fff0f0;",
//       error
//     );
//     return {
//       data: [],
//       success: false,
//       error: error.message || "Unknown error",
//     };
//   }
// };

// export const batchApiPostCall = async (
//   url = "",
//   originalFormData,
//   setProgress = () => {} // Pass a function like: (done, total) => { ... }
// ) => {
//   const batchSize = Number(originalFormData.get("batchSize"));
//   const AI_SETTINGS = JSON.parse(originalFormData.get("aiSettings"));
//   const generatedPrompts = JSON.parse(originalFormData.get("prompts"));
//   const context = originalFormData.get("context");
//   const supportFile = originalFormData.get("supportFile");

//   const maxRetries = 5;
//   const retryDelay = (attempt) => Math.min(1000 * 2 ** attempt, 10000); // Exponential backoff

//   let completed = 0;
//   const total = generatedPrompts.length;

//   const callApiWithPrompt = async (prompt, attempt = 0) => {
//     try {
//       const formData = new FormData();
//       formData.append("flatBatch", JSON.stringify([prompt]));
//       formData.append("context", context || "");
//       formData.append("aiSettings", JSON.stringify(AI_SETTINGS));
//       formData.append("batchSize", "1");
//       if (supportFile) formData.append("supportFile", supportFile);

//       const response = await axios.post(url, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       const result = response?.data?.data;
//       if (result && result.length > 0) {
//         return result[0];
//       } else {
//         throw new Error("Empty data received");
//       }
//     } catch (error) {
//       if (attempt < maxRetries) {
//         await new Promise((res) => setTimeout(res, retryDelay(attempt)));
//         return callApiWithPrompt(prompt, attempt + 1);
//       } else {
//         return { error: "Failed after retries", prompt };
//       }
//     } finally {
//       completed += 1;
//       setProgress(completed, total);
//     }
//   };

//   try {
//     const results = await Promise.all(
//       generatedPrompts.map((prompt) => callApiWithPrompt(prompt))
//     );

//     return {
//       data: results,
//       success: true,
//     };
//   } catch (error) {
//     return {
//       data: [],
//       success: false,
//       error: error.message || "Unknown error",
//     };
//   }
// };

export const batchApiPostCall = async (
  url = "",
  originalFormData,
  setProgress = () => {},
  setElapsed = () => {}
) => {
  const batchSize = Number(originalFormData.get("batchSize"));
  const AI_SETTINGS = JSON.parse(originalFormData.get("aiSettings"));
  const generatedPrompts = JSON.parse(originalFormData.get("prompts"));
  const context = originalFormData.get("context");
  const supportFile = originalFormData.get("supportFile");

  const maxRetries = 20;
  const retryDelay = (attempt) => Math.min(1000 * 2 ** attempt, 10000); // Exponential backoff

  let completed = 0;
  const total = generatedPrompts.length;

  const startTime = Date.now();

  const updateElapsed = () => {
    const secondsElapsed = Math.floor((Date.now() - startTime) / 1000);
    setElapsed(secondsElapsed);
  };

const callApiWithPrompt = async (prompt, attempt = 0) => {
  try {
    const formData = new FormData();
    formData.append("flatBatch", JSON.stringify([prompt]));
    formData.append("context", context || "");
    formData.append("aiSettings", JSON.stringify(AI_SETTINGS));
    formData.append("batchSize", "1");
    if (supportFile) formData.append("supportFile", supportFile);

    const response = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const result = response?.data?.data;
    if (result && result.length > 0) {
      completed += 1;
      setProgress(completed, total);
      updateElapsed();
      return result[0];
    } else {
      throw new Error("Empty data received");
    }
  } catch (error) {
    if (attempt < maxRetries) {
      await new Promise((res) => setTimeout(res, retryDelay(attempt)));
      return callApiWithPrompt(prompt, attempt + 1);
    } else {
      completed += 1;
      setProgress(completed, total);
      updateElapsed();
      return { error: "Failed after retries", prompt };
    }
  }
};

  try {
    const results = await Promise.all(
      generatedPrompts.map((prompt) => callApiWithPrompt(prompt))
    );

    return {
      data: results,
      success: true,
    };
  } catch (error) {
    return {
      data: [],
      success: false,
      error: error.message || "Unknown error",
    };
  }
};


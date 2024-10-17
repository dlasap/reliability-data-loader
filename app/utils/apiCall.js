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
    console.log("%c  API CALL error:", "color: #0e93e0;background: #aaefe5;", error);
  }
};

export const batchApiPostCall = async (url = "", params, batchSize = 10, AI_SETTINGS) => {
  try {
    let paramsBatches = [];

    const totalBatches = Math.ceil(params.prompts.length / batchSize);

    //BATCHING
    for (let i = 1; i <= totalBatches; i++) {
      paramsBatches.push([params.prompts.slice((i - 1) * 10, i !== totalBatches ? batchSize * i : params.prompts.length % (batchSize * i))]);
    }

    const allData = await Promise.map(paramsBatches, async (batch) => {
      const { context = "" } = params;
      console.log("%c  batch:", "color: #0e93e0;background: #aaefe5;", batch);
      const {
        data: result,
        success,
        message,
      } = await axios.post(url, {
        prompts: batch.flat() ?? [],
        ...(context ? { context: [context] } : {}),
        ...(AI_SETTINGS ? { settings: AI_SETTINGS } : {}),
      });

      console.log("%c  url:", "color: #0e93e0;background: #aaefe5;", url);
      console.log("%c  result:", "color: #0e93e0;background: #aaefe5;", result);
      return result;
    });

    const reformedReturnedData = await allData.map((ad) => {
      return ad.data;
    });

    return {
      data: reformedReturnedData.flat(),
      success: true,
    };
  } catch (error) {
    console.log("%c  API CALL error:", "color: #0e93e0;background: #aaefe5;", error);
  }
};

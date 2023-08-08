import axios from "axios";

export const apiPostCall = async (url = "", params) => {
  console.log("%c  params:", "color: #0e93e0;background: #aaefe5;", params.prompts);
  const {
    data: result,
    success,
    message,
  } = await axios.post(url, {
    prompts: params.prompts ?? [],
  });
  console.log("%c  result:", "color: #0e93e0;background: #aaefe5;", result);

  return result;
};

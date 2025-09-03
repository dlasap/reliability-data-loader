import aiModels from "./ai-models";

export const AI_MODELS_OPTIONS = Object.entries(aiModels).map(([key, value]) => {
  return {
    id: key,
    model: value,
  };
});

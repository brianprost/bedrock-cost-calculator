export type ModelName =
  | "mistral.mistral-7b-instruct-v0:2"
  | "mistral.mixtral-8x7b-instruct-v0:1"
  | "mistral.mistral-large-2402-v1:0"
  | "meta.llama3-8b-instruct-v1:0"
  | "meta.llama3-70b-instruct-v1:0";

export const models: ModelName[] = [
  "mistral.mistral-7b-instruct-v0:2",
  "mistral.mixtral-8x7b-instruct-v0:1",
  "mistral.mistral-large-2402-v1:0",
  "meta.llama3-8b-instruct-v1:0",
  "meta.llama3-70b-instruct-v1:0",
];

const prices: Record<ModelName, { input: number; output: number }> = {
  "mistral.mistral-7b-instruct-v0:2": {
    input: 0.00015,
    output: 0.0002,
  },
  "mistral.mixtral-8x7b-instruct-v0:1": {
    input: 0.00045,
    output: 0.0007,
  },
  "mistral.mistral-large-2402-v1:0": {
    input: 0.008,
    output: 0.024,
  },
  "meta.llama3-8b-instruct-v1:0": {
    input: 0.0004,
    output: 0.0006,
  },
  "meta.llama3-70b-instruct-v1:0": {
    input: 0.00265,
    output: 0.0035,
  },
};

type ModelLabel =
  | "Mistral 7B"
  | "Mixtral 8x7B"
  | "Mistral Large"
  | "Llama3 8B"
  | "Llama3 70B";

export const getModelLabel = (model: ModelName): ModelLabel => {
  switch (model) {
    case "mistral.mistral-7b-instruct-v0:2":
      return "Mistral 7B";
    case "mistral.mixtral-8x7b-instruct-v0:1":
      return "Mixtral 8x7B";
    case "mistral.mistral-large-2402-v1:0":
      return "Mistral Large";
    case "meta.llama3-8b-instruct-v1:0":
      return "Llama3 8B";
    case "meta.llama3-70b-instruct-v1:0":
      return "Llama3 70B";
  }
};

export const getModelPrice = (
  modelName: ModelName,
  numTokens: number,
  inOrOut: "input" | "output"
): number => {
  return (numTokens / 1000) * prices[modelName][inOrOut];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const countTokens = (text: string | null, encoding: any): number => {
  return text ? encoding.encode(text).length : 0;
};

type ModelName =
  | "mistral.mistral-7b-instruct-v0:2"
  | "mistral.mixtral-8x7b-instruct-v0:1"
  | "mistral.mistral-large-2402-v1:0"
  | "meta.llama3-8b-instruct-v1:0"
  | "meta.llama3-70b-instruct-v1:0";

export const models: { name: string; id: ModelName }[] = [
  { name: "Mistral 7B", id: "mistral.mistral-7b-instruct-v0:2" },
  { name: "Mixtral 8x7B", id: "mistral.mixtral-8x7b-instruct-v0:1" },
  { name: "Mistral Large", id: "mistral.mistral-large-2402-v1:0" },
  { name: "Llama3 8B", id: "meta.llama3-8b-instruct-v1:0" },
  { name: "Llama3 70B", id: "meta.llama3-70b-instruct-v1:0" },
];

export const prices: Record<ModelName, { input: number; output: number }> = {
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

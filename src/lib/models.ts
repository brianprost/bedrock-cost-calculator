export type ModelName =
	| "us.anthropic.claude-3-opus-20240229-v1:0"
	| "us.anthropic.claude-3-5-sonnet-20241022-v2:0"
	| "us.anthropic.claude-3-5-haiku-20241022-v1:0"
	| "us.anthropic.claude-3-haiku-20240307-v1:0"
	| "us.meta.llama3-3-70b-instruct-v1:0"
	| "us.meta.llama3-2-11b-instruct-v1:0"
	| "us.amazon.nova-pro-v1:0"
	| "us.amazon.nova-lite-v1:0"

export const models: ModelName[] = [
	"us.anthropic.claude-3-opus-20240229-v1:0",
	"us.anthropic.claude-3-5-sonnet-20241022-v2:0",
	"us.anthropic.claude-3-5-haiku-20241022-v1:0",
	"us.anthropic.claude-3-haiku-20240307-v1:0",
	"us.meta.llama3-3-70b-instruct-v1:0",
	"us.meta.llama3-2-11b-instruct-v1:0",
	"us.amazon.nova-pro-v1:0",
	"us.amazon.nova-lite-v1:0",
]

const prices: Record<ModelName, { input: number; output: number }> = {
	"us.anthropic.claude-3-opus-20240229-v1:0": {
		input: 0.015,
		output: 0.075,
	},
	"us.anthropic.claude-3-5-sonnet-20241022-v2:0": {
		input: 0.003,
		output: 0.015,
	},
	"us.anthropic.claude-3-5-haiku-20241022-v1:0": {
		input: 0.0008,
		output: 0.004,
	},
	"us.anthropic.claude-3-haiku-20240307-v1:0": {
		input: 0.00025,
		output: 0.00125,
	},
	"us.meta.llama3-3-70b-instruct-v1:0": {
		input: 0.00072,
		output: 0.00072,
	},
	"us.meta.llama3-2-11b-instruct-v1:0": {
		input: 0.00016,
		output: 0.00016,
	},
	"us.amazon.nova-pro-v1:0": {
		input: 0.0008,
		output: 0.00024,
	},
	"us.amazon.nova-lite-v1:0": {
		input: 0.00006,
		output: 0.0032,
	},
}

type ModelLabel =
	| "Claude 3 Opus"
	| "Claude 3.5 Sonnet"
	| "Claude 3.5 Haiku"
	| "Claude 3 Haiku"
	| "Llama3 3 70B"
	| "Llama3 2 11B"
	| "Amazon Nova Pro"
	| "Amazon Nova Lite"

export const getModelLabel = (model: ModelName): ModelLabel => {
	switch (model) {
		case "us.anthropic.claude-3-opus-20240229-v1:0":
			return "Claude 3 Opus"
		case "us.anthropic.claude-3-5-sonnet-20241022-v2:0":
			return "Claude 3.5 Sonnet"
		case "us.anthropic.claude-3-5-haiku-20241022-v1:0":
			return "Claude 3.5 Haiku"
		case "us.anthropic.claude-3-haiku-20240307-v1:0":
			return "Claude 3 Haiku"
		case "us.meta.llama3-3-70b-instruct-v1:0":
			return "Llama3 3 70B"
		case "us.meta.llama3-2-11b-instruct-v1:0":
			return "Llama3 2 11B"
		case "us.amazon.nova-pro-v1:0":
			return "Amazon Nova Pro"
		case "us.amazon.nova-lite-v1:0":
			return "Amazon Nova Lite"
	}
}

export const getModelPrice = (
	modelName: ModelName,
	numTokens: number,
	inOrOut: "input" | "output",
): number => {
	return (numTokens / 1000) * prices[modelName][inOrOut]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const countTokens = (text: string | null, encoding: any): number => {
	return text ? encoding.encode(text).length : 0
}

// (async () => {
//   const inputTokenCount = 585 * 2100000;
//   const outputTokenCount = 10 * 2100000;

//   const inputPriceCalculations: { [key: string]: string } = {};
//   models.forEach((model) => {
//     inputPriceCalculations[model] = `$${getModelPrice(
//       model,
//       inputTokenCount,
//       "input"
//     ).toFixed(2)}`;
//   });

//   const outputPriceCalculations: { [key: string]: string } = {};
//   models.forEach((model) => {
//     outputPriceCalculations[model] = `$${getModelPrice(
//       model,
//       outputTokenCount,
//       "output"
//     ).toFixed(2)}`;
//   });

//   console.log({ inputPriceCalculations });
//   console.log({ outputPriceCalculations });
// })();

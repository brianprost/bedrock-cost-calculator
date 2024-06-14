import * as tiktoken from "tiktoken";
import { models, getModelPrice } from "./models";
const encoding = tiktoken.get_encoding("cl100k_base");

const inputTokenCount = 850;
console.log(`input_token_count (including prompt): ${inputTokenCount}`);
const outputTokenCount = 1;
console.log(`output_token_count: ${outputTokenCount}`)
const numOccupations = 1000;
console.log(`num_occupations: ${numOccupations}`)
const numWorkStyles = 21;
console.log(`num_work_styles: ${numWorkStyles}`)
const numPromptTemplates = 5;
console.log(`num_prompt_templates: ${numPromptTemplates}`)
const numHyperparameterCombos = 20;
console.log(`num_hyperparameter_combos: ${numHyperparameterCombos}`)
const numRuns = numOccupations * numWorkStyles * numPromptTemplates * numHyperparameterCombos;
console.log(`num_runs: ${numRuns}`)

const totalTokens = inputTokenCount * numRuns;
console.log(`total_tokens: ${totalTokens}`)

const inputPriceCalculations: { [key: string]: string } = {};
models.forEach((model) => {
  inputPriceCalculations[model] = `$${getModelPrice(
    model,
    inputTokenCount * numRuns,
    "input"
  ).toFixed(2)}`;
});

const outputPriceCalculations: { [key: string]: string } = {};
models.forEach((model) => {
  outputPriceCalculations[model] = `$${getModelPrice(
    model,
    outputTokenCount * numRuns,
    "output"
  ).toFixed(2)}`;
});

console.log({ inputPriceCalculations });
console.log({ outputPriceCalculations });
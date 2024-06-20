import ExcelJS from "exceljs";
import Papa from "papaparse";
import * as tiktoken from "tiktoken";
import { countTokens, models, getModelPrice } from "./models";

export async function calculatePromptCost(prompt: string) {
  const encoding = tiktoken.get_encoding("cl100k_base");
  const inputTokens = countTokens(prompt, encoding);

  const inputPriceCalculations: { [key: string]: number } = {};
  models.forEach((model) => {
    inputPriceCalculations[model] = getModelPrice(model, inputTokens, "input");
  });

  return {
    inputTokens,
    inputPrices: inputPriceCalculations,
  };
}

export async function calculateTokenCost(file: File): Promise<{
  inputTokens: number;
  outputTokens: number;
  inputPrices: Record<string, number>;
  outputPrices: Record<string, number>;
}> {
  const encoding = tiktoken.get_encoding("cl100k_base");
  let inputTokens = 0;
  let outputTokens = 0;

  if (file.name.endsWith(".xlsx")) {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    // calculate tokens for the input sheet
    const inputSheet = workbook.getWorksheet("input");
    if (inputSheet) {
      inputSheet.eachRow((row) => {
        row.eachCell((cell) => {
          inputTokens += countTokens(cell.value?.toString() || "", encoding);
        });
      });
    }

    // calculate tokens for the output sheet
    const outputSheet = workbook.getWorksheet("output");
    if (outputSheet) {
      outputSheet.eachRow((row) => {
        row.eachCell((cell) => {
          outputTokens += countTokens(cell.value?.toString() || "", encoding);
        });
      });
    }
  } else if (file.name.endsWith(".csv")) {
    // csv doesn't really work
    const text = await file.text();
    const results = Papa.parse<string[]>(text, { header: false });

    results.data.forEach((row) => {
      row.forEach((cell) => {
        inputTokens += countTokens(cell, encoding);
      });
    });
  }

  const inputPriceCalculations: { [key: string]: number } = {};
  models.forEach((model) => {
    inputPriceCalculations[model] = getModelPrice(model, inputTokens, "input");
  });

  const outputPriceCalculations: { [key: string]: number } = {};
  models.forEach((model) => {
    outputPriceCalculations[model] = getModelPrice(
      model,
      outputTokens,
      "output"
    );
  });

  return {
    inputTokens,
    outputTokens,
    inputPrices: inputPriceCalculations,
    outputPrices: outputPriceCalculations,
  };
}

export function getTokenCount(text: string): number {
  const encoding = tiktoken.get_encoding("cl100k_base");
  return countTokens(text, encoding);
}

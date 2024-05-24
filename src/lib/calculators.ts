import ExcelJS from "exceljs";
import Papa from "papaparse";
import * as tiktoken from "tiktoken";
import { countTokens, models, getModelPrice } from "./models";

export async function calculateTokenCost(file: File): Promise<{
  totalTokens: number;
  inputPrices: Record<string, number>;
  outputPrices: Record<string, number>;
}> {
    console.trace("calculateTokenCost")
  const encoding = tiktoken.get_encoding("cl100k_base");
  let totalTokens = 0;

  if (file.name.endsWith(".xlsx")) {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    workbook.eachSheet((sheet) => {
      sheet.eachRow((row) => {
        row.eachCell((cell) => {
          totalTokens += countTokens(cell.value?.toString() || "", encoding);
        });
      });
    });
  } else if (file.name.endsWith(".csv")) {
    const text = await file.text();
    const results = Papa.parse<string[]>(text, { header: false });

    results.data.forEach((row) => {
      row.forEach((cell) => {
        totalTokens += countTokens(cell, encoding);
      });
    });
  }

  const inputPriceCalculations: { [key: string]: number } = {};
  models.forEach((model) => {
    inputPriceCalculations[model] = getModelPrice(model, totalTokens, "input");
  });

  const outputPriceCalculations: { [key: string]: number } = {};
  models.forEach((model) => {
    outputPriceCalculations[model] = getModelPrice(
      model,
      totalTokens,
      "output"
    );
  });

  return {
    totalTokens,
    inputPrices: inputPriceCalculations,
    outputPrices: outputPriceCalculations,
  };
}

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  models,
  getModelPrice,
  getModelLabel,
  countTokens,
  type ModelName,
} from "@/lib/models";
import React, { useState } from "react";
import ExcelJS from "exceljs";
import * as tiktoken from "tiktoken";

export function UploadForm() {
  const [totalTokens, setTotalTokens] = useState<number | null>(null);
  const [prices, setPrices] = useState<{ [key: string]: number }>({});
  const [calculating, setCalculating] = useState(false);

  const reset = () => {
    setTotalTokens(null);
    setPrices({});
    setCalculating(false);
  };

  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setCalculating(true);
    const file = event.target.files?.[0];
    if (!file || !file.name.endsWith(".xlsx")) {
      alert("Please upload a valid XLSX file.");
      reset();
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);
      const encoding = tiktoken.get_encoding("cl100k_base");
      let totalTokens = 0;

      workbook.eachSheet((sheet) => {
        sheet.eachRow((row) => {
          row.eachCell((cell) => {
            totalTokens += countTokens(cell.value?.toString() || "", encoding);
          });
        });
      });

      setTotalTokens(totalTokens);

      const priceCalculations: { [key: string]: number } = {};
      models.forEach((model) => {
        priceCalculations[model] = getModelPrice(model, totalTokens, "input");
      });

      setPrices(priceCalculations);
      setCalculating(false);
    } catch (error) {
      alert(`An error occurred: ${error}`);
    }
  };

  if (calculating) {
    return (
      <div className="mx-auto max-w-md space-y-6 py-12 text-center">
        <h1 className="text-3xl font-bold animate-pulse">Calculating...</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-6 py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-6xl font-extrabold text-primary">
          Bedrock Token Estimator
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-accent">
          Any project can be estimated accurately{" "}
          <span className="italic">(once it's completed)!</span>
        </p>
      </div>
      <form className="space-y-4">
        {!totalTokens && (
          <div className="grid gap-2">
            <Label htmlFor="file">File</Label>
            <Input id="file" type="file" onChange={handleSubmit} />
          </div>
        )}
        {totalTokens && (
          <div className="grid gap-2">
            <Label htmlFor="cost" className="mb-6">
              Estimated Token Input Cost for {totalTokens} tokens
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(prices).map((model) => (
                <div className="flex flex-col gap-2">
                  <Label key={model} htmlFor={model} className="text-lg">
                    {getModelLabel(model as ModelName)}
                  </Label>
                  <Input
                    key={model}
                    id={model}
                    placeholder="$0.00"
                    readOnly
                    type="text"
                    value={`$ ${prices[model].toFixed(2)}`}
                  />
                </div>
              ))}
            </div>
            <Button variant={"destructive"} onClick={reset}>
              Reset
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

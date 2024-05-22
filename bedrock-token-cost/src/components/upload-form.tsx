import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  SelectValue,
  SelectTrigger,
  SelectLabel,
  SelectItem,
  SelectGroup,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
// import { models, prices, type ModelName } from "@/lib/models";
import React, { useState } from "react";
import ExcelJS from "exceljs";
import * as tiktoken from "tiktoken";

type ModelName =
  | "mistral.mistral-7b-instruct-v0:2"
  | "mistral.mixtral-8x7b-instruct-v0:1"
  | "mistral.mistral-large-2402-v1:0"
  | "meta.llama3-8b-instruct-v1:0"
  | "meta.llama3-70b-instruct-v1:0";

const models: ModelName[] = [
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

const getModelPrice = (
  modelName: ModelName,
  numTokens: number,
  inOrOut: "input" | "output"
): number => {
  return (numTokens / 1000) * prices[modelName][inOrOut];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const countTokens = (text: string | null, encoding: any): number => {
  return text ? encoding.encode(text).length : 0;
};

export function UploadForm() {
  const [totalTokens, setTotalTokens] = useState<number | null>(null);
  const [prices, setPrices] = useState<{ [key: string]: number }>({});
  const [calculating, setCalculating] = useState(false);

  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setCalculating(true);
    const file = event.target.files?.[0];
    if (!file || !file.name.endsWith(".xlsx")) {
      alert("Please upload a valid XLSX file.");
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
        <h1 className="text-3xl font-bold">Calculating...</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-6 py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">File Upload</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Any project can be estimated accurately{" "}
          <span className="italic">(once it's completed)!</span>
        </p>
      </div>
      <form className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="file">File</Label>
          <Input id="file" type="file" onChange={handleSubmit} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="model">Language Model</Label>
          <Select name="model">
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Available Models</SelectLabel>
                {models.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cost">Estimated Token Cost</Label>
          {Object.keys(prices).map((model) => (
            <>
              <Label key={model} htmlFor={model}>
                {model}
              </Label>
              <Input
                key={model}
                id={model}
                placeholder="$0.00"
                readOnly
                type="text"
                value={prices[model]}
              />
            </>
          ))}
        </div>
      </form>
    </div>
  );
}

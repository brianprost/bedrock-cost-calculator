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
import Papa from "papaparse";
import * as tiktoken from "tiktoken";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function UploadForm() {
  const [totalTokens, setTotalTokens] = useState<number | null>(null);
  const [inputPrices, setInputPrices] = useState<{ [key: string]: number }>({});
  const [outputPrices, setOutputPrices] = useState<{ [key: string]: number }>(
    {}
  );
  const [calculating, setCalculating] = useState(false);

  const reset = () => {
    setTotalTokens(null);
    setInputPrices({});
    setOutputPrices({});
    setCalculating(false);
  };

  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setCalculating(true);
    const file = event.target.files?.[0];
    if (!file || !(file.name.endsWith(".xlsx") || file.name.endsWith(".csv"))) {
      alert("Please upload a valid XLSX or CSV file.");
      return;
    }

    try {
      const encoding = tiktoken.get_encoding("cl100k_base");
      let totalTokens = 0;

      if (file.name.endsWith(".xlsx")) {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);

        workbook.eachSheet((sheet) => {
          sheet.eachRow((row) => {
            row.eachCell((cell) => {
              totalTokens += countTokens(
                cell.value?.toString() || "",
                encoding
              );
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

      setTotalTokens(totalTokens);

      const inputPriceCalculations: { [key: string]: number } = {};
      models.forEach((model) => {
        inputPriceCalculations[model] = getModelPrice(
          model,
          totalTokens,
          "input"
        );
      });
      setInputPrices(inputPriceCalculations);

      const outputPriceCalculations: { [key: string]: number } = {};
      models.forEach((model) => {
        outputPriceCalculations[model] = getModelPrice(
          model,
          totalTokens,
          "output"
        );
      });
      setOutputPrices(outputPriceCalculations);
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
          Bedrock Cost Calculator
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
          <>
            <Tabs defaultValue={"input"}>
              <TabsList className="grid w-full grid-cols-2 bg-primary/30 text-primary">
                <TabsTrigger value={"input"}>Input</TabsTrigger>
                <TabsTrigger value={"output"}>Output</TabsTrigger>
              </TabsList>
              <TabsContent value={"input"}>
                <div className="grid gap-2">
                  <Label htmlFor="cost" className="mb-6">
                    Estimated Token Input Cost for {totalTokens} tokens
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(inputPrices).map((model) => (
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
                          value={`$ ${inputPrices[model].toFixed(2)}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value={"output"}>
                <div className="grid gap-2">
                  <Label htmlFor="cost" className="mb-6">
                    Estimated Token Output Cost for {totalTokens} tokens
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(outputPrices).map((model) => (
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
                          value={`$ ${outputPrices[model].toFixed(2)}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Button variant={"destructive"} onClick={reset} className="w-full">
              Reset
            </Button>
          </>
        )}
      </form>
    </div>
  );
}

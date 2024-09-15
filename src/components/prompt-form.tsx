import { useState } from "react";
import { AutosizeTextarea } from "./ui/autosize-textarea";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { calculatePromptCost } from "@/lib/calculators";
import { ModelName, getModelLabel } from "@/lib/models";
import { Input } from "./ui/input";

export function PromptForm() {
  const [promptText, setPromptText] = useState<string>("");
  const [tokenCount, setTokenCount] = useState<number | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [promptPrices, setPromptPrices] = useState<{ [key: string]: number }>(
    {}
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setCalculating(true);

    try {
      const { inputTokens, inputPrices } = await calculatePromptCost(
        promptText
      );
      setTokenCount(inputTokens);
      setPromptPrices(inputPrices);
      setCalculating(false);
    } catch (error) {
      alert(`An error occurred: ${error}`);
    }
  };

  if (calculating) {
    return (
      <div className="mx-auto max-w-md space-y-6 py-12 text-center">
        <h1 className="text-3xl font-bold animate-pulse">
          Solving today's Wordle...
        </h1>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      <div className="w-1/2">
        <Label htmlFor="text" className="text-accent">
          Text
        </Label>
        <AutosizeTextarea
          name="prompt"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="Paste text here"
          className="h-full"
        />
      </div>
      <div className="w-1/2">
        <form onSubmit={handleSubmit} className="my-6">
          <Button
            className="w-full"
            variant={"default"}
            type="submit"
          >
            Calculate
          </Button>
        </form>
        {!!promptPrices && !!tokenCount && (
          <div className="grid gap-2">
            <Label htmlFor="cost" className="mb-2">
              Estimated Token Input Cost for {tokenCount} tokens
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(promptPrices).map((model, index) => (
                <div className="flex flex-col gap-1" key={`input_${index}`}>
                  <Label htmlFor={model} className="text-sm">
                    {getModelLabel(model as ModelName)}
                  </Label>
                  <Input
                    id={model}
                    placeholder="$0.00"
                    readOnly
                    type="text"
                    value={`$ ${promptPrices[model].toFixed(4)}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

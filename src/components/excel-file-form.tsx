import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getModelLabel, type ModelName } from "@/lib/models"
import type React from "react"
import { useState } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { calculateTokenCost } from "@/lib/calculators"

export function ExcelFileForm() {
	const [inputTokens, setInputTokens] = useState<number | null>(null)
	const [outputTokens, setOutputTokens] = useState<number | null>(null)
	const hasBothTokens = inputTokens && outputTokens
	const [inputPrices, setInputPrices] = useState<{ [key: string]: number }>({})
	const [outputPrices, setOutputPrices] = useState<{ [key: string]: number }>(
		{},
	)
	const [calculating, setCalculating] = useState(false)

	const reset = () => {
		setInputTokens(null)
		setOutputTokens(null)
		setInputPrices({})
		setOutputPrices({})
		setCalculating(false)
	}

	const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>) => {
		setCalculating(true)
		const file = event.target.files?.[0]
		if (!file || !(file.name.endsWith(".xlsx") || file.name.endsWith(".csv"))) {
			alert("Please upload a valid XLSX or CSV file.")
			return
		}

		try {
			const { inputTokens, outputTokens, inputPrices, outputPrices } =
				await calculateTokenCost(file)
			setInputTokens(inputTokens)
			setOutputTokens(outputTokens)
			setInputPrices(inputPrices)
			setOutputPrices(outputPrices)
			setCalculating(false)
		} catch (error) {
			alert(`An error occurred: ${error}`)
		}
	}

	if (calculating) {
		return (
			<div className="mx-auto max-w-md space-y-6 py-12 text-center">
				<h1 className="text-3xl font-bold animate-pulse">
					Solving today's Wordle...
				</h1>
			</div>
		)
	}
	return (
		<>
			<p className="dark:text-gray-400 text-accent">
				Upload an XLSX file with two sheets, one named{" "}
				<span className="font-mono">input</span> and the other named{" "}
				<span className="font-mono">output</span>.
			</p>
			<form className="space-y-4">
				{!hasBothTokens && (
					<div className="grid gap-2">
						<Label htmlFor="file">File</Label>
						<Input id="file" type="file" onChange={handleSubmit} />
					</div>
				)}
				{hasBothTokens && (
					<>
						<Tabs defaultValue={"input"}>
							<TabsList className="grid w-full grid-cols-2 bg-primary/30 text-primary">
								<TabsTrigger value={"input"}>Input</TabsTrigger>
								<TabsTrigger value={"output"}>Output</TabsTrigger>
							</TabsList>
							<TabsContent value={"input"}>
								<div className="grid gap-2">
									<Label htmlFor="cost" className="mb-6">
										Estimated Token Input Cost for {inputTokens} tokens
									</Label>
									<div className="grid grid-cols-2 gap-2">
										{Object.keys(inputPrices).map((model) => (
											<div
												className="flex flex-col gap-2"
												key={`input_${model}`}
											>
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
										Estimated Token Output Cost for {outputTokens} tokens
									</Label>
									<div className="grid grid-cols-2 gap-2">
										{Object.keys(outputPrices).map((model) => (
											<div
												className="flex flex-col gap-2"
												key={`output_${model}`}
											>
												<Label key={model} htmlFor={model} className="text-lg">
													{getModelLabel(model as ModelName)}
												</Label>
												<Input
													key={model}
													id={model}
													placeholder="$0.00"
													readOnly
													type="text"
													value={`$ ${outputPrices[model].toFixed(4)}`}
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
		</>
	)
}

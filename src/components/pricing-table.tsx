import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"

type LLMPricing = {
	modelName: string
	modelId: string
	pricing: {
		input: number
		output: number
	}
}

export function PricingTable({ items }: { items: LLMPricing[] }) {
	return (
		<div className="container mx-auto p-4">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Model</TableHead>
						<TableHead>As Input Tokens</TableHead>
						<TableHead>As Output Tokens</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{items.map((llm) => (
						<TableRow key={llm.modelId}>
							<TableCell>{llm.modelName}</TableCell>
							<TableCell>${llm.pricing.input.toFixed(6)}</TableCell>
							<TableCell>${llm.pricing.output.toFixed(6)}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}

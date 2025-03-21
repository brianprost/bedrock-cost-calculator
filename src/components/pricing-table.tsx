import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card"
import { PRICING } from "@/lib/data"

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
							{["input", "output"].map((key) => (
								<HoverCard key={key}>
									<HoverCardTrigger asChild className="cursor-help">
										<TableCell>
											${llm.pricing[key as keyof typeof llm.pricing].toFixed(6)}
										</TableCell>
									</HoverCardTrigger>
									<HoverCardContent className="w-80">
										<div className="flex space-x-4">
											<div className="space-y-1">
												<h4 className="text-sm font-semibold">
													{llm.modelName}
												</h4>
												<p className="text-sm">
													$
													{Object.keys(PRICING).includes(llm.modelName) &&
														PRICING[llm.modelName as keyof typeof PRICING][
															key as keyof (typeof PRICING)[keyof typeof PRICING]
														].toFixed(5)}{" "}
													per 1k tokens
												</p>
												<div className="flex items-center pt-2">
													<a
														href="https://aws.amazon.com/bedrock/pricing/"
														className="text-xs text-muted-foreground"
													>
														pricing as of 2025-03-14
													</a>
												</div>
											</div>
										</div>
									</HoverCardContent>
								</HoverCard>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}

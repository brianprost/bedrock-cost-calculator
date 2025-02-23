import { useState } from "react"
import { TransitionPanel } from "@/components/ui/transition-panel"

export function PricingPanel({
	items,
}: {
	items: Array<{
		modelName: string
		modelId: string
		pricing: {
			input: number
			output: number
		}
	}>
}) {
	const [activeIndex, setActiveIndex] = useState(0)

	return (
		<div>
			<div className="mb-4 flex space-x-2">
				{items.map((item, index) => (
					<button
						type="button"
						key={`btn_${item.modelId}`}
						onClick={() => setActiveIndex(index)}
						className={`rounded-md px-3 py-1 text-sm font-medium ${
							activeIndex === index
								? "bg-primary text-primary-foreground"
								: "bg-muted text-muted-foreground hover:bg-secondary/70 hover:text-secondary-foreground"
						}`}
					>
						{item.modelName}
					</button>
				))}
			</div>
			<div className="overflow-hidden border-t border-zinc-200 dark:border-zinc-700">
				<TransitionPanel
					activeIndex={activeIndex}
					transition={{ duration: 0.1, ease: "easeInOut" }}
					variants={{
						enter: { opacity: 0, x: -50, filter: "blur(4px)" },
						center: { opacity: 1, x: 0, filter: "blur(0px)" },
						exit: { opacity: 0, x: 50, filter: "blur(4px)" },
					}}
				>
					{items.map((item) => (
						<div key={item.modelId} className="py-2">
							<h3 className="mb-2 font-medium text-zinc-800 dark:text-zinc-100">
								Estimated Pricing for {item.modelName}
							</h3>
							<ul className="text-zinc-600 dark:text-zinc-400">
								<li className="grid grid-cols-2">
									<p>
										if <span className="font-semibold">Input:</span>
									</p>
									<pre>${item.pricing.input.toFixed(6)}</pre>
								</li>
								<li className="grid grid-cols-2">
									<p>
										if <span className="font-semibold">Output:</span>
									</p>
									<pre>${item.pricing.output.toFixed(6)}</pre>
								</li>
							</ul>
							<p className="text-sm text-muted-foreground mt-4">
								Note: Pricing is provided as an estimate and may not reflect
								actual costs from tokenization.
							</p>
						</div>
					))}
				</TransitionPanel>
			</div>
		</div>
	)
}

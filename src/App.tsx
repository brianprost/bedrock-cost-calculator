import { useState, useMemo } from "react"
import { Tabs, TabsList, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PricingTable } from "@/components/pricing-table"
import { inject } from "@vercel/analytics"
import { TokenTable } from "@/components/token-table"
import { TokenText } from "@/components/token-text"
import { exampleText } from "./lib/data"
import { calculatePrices, tokenize } from "./lib/tokenization"
import { VercelTabs } from "./components/ui/vercel-tabs"

export default function App() {
	inject()
	const [text, setText] = useState("")
	const [activeTab, setActiveTab] = useState<"text" | "token-ids" | "pricing">(
		"text",
	)

	const tokens = useMemo(() => tokenize(text), [text])
	const prices = useMemo(() => calculatePrices(tokens.length), [tokens.length])

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h1 className="text-4xl text-primary font-bold mb-6">
				Bedrock Cost Calculator
			</h1>

			<div className="space-y-6">
				<div className="space-y-4">
					<h2 className="text-2xl font-semibold">
						A handy tool to view tokenization and to estimate costs for Amazon
						Bedrock workloads.
					</h2>

					<p className="text-lg text-muted-foreground">
						Large language models (LLMs) handle text by breaking it into tokens,
						which are frequent character sequences in a dataset. These models
						grasp the statistical connections among tokens, excelling in
						predicting the next token in a sequence.
					</p>

					<p className="text-muted-foreground">
						Try the tool below to see how text could be tokenized by a language
						model and count the total number of tokens for your text.{" "}
						<span className="text-sm font-semibold">
							This process runs in your browser and does not send any data to a
							server.
						</span>
					</p>
				</div>

				<div className="flex gap-2">
					<Button variant="destructive" onClick={() => setText("")}>
						Clear
					</Button>
					<Button variant="link" onClick={() => setText(exampleText)}>
						Show example
					</Button>
				</div>

				<Textarea
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder="Enter some text to tokenize..."
					className="min-h-[200px] font-mono space-y-4 max-h-24"
				/>

				<div className="grid grid-cols-2 gap-8">
					<div>
						<div className="text-sm text-muted-foreground mb-2">Tokens</div>
						<div className="text-4xl font-bold">{tokens.length}</div>
					</div>
					<div>
						<div className="text-sm text-muted-foreground mb-2">Characters</div>
						<div className="text-4xl font-bold">{text.length}</div>
					</div>
				</div>

				<div className="space-y-4">
					<Tabs value={activeTab}>
						<TabsList>
							<VercelTabs
								tabs={[
									{ id: "text", label: "Text" },
									{ id: "token-ids", label: "Token IDs" },
									{ id: "pricing", label: "Pricing" },
								]}
								onTabChange={(id) => setActiveTab(id as typeof activeTab)}
							/>
						</TabsList>
						<TabsContent value="text">
							<div className="p-4 bg-muted rounded-lg min-h-[100px]">
								<TokenText tokens={tokens} />
							</div>
						</TabsContent>
						<TabsContent value="token-ids">
							<div className="bg-muted rounded-lg min-h-[100px]">
								<TokenTable tokens={tokens} />
							</div>
						</TabsContent>
						<TabsContent value="pricing">
							<div className="bg-muted rounded-lg min-h-[100px]">
								<PricingTable items={prices} />
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	)
}

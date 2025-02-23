import { useState, useMemo } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { encode } from "gpt-tokenizer"
import { PricingTable } from "./components/pricing-table"
import { inject } from "@vercel/analytics"
import { TokenTable, type Token } from "./components/token-table"
import { TokenText } from "./components/token-text"

const MODELS = {
	"Claude 3 Opus": "us.anthropic.claude-3-opus-20240229-v1:0",
	"Claude 3.5 Sonnet": "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
	"Claude 3.5 Haiku": "us.anthropic.claude-3-5-haiku-20241022-v1:0",
	"Claude 3 Haiku": "us.anthropic.claude-3-haiku-20240307-v1:0",
	"Llama3.3 70B": "us.meta.llama3-3-70b-instruct-v1:0",
	"Llama3.2 11B": "us.meta.llama3-2-11b-instruct-v1:0",
	"Amazon Nova Pro": "us.amazon.nova-pro-v1:0",
	"Amazon Nova Lite": "us.amazon.nova-lite-v1:0",
} as const

type ModelType = keyof typeof MODELS

const exampleText = `I like to think (and
the sooner the better!)
of a cybernetic meadow
where mammals and computers
live together in mutually
programming harmony
like pure water
touching clear sky.

I like to think
(right now, please!)
of a cybernetic forest
filled with pines and electronics
where deer stroll peacefully
past computers
as if they were flowers
with spinning blossoms.

I like to think
(it has to be!)
of a cybernetic ecology
where we are free of our labors
and joined back to nature,
returned to our mammal
brothers and sisters,
and all watched over
by machines of loving grace.

- Richard Brautigan
`

const PRICING = {
	"Claude 3.5 Sonnet": {
		input: 0.003,
		output: 0.015,
	},
	"Claude 3.5 Haiku": {
		input: 0.0008,
		output: 0.004,
	},
	"Claude 3 Opus": {
		input: 0.015,
		output: 0.075,
	},
	"Claude 3 Haiku": {
		input: 0.00025,
		output: 0.00125,
	},
	"Llama3.3 70B": {
		input: 0.00072,
		output: 0.00072,
	},
	"Llama3.2 11B": {
		input: 0.00016,
		output: 0.00016,
	},
	"Amazon Nova Pro": {
		input: 0.0008,
		output: 0.00024,
	},
	"Amazon Nova Lite": {
		input: 0.00006,
		output: 0.0032,
	},
}

/**
 * ## I don't know what color theory is
 */
function getTokenColor(tokenId: number): string {
	const hue = (tokenId * 161.9) % 360
	return `hsl(${hue}, 70%, 75%)`
}

function tokenize(text: string): Token[] {
	const tokenIds = encode(text)
	const tokens: Token[] = []

	// Split the text into utf-8 characters
	const chars = Array.from(text)
	let currentIndex = 0

	for (const id of tokenIds) {
		// Take characters until we match the next token boundary
		let tokenText = ""
		while (currentIndex < chars.length) {
			tokenText += chars[currentIndex]
			currentIndex++

			// Try encoding the current token text
			const check = encode(tokenText)
			if (check[0] === id) break
		}

		tokens.push({
			id,
			text: tokenText,
			color: getTokenColor(id),
		})
	}

	return tokens
}

function calculatePrices(tokenCount: number) {
	return Object.entries(PRICING).map(([modelName, pricing]) => ({
		modelName: modelName,
		modelId: MODELS[modelName as ModelType],
		pricing: {
			input: (tokenCount / 1000) * pricing.input,
			output: (tokenCount / 1000) * pricing.output,
		},
	}))
}

export default function TokenizerPage() {
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
						View LLM tokenization and calculate costs across select models on
						Amazon Bedrock.
					</h2>

					<p className="text-lg text-muted-foreground">
						Large language models (LLMs) handle text by breaking it into tokens,
						which are frequent character sequences in a dataset. These models
						grasp the statistical connections among tokens, excelling in
						predicting the next token in a sequence.
					</p>

					<p className="text-muted-foreground">
						Try the tool below to see how text could be tokenized by a language
						model and count the total number of tokens for your text.
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
					<Tabs
						value={activeTab}
						onValueChange={(v) => setActiveTab(v as typeof activeTab)}
					>
						<TabsList>
							<TabsTrigger value="text">Text</TabsTrigger>
							<TabsTrigger value="token-ids">Token IDs</TabsTrigger>
							<TabsTrigger value="pricing">Pricing</TabsTrigger>
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

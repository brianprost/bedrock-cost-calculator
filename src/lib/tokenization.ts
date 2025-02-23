import { encode } from "gpt-tokenizer"
import type { Token } from "@/lib/types"
import { PRICING, MODELS } from "@/lib/data"
import type { ModelType } from "@/lib/types"
import { v7 as uuidv7 } from "uuid"

export function calculatePrices(tokenCount: number) {
	return Object.entries(PRICING).map(([modelName, pricing]) => ({
		modelName: modelName,
		modelId: MODELS[modelName as ModelType],
		pricing: {
			input: (tokenCount / 1000) * pricing.input,
			output: (tokenCount / 1000) * pricing.output,
		},
	}))
}

export function tokenize(text: string): Token[] {
	const tokenIds = encode(text)
	const tokens: Token[] = []

	// Split the text into utf-8 characters
	const chars = Array.from(text)
	let currentIndex = 0

	for (const tokenId of tokenIds) {
		// Take characters until we match the next token boundary
		let tokenText = ""
		while (currentIndex < chars.length) {
			tokenText += chars[currentIndex]
			currentIndex++

			// Try encoding the current token text
			const check = encode(tokenText)
			if (check[0] === tokenId) break
		}

		tokens.push({
			id: uuidv7(), // Generate unique ID for React key
			tokenId, // Keep original token ID for reference
			text: tokenText,
			color: getTokenColor(tokenId),
		})
	}

	return tokens
}

function getTokenColor(tokenId: number): string {
	const hue = (tokenId * 161.9) % 360
	return `hsl(${hue}, 70%, 75%)`
}

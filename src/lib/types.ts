import type { MODELS } from "./data"

export type ModelType = keyof typeof MODELS

export type Token = {
	id: string
	text: string
	tokenId: number
	color: string
}
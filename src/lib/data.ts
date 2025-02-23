export const MODELS = {
	"Claude 3 Opus": "us.anthropic.claude-3-opus-20240229-v1:0",
	"Claude 3.5 Sonnet": "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
	"Claude 3.5 Haiku": "us.anthropic.claude-3-5-haiku-20241022-v1:0",
	"Claude 3 Haiku": "us.anthropic.claude-3-haiku-20240307-v1:0",
	"Llama3.3 70B": "us.meta.llama3-3-70b-instruct-v1:0",
	"Llama3.2 11B": "us.meta.llama3-2-11b-instruct-v1:0",
	"Amazon Nova Pro": "us.amazon.nova-pro-v1:0",
	"Amazon Nova Lite": "us.amazon.nova-lite-v1:0",
} as const

export const PRICING = {
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
} as const

export const exampleText = `I like to think (and
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
` as const

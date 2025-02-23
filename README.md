# Bedrock Cost Calculator

A web-based tool to visualize tokenization and estimate costs for Amazon Bedrock workloads.

## Features

- Real-time text tokenization visualization
- Token count and character count display
- Cost estimation for multiple Amazon Bedrock models
- Browser-based processing

## Supported Models

> These models were chosen because they are the only viable ones for my use cases. If you need a different model, feel free to open an issue or PR.

- Claude 3 Opus
- Claude 3.5 Sonnet
- Claude 3.5 Haiku
- Claude 3 Haiku
- Llama3.3 70B
- Llama3.2 11B
- Amazon Nova Pro
- Amazon Nova Lite

## Getting Started

### Prerequisites

- Node.js / Deno / Bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bedrock-cost-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run Biome linter
- `npm run format` - Format code with Biome

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- GPT Tokenizer
- Shadcn UI
- Vite

## License

MIT License


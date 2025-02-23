import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
export type Token = {
	text: string
	id: number
	color: string
}

export function TokenTable({ tokens }: { tokens: Token[] }) {
	return (
		<div className="container mx-auto p-4">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Text</TableHead>
						<TableHead>Length</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{tokens.map((token) => (
						<TableRow key={token.id}>
							<TableCell className="font-mono font-bold">{token.id}</TableCell>
							<TableCell>{JSON.stringify(token.text)}</TableCell>
							<TableCell>{token.text.length}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}

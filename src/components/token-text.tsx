import { Token } from "./token-table";

export function TokenText({ tokens }: { tokens: Token[] }) {
    return (
        <div className="flex flex-wrap gap-1">
        {tokens.map((token) => (
            <span
            key={token.id}
            className="rounded px-1 py-0.5 relative border border-gray-300 shadow-sm transition-all duration-200 ease-in-out hover:shadow-md font-mono"
            style={{ backgroundColor: token.color }}
            >
            {token.text}
            </span>
        ))}
        </div>
    );
}
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExcelFileForm } from "./excel-file-form"
import { PromptForm } from "./prompt-form"

export function UploadForm() {
	return (
		<div className="mx-auto max-w-xl space-y-6 py-12">
			<div className="space-y-2 text-center">
				<h1 className="text-6xl font-extrabold text-primary">
					Bedrock Cost Calculator
				</h1>
			</div>
			<Tabs defaultValue="prompt">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="prompt">Paste Text</TabsTrigger>
					<TabsTrigger value="excel">Upload Excel File</TabsTrigger>
				</TabsList>
				<TabsContent value="prompt">
					<PromptForm />
				</TabsContent>
				<TabsContent value="excel">
					<ExcelFileForm />
				</TabsContent>
			</Tabs>
		</div>
	)
}

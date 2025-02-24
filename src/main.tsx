import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"

import "@fontsource/ubuntu/300.css"
import "@fontsource/ubuntu/400.css"
import "@fontsource/ubuntu/500.css"
import "@fontsource/ubuntu/700.css"
import "@fontsource/ubuntu-mono/400.css"
import "@fontsource/ubuntu-mono/700.css"

const rootElement = document.getElementById("root")
if (rootElement) {
	ReactDOM.createRoot(rootElement).render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
	)
}

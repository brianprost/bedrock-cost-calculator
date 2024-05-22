import { UploadForm } from "./components/upload-form";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <>
      <UploadForm />
      <Analytics />
    </>
  );
}

export default App;

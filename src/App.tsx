import { UploadForm } from "./components/upload-form";
import { inject } from "@vercel/analytics";

function App() {
  inject();
  return (
    <>
      <UploadForm />
    </>
  );
}

export default App;

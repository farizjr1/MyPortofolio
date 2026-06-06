import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl } from "@workspace/api-client-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Di production (Vercel): arahkan semua request API ke Railway backend
// Di development (Replit): biarkan kosong — URL relatif /api/... sudah ditangani proxy
const apiUrl = import.meta.env.VITE_API_URL;
if (apiUrl) {
  setBaseUrl(apiUrl);
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/queryClient";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);

// 5. Firma
console.log(
  `%c💻 Sistema desarrollado por T.S.H.M.`,
  "color: #4f46e5; font-size: 14px; font-weight: bold;"
);
console.log(
  "%c📅 13/06/2025 · 🛠️ Tecnologías: React, TypeScript, Laravel",
  "color: #6b7280; font-size: 12px;"
);
console.log(
  "%c - “Wake me up when you need me”. - Master Chief 🎮",
  "color: #10b981; font-style: italic;"
);


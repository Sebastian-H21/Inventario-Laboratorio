import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
console.log(
  `%c💻 Sistema desarrollado por T.S.H.M. –https://github.com/Sebastian-H21`,
  "color: #4f46e5; font-size: 14px; font-weight: bold;"
);
console.log(
  "%c📅 11/06/2025 · 🛠️ Tecnologías: React, TypeScript, Laravel",
  "color: #6b7280; font-size: 12px;"
);
console.log(
  "%c - “Wake me up when you need me”. - Master Chief 🎮",
  "color: #10b981; font-style: italic;"
);
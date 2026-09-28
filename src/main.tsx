import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import "./safari.css"

if (/Safari/i.test(navigator.userAgent) && !/Chrome|Chromium|CriOS|FxiOS|EdgiOS|Android/i.test(navigator.userAgent)) {
  document.documentElement.classList.add("is-safari")
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

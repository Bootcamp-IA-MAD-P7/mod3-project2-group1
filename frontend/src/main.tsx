import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@/index.css"
import { App } from "@/app/App"
import { AppearanceProvider } from "@/app/providers/appearance-provider"
import { LanguageProvider } from "@/app/providers/language-provider"
createRoot(document.getElementById("root")!).render(<StrictMode><LanguageProvider><AppearanceProvider><App /></AppearanceProvider></LanguageProvider></StrictMode>)

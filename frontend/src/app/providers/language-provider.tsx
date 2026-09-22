import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { translations, type LanguageCode } from "@/shared/i18n/translations"
export type { LanguageCode } from "@/shared/i18n/translations"
export const LANGUAGE_STORAGE_KEY = "civika-language"
interface LanguageContextValue { language: LanguageCode; setLanguage: (language: LanguageCode) => void; t: (key: string) => string }
const fallback: LanguageContextValue = { language:"en", setLanguage:()=>undefined, t:(key)=>translations.en[key] ?? key }
const LanguageContext = createContext<LanguageContextValue>(fallback)
function readStoredLanguage(): LanguageCode { try { return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === "es" ? "es" : "en" } catch { return "en" } }
export function LanguageProvider({ children }: { children: ReactNode }) { const [language, setLanguage] = useState<LanguageCode>(readStoredLanguage); useEffect(() => { document.documentElement.lang = language; try { window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language) } catch { /* optional persistence */ } }, [language]); const t=(key:string)=>translations[language][key] ?? translations.en[key] ?? key; return <LanguageContext.Provider value={{language,setLanguage,t}}>{children}</LanguageContext.Provider> }
export function useLanguage(){ return useContext(LanguageContext) }

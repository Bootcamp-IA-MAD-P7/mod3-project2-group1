import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it } from "vitest"
import { AppearanceProvider } from "@/app/providers/appearance-provider"
import { LANGUAGE_STORAGE_KEY, LanguageProvider } from "@/app/providers/language-provider"
import { LanguageSelector } from "@/shared/layout/language-selector"

afterEach(() => window.localStorage.clear())
function renderSelector() { return render(<LanguageProvider><AppearanceProvider><LanguageSelector /></AppearanceProvider></LanguageProvider>) }
describe("LanguageProvider", () => {
  it("defaults to English and sets the document language", () => { renderSelector(); expect(screen.getByRole("button", {name:"Choose language"}).textContent).toContain("English"); expect(document.documentElement.lang).toBe("en") })
  it("switches to Spanish and persists the choice", async () => { const user=userEvent.setup(); renderSelector(); await user.click(screen.getByRole("button", {name:"Choose language"})); await user.click(screen.getByText("Español")); expect(screen.getByRole("button", {name:"Elegir idioma"}).textContent).toContain("Español"); expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("es"); expect(document.documentElement.lang).toBe("es") })
  it("restores a persisted language", () => { window.localStorage.setItem(LANGUAGE_STORAGE_KEY,"es"); renderSelector(); expect(screen.getByRole("button", {name:"Elegir idioma"}).textContent).toContain("Español") })
})


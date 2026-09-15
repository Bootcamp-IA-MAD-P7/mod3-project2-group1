import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

export type AppearanceTheme = "light" | "dark"

export interface AppearanceState {
  theme: AppearanceTheme
  brightness: number
  intensity: number
}

export const MIN_BRIGHTNESS = 20
export const MAX_BRIGHTNESS = 100
export const DEFAULT_BRIGHTNESS = 100
export const DEFAULT_INTENSITY = 100

export interface AppearanceContextValue extends AppearanceState {
  setTheme: (theme: AppearanceTheme) => void
  setBrightness: (brightness: number) => void
  setIntensity: (intensity: number) => void
  reset: () => void
}

const STORAGE_KEY = "moder-ai-appearance"

export const DEFAULT_APPEARANCE: AppearanceState = {
  theme: "light",
  brightness: DEFAULT_BRIGHTNESS,
  intensity: DEFAULT_INTENSITY,
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function readStored(): AppearanceState {
  if (typeof window === "undefined") {
    return DEFAULT_APPEARANCE
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_APPEARANCE
    const parsed = JSON.parse(raw) as Partial<AppearanceState>
    return {
      theme: parsed.theme === "dark" ? "dark" : "light",
      brightness: clamp(Number(parsed.brightness) || DEFAULT_BRIGHTNESS, MIN_BRIGHTNESS, MAX_BRIGHTNESS),
      intensity: clamp(Number(parsed.intensity) || DEFAULT_INTENSITY, 0, 100),
    }
  } catch {
    return DEFAULT_APPEARANCE
  }
}

function applyToDocument(state: AppearanceState) {
  const root = document.documentElement
  root.classList.toggle("dark", state.theme === "dark")
  root.style.setProperty("--app-brightness", String(state.brightness / MAX_BRIGHTNESS))
  root.style.setProperty("--app-intensity", String(state.intensity / MAX_BRIGHTNESS))
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null)

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppearanceState>(() => {
    const stored = readStored()
    applyToDocument(stored)
    return stored
  })

  useEffect(() => {
    applyToDocument(state)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Persistencia opcional: la sesión continúa si localStorage no está disponible.
    }
  }, [state])

  const setTheme = useCallback((theme: AppearanceTheme) => {
    setState((current) => ({ ...current, theme }))
  }, [])

  const setBrightness = useCallback((brightness: number) => {
    setState((current) => ({
      ...current,
      brightness: clamp(brightness, MIN_BRIGHTNESS, MAX_BRIGHTNESS),
    }))
  }, [])

  const setIntensity = useCallback((intensity: number) => {
    setState((current) => ({ ...current, intensity: clamp(intensity, 0, 100) }))
  }, [])

  const reset = useCallback(() => {
    setState(DEFAULT_APPEARANCE)
  }, [])

  return (
    <AppearanceContext.Provider
      value={{ ...state, setTheme, setBrightness, setIntensity, reset }}
    >
      {children}
    </AppearanceContext.Provider>
  )
}

export function useAppearance() {
  const context = useContext(AppearanceContext)
  if (!context) {
    throw new Error("useAppearance must be used within an AppearanceProvider")
  }
  return context
}
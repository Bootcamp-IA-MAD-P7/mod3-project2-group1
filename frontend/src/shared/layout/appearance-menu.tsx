import { RotateCcw, Settings2, Sun, Moon } from "lucide-react"

import {
  useAppearance,
  type AppearanceTheme,
} from "@/app/providers/appearance-provider"
import { AccessibilitySlider } from "@/shared/ui/accessibility-slider"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"

const THEME_OPTIONS: { value: AppearanceTheme; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
]

export function AppearanceMenu() {
  const { theme, brightness, intensity, setTheme, setBrightness, setIntensity, reset } =
    useAppearance()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Appearance settings"
          className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <Settings2 className="size-4" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-3">
        <DropdownMenuLabel className="text-sm font-semibold">Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Theme toggle */}
        <div
          role="radiogroup"
          aria-label="Color theme"
          className="mb-3 flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800"
        >
          {THEME_OPTIONS.map(({ value, label, Icon }) => {
            const isActive = theme === value
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={isActive}
                aria-label={`${label} mode`}
                onClick={() => setTheme(value)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-white text-violet-700 shadow-sm dark:bg-slate-900 dark:text-violet-300"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                )}
              >
                <Icon className="size-3.5" aria-hidden="true" />
                {label}
              </button>
            )
          })}
        </div>

        {/* Brightness */}
        <div className="mb-3">
          <AccessibilitySlider
            label="Brightness"
            min={20}
            max={100}
            value={brightness}
            onValueChange={setBrightness}
            formatValue={(raw) => `${raw}%`}
          />
        </div>

        {/* Visual intensity */}
        <div className="mb-3">
          <AccessibilitySlider
            label="Visual intensity"
            min={0}
            max={100}
            value={intensity}
            onValueChange={setIntensity}
            formatValue={(raw) => `${raw}%`}
          />
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => reset()}
          className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 focus:text-violet-700 dark:text-slate-300 dark:focus:text-violet-300"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Reset settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
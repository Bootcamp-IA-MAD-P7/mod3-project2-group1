import { Moon, RotateCcw, Settings2, Sun } from "lucide-react"

import { useAppearance, type AppearanceTheme } from "@/app/providers/appearance-provider"
import { useLanguage } from "@/app/providers/language-provider"
import { cn } from "@/lib/utils"
import { AccessibilitySlider } from "@/shared/ui/accessibility-slider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"

export function AppearanceMenu() {
  const { theme, brightness, intensity, setTheme, setBrightness, setIntensity, reset } = useAppearance()
  const { t } = useLanguage()
  const options: { value: AppearanceTheme; key: string; Icon: typeof Sun }[] = [
    { value: "light", key: "appearance.light", Icon: Sun },
    { value: "dark", key: "appearance.dark", Icon: Moon },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label={t("appearance.label")} className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
          <Settings2 className="size-4" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-3">
        <DropdownMenuLabel className="text-sm font-semibold">{t("appearance.title")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div role="radiogroup" aria-label={t("appearance.colorTheme")} className="mb-3 flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {options.map(({ value, key, Icon }) => {
            const active = theme === value
            const label = t(key)
            return (
              <button key={value} type="button" role="radio" aria-checked={active} aria-label={`${label} ${t("appearance.mode")}`} onClick={() => setTheme(value)} className={cn("flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors", active ? "bg-white text-violet-700 shadow-sm dark:bg-slate-900 dark:text-violet-300" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200")}>
                <Icon className="size-3.5" aria-hidden="true" />
                {label}
              </button>
            )
          })}
        </div>
        <div className="mb-3"><AccessibilitySlider label={t("appearance.brightness")} min={20} max={100} value={brightness} onValueChange={setBrightness} formatValue={(raw) => `${raw}%`} /></div>
        <div className="mb-3"><AccessibilitySlider label={t("appearance.visualIntensity")} min={0} max={100} value={intensity} onValueChange={setIntensity} formatValue={(raw) => `${raw}%`} /></div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => reset()} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 focus:text-violet-700 dark:text-slate-300 dark:focus:text-violet-300">
          <RotateCcw className="size-3.5" aria-hidden="true" />
          {t("appearance.reset")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

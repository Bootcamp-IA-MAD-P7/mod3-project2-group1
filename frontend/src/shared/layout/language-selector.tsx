import { useState } from "react"
import { Check, ChevronDown, Globe } from "lucide-react"

import { LANGUAGES } from "@/mocks/dashboard"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"

type LanguageLabel = "English" | "Español"

export function LanguageSelector() {
  const [selected, setSelected] = useState<LanguageLabel>("English")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Choose language"
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <Globe className="size-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
          <span>{selected}</span>
          <ChevronDown className="size-3.5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuLabel className="sr-only">Select language</DropdownMenuLabel>
        {LANGUAGES.map((language) => {
          const isActive = language.label === selected
          return (
            <DropdownMenuItem
              key={language.code}
              onSelect={() => setSelected(language.label as LanguageLabel)}
              className={cn(
                "cursor-pointer",
                isActive && "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"
              )}
            >
              <Check
                className={cn("size-4", isActive ? "opacity-100" : "opacity-0")}
                aria-hidden="true"
              />
              {language.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
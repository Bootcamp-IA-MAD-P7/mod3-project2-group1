import * as React from "react"

import { cn } from "@/lib/utils"

interface SliderProps extends Omit<React.ComponentProps<"input">, "type"> {
  label: string
  min: number
  max: number
  step?: number
  value: number
  onValueChange: (value: number) => void
  formatValue?: (value: number) => string
}

export function AccessibilitySlider({
  label,
  min,
  max,
  step = 1,
  value,
  onValueChange,
  formatValue = (raw) => String(raw),
  className,
  ...props
}: SliderProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-medium text-slate-900 dark:text-slate-100">{label}</label>
        <output className="min-w-10 rounded-md bg-violet-50 px-2 py-0.5 text-center text-xs font-semibold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
          {formatValue(value)}
        </output>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onValueChange(Number(event.currentTarget.value))}
        aria-label={label}
        className={cn(
          "h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-violet-600 transition-colors dark:bg-slate-700 dark:accent-violet-400",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
          className
        )}
        {...props}
      />
    </div>
  )
}
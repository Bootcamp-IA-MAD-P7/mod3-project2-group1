import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  eyebrow: string
  title: string
  description: string
  icon?: ReactNode
}

export function SectionHeading({ eyebrow, title, description, icon }: SectionHeadingProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-700 dark:text-violet-300">{eyebrow}</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
      </div>
      {icon && <span aria-hidden="true" className="grid size-10 place-items-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">{icon}</span>}
    </div>
  )
}

const METRIC_TONES = {
  default: "border-violet-100 bg-violet-50/45 dark:border-violet-400/15 dark:bg-violet-500/5",
  evidence: "border-violet-200 bg-gradient-to-br from-violet-100/75 to-violet-50/45 dark:border-violet-400/25 dark:from-violet-500/18 dark:to-violet-500/5",
  selected: "border-violet-300 bg-gradient-to-br from-violet-200/75 to-white dark:border-violet-300/30 dark:from-violet-500/25 dark:to-slate-900",
  artifact: "border-violet-200 bg-slate-50/75 dark:border-violet-400/20 dark:bg-slate-800/55",
} as const

export function MetricValue({ label, value, detail, icon, tone = "default" }: { label: string; value: string; detail?: string; icon?: ReactNode; tone?: keyof typeof METRIC_TONES }) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl border p-4", METRIC_TONES[tone])}>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-violet-400/60 dark:bg-violet-300/50" />
      <div className="flex items-start justify-between gap-3">
        <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</dt>
        {icon && <span aria-hidden="true" className="text-violet-600 dark:text-violet-300">{icon}</span>}
      </div>
      <dd className="mt-2 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">{value}</dd>
      {detail && <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{detail}</p>}
    </div>
  )
}

export function ConfusionMatrix({ matrix, model, fold }: { matrix: [[number, number], [number, number]]; model: string; fold: number }) {
  const [[tn, fp], [fn, tp]] = matrix

  return (
    <table className="mt-3 w-full border-separate border-spacing-1 text-center text-xs" aria-label={`${model}, fold ${fold} confusion matrix`}>
      <caption className="sr-only">{model}, fold {fold}: rows are actual class and columns are predicted class.</caption>
      <thead>
        <tr>
          <th scope="col" />
          <th scope="col" className="rounded-md bg-slate-100 px-2 py-1.5 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">Pred. Non-hate</th>
          <th scope="col" className="rounded-md bg-slate-100 px-2 py-1.5 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">Pred. Hate</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row" className="text-left font-medium text-slate-600 dark:text-slate-300">Actual Non-hate</th>
          <td className="rounded-md bg-violet-100/70 px-2 py-1.5 font-semibold text-slate-800 dark:bg-violet-500/20 dark:text-violet-100">TN {tn}</td>
          <td className="rounded-md bg-slate-100 px-2 py-1.5 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">FP {fp}</td>
        </tr>
        <tr>
          <th scope="row" className="text-left font-medium text-slate-600 dark:text-slate-300">Actual Hate</th>
          <td className="rounded-md bg-slate-100 px-2 py-1.5 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">FN {fn}</td>
          <td className="rounded-md bg-violet-100/70 px-2 py-1.5 font-semibold text-slate-800 dark:bg-violet-500/20 dark:text-violet-100">TP {tp}</td>
        </tr>
      </tbody>
    </table>
  )
}

export function TechnicalBadge({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:border-violet-400/20 dark:bg-violet-500/15 dark:text-violet-200", className)}>{children}</span>
}

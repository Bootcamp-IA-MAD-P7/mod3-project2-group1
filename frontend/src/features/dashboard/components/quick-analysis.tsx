import { Clapperboard, MessageSquareText } from "lucide-react"

import { Card } from "@/shared/ui/card"

const QUICK_ANALYSIS_OPTIONS = [
  {
    title: "Analyze comment",
    description: "Use the dedicated Analyze Comment section to review one comment.",
    icon: MessageSquareText,
  },
  {
    title: "Analyze video",
    description: "Use the dedicated Analyze Video section to review a video.",
    icon: Clapperboard,
  },
]

export function QuickAnalysis() {
  return (
    <Card className="relative h-full overflow-hidden p-5 sm:p-6">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 to-purple-600" />
      <span
        aria-hidden="true"
        className="grid size-10 place-items-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400"
      >
        <MessageSquareText className="size-5" />
      </span>

      <h2 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">Start a new analysis</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        Choose the type of content you want to analyze.
      </p>

      <ul className="mt-6 space-y-3" aria-label="Available analysis areas">
        {QUICK_ANALYSIS_OPTIONS.map((option) => (
          <li key={option.title} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <div className="flex items-start gap-3">
              <option.icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-violet-600 dark:text-violet-400" />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{option.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{option.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
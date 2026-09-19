import type { ClassificationCount } from "@/features/dashboard/dashboard-view-model"
import { Card } from "@/shared/ui/card"

interface ModerationOverviewProps {
  totalAnalyzed: number
  classifications: ClassificationCount[]
}

const LABELS = {
  hate: "Hate",
  non_hate: "Non-hate",
} as const

const COLORS = {
  hate: "bg-orange-500 dark:bg-orange-400",
  non_hate: "bg-emerald-500 dark:bg-emerald-400",
} as const

export function ModerationOverview({ totalAnalyzed, classifications }: ModerationOverviewProps) {
  return (
    <Card className="h-full p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Toxicity distribution</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Current distribution of analyzed comments
          </p>
        </div>
        <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700 dark:bg-violet-500/15 dark:text-violet-200">
          {totalAnalyzed.toLocaleString("en-US")} comments
        </span>
      </div>

      <div
        aria-label={`Distribution of ${totalAnalyzed.toLocaleString("en-US")} analyzed comments`}
        className="mt-8 space-y-6"
      >
        {classifications.map((classification) => {
          const percentage = totalAnalyzed === 0 ? 0 : (classification.count / totalAnalyzed) * 100
          const label = LABELS[classification.label]

          return (
            <div key={classification.label}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium text-slate-800 dark:text-slate-200">{label}</span>
                <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
                  {classification.count.toLocaleString("en-US")} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={Math.round(percentage)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${label}: ${percentage.toFixed(1)} percent of analyzed comments`}
                className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700"
              >
                <div className={`h-full rounded-full ${COLORS[classification.label]}`} style={{ width: `${percentage}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

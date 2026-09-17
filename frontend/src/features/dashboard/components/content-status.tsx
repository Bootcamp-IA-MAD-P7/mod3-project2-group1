import type { ClassificationCount } from "@/features/dashboard/dashboard-view-model"
import { Card } from "@/shared/ui/card"
import { cn } from "@/lib/utils"

interface ContentStatusProps {
  totalAnalyzed: number
  classifications: ClassificationCount[]
}

const STATUS_DETAILS = {
  hate: {
    label: "Hate",
    bar: "bg-violet-600",
    dot: "bg-violet-600",
  },
  non_hate: {
    label: "Non-hate",
    bar: "bg-violet-200 dark:bg-violet-400",
    dot: "bg-violet-400",
  },
} as const

export function ContentStatus({ totalAnalyzed, classifications }: ContentStatusProps) {
  return (
    <Card className="h-full p-5 sm:p-6">
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">Content status</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Distribution by classification
      </p>

      <ul className="mt-6 space-y-5">
        {classifications.map((classification) => {
          const detail = STATUS_DETAILS[classification.label]
          const percentage = totalAnalyzed === 0 ? 0 : (classification.count / totalAnalyzed) * 100

          return (
            <li key={classification.label}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="inline-flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                  <span aria-hidden="true" className={cn("size-2 rounded-full", detail.dot)} />
                  {detail.label}
                </span>
                <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
                  {classification.count.toLocaleString("en-US")}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div
                  role="progressbar"
                  aria-valuenow={Math.round(percentage)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${detail.label}: ${percentage.toFixed(1)} percent of analyzed comments`}
                  className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700"
                >
                  <div className={cn("h-full rounded-full", detail.bar)} style={{ width: `${percentage}%` }} />
                </div>
                <span className="w-14 shrink-0 text-right text-sm font-semibold tabular-nums text-slate-900 dark:text-white">
                  {percentage.toFixed(1)}%
                </span>
              </div>
            </li>
          )
        })}
      </ul>

      <p className="mt-6 border-t border-slate-100 pt-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        {totalAnalyzed.toLocaleString("en-US")} comments analyzed
      </p>
    </Card>
  )
}
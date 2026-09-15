import { CONTENT_STATUS, CONTENT_STATUS_TOTAL } from "@/mocks/dashboard"
import { Card } from "@/shared/ui/card"
import { cn } from "@/lib/utils"

export function ContentStatus() {
  return (
    <Card className="h-full p-5 sm:p-6">
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">Content status</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Distribution by moderation status</p>

      <ul className="mt-6 space-y-5">
        {CONTENT_STATUS.map((item) => (
          <li key={item.id}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="inline-flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                <span
                  aria-hidden="true"
                  className={cn("size-2 rounded-full", item.dot)}
                />
                {item.label}
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">{item.count}</span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <div
                role="progressbar"
                aria-valuenow={item.percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${item.label}: ${item.percentage}% of analyzed comments`}
                className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700"
              >
                <div
                  className={cn("h-full rounded-full", item.bar)}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="w-12 shrink-0 text-right text-sm font-semibold tabular-nums text-slate-900 dark:text-white">
                {item.percentage}%
              </span>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-6 border-t border-slate-100 pt-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        {CONTENT_STATUS_TOTAL}
      </p>
    </Card>
  )
}
import type { DashboardStat } from "@/features/dashboard/dashboard-view-model"
import { Card } from "@/shared/ui/card"
import { cn } from "@/lib/utils"

const TONE_STYLES = {
  violet: {
    card: "border-violet-100 bg-violet-50/40 dark:border-violet-400/15 dark:bg-violet-500/5",
    icon: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  },
  green: {
    card: "border-emerald-100 bg-emerald-50/40 dark:border-emerald-400/15 dark:bg-emerald-500/5",
    icon: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  orange: {
    card: "border-orange-100 bg-orange-50/40 dark:border-orange-400/15 dark:bg-orange-500/5",
    icon: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  },
} as const

export function StatCard({ stat }: { stat: DashboardStat }) {
  const Icon = stat.icon
  const styles = TONE_STYLES[stat.tone]

  return (
    <Card className={cn("relative overflow-hidden p-5 sm:p-6", styles.card)}>
      <span aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-0.5", styles.icon)} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {stat.value.toLocaleString("en-US")}
          </p>
        </div>
        <span
          aria-hidden="true"
          className={cn("grid size-10 shrink-0 place-items-center rounded-xl", styles.icon)}
        >
          <Icon className="size-5" />
        </span>
      </div>
    </Card>
  )
}

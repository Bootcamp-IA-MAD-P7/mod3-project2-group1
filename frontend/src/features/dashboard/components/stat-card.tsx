import type { DashboardStat } from "@/features/dashboard/dashboard-view-model"
import { Card } from "@/shared/ui/card"

export function StatCard({ stat }: { stat: DashboardStat }) {
  const Icon = stat.icon

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {stat.value.toLocaleString("en-US")}
          </p>
        </div>
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400"
        >
          <Icon className="size-5" />
        </span>
      </div>
    </Card>
  )
}
import { TrendingDown, TrendingUp } from "lucide-react"

import type { StatCardData } from "@/mocks/dashboard"
import { cn } from "@/lib/utils"
import { Card } from "@/shared/ui/card"

export function StatCard({ stat }: { stat: StatCardData }) {
  const Icon = stat.icon
  const isUp = stat.direction === "up"

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {stat.value}
          </p>
        </div>
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400"
        >
          <Icon className="size-5" />
        </span>
      </div>

      <p
        className={cn(
          "mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
          stat.tone === "positive"
            ? isUp
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
              : "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400"
            : "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"
        )}
      >
        {stat.tone === "positive" &&
          (isUp ? (
            <TrendingUp className="size-3.5" aria-hidden="true" />
          ) : (
            <TrendingDown className="size-3.5" aria-hidden="true" />
          ))}
        {stat.change}
      </p>
    </Card>
  )
}
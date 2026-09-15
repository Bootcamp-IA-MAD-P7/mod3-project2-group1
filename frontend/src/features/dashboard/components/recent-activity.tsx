import type { ActivityRisk, ActivityStatus, RecentActivityItem } from "@/mocks/dashboard"
import { RECENT_ACTIVITY } from "@/mocks/dashboard"
import { Card } from "@/shared/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import { cn } from "@/lib/utils"

const STATUS_STYLES: Record<
  ActivityStatus,
  { label: string; badge: string; dot: string }
> = {
  safe: {
    label: "Safe",
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  "potentially-toxic": {
    label: "Potentially toxic",
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  "high-risk": {
    label: "High risk",
    badge: "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
    dot: "bg-rose-500",
  },
}

const RISK_STYLES: Record<ActivityRisk, { label: string; text: string }> = {
  low: { label: "Low", text: "text-emerald-700 dark:text-emerald-400" },
  medium: { label: "Medium", text: "text-amber-700 dark:text-amber-400" },
  high: { label: "High", text: "text-rose-700 dark:text-rose-400" },
}

function StatusBadge({ status }: { status: ActivityStatus }) {
  const style = STATUS_STYLES[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        style.badge
      )}
    >
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", style.dot)} />
      {style.label}
    </span>
  )
}

function RiskBadge({ risk }: { risk: ActivityRisk }) {
  const style = RISK_STYLES[risk]
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium", style.text)}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {style.label}
    </span>
  )
}

const EXAMPLE_COMMENT: RecentActivityItem = RECENT_ACTIVITY[0]

export function RecentActivity() {
  return (
    <Card className="h-full p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Recent activity</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Latest comments reviewed by the moderation system
          </p>
        </div>
      </div>

      <div className="mt-4">
        <Table>
          <TableCaption>
            Example of moderation results displayed in the table. {EXAMPLE_COMMENT.comment}
          </TableCaption>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-full min-w-56">Comment</TableHead>
              <TableHead className="min-w-32">Status</TableHead>
              <TableHead className="min-w-20">Risk</TableHead>
              <TableHead className="min-w-28 text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {RECENT_ACTIVITY.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="whitespace-normal py-3.5">
                  <span className="block max-w-72 truncate text-sm text-slate-600 dark:text-slate-300">
                    {item.comment}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell>
                  <RiskBadge risk={item.risk} />
                </TableCell>
                <TableCell className="text-right whitespace-nowrap text-slate-500 dark:text-slate-400">
                  {item.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
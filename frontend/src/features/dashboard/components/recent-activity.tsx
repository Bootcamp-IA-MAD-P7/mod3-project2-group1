import type { ModerationLabel, RecentActivityItem } from "@/features/dashboard/dashboard-view-model"
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

interface RecentActivityProps {
  activity: RecentActivityItem[]
}

const STATUS_STYLES: Record<ModerationLabel, { label: string; badge: string; dot: string }> = {
  hate: {
    label: "Hate",
    badge: "bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-200",
    dot: "bg-violet-600",
  },
  non_hate: {
    label: "Non-hate",
    badge: "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-100",
    dot: "bg-slate-500",
  },
}

function StatusBadge({ label }: { label: ModerationLabel }) {
  const style = STATUS_STYLES[label]

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", style.badge)}>
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", style.dot)} />
      {style.label}
    </span>
  )
}

export function RecentActivity({ activity }: RecentActivityProps) {
  return (
    <Card className="h-full p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Recent activity</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            A selection of recently reviewed comments.
          </p>
        </div>
      </div>

      <div className="mt-4 sm:hidden">
        <ul className="space-y-3" aria-label="Recent moderation activity">
          {activity.map((item) => (
            <li key={item.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <article className="space-y-3">
                <p className="break-words text-sm text-slate-600 dark:text-slate-300">{item.comment}</p>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <StatusBadge label={item.label} />
                  <time className="text-sm text-slate-500 dark:text-slate-400">{item.date}</time>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 hidden sm:block">
        <Table>
          <TableCaption>Moderation results displayed in the dashboard.</TableCaption>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-56">Comment</TableHead>
              <TableHead className="min-w-32">Classification</TableHead>
              <TableHead className="min-w-28 text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activity.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="max-w-72 whitespace-normal py-3.5 text-sm text-slate-600 dark:text-slate-300">
                  {item.comment}
                </TableCell>
                <TableCell>
                  <StatusBadge label={item.label} />
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

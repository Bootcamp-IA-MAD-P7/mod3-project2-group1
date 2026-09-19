import { AlertTriangle, MessageSquareMore, ShieldAlert, ShieldCheck } from "lucide-react"

import type { ConversationJobView } from "@/features/analyze-conversation/analyze-conversation-view-model"
import { Card } from "@/shared/ui/card"

export function ConversationSummary({ job }: { job: ConversationJobView }) {
  const total = Math.max(job.analyzedCount, 1)
  const hateWidth = (job.counts.hate / total) * 100
  const nonHateWidth = (job.counts.nonHate / total) * 100

  return (
    <section aria-labelledby="conversation-summary-title" className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
      <Card className="border-violet-200 bg-gradient-to-br from-violet-50/80 via-white to-white p-5 dark:border-violet-400/20 dark:from-violet-500/10 dark:via-slate-950 dark:to-slate-950 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200">
            <MessageSquareMore className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-violet-700 dark:text-violet-300">Analysis summary</p>
            <h2 id="conversation-summary-title" className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">A readable view of the analyzed comments</h2>
          </div>
        </div>
        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          <SummaryMetric label="Comments obtained" value={job.fetchedCount} description="Main comments retrieved from the source." />
          <SummaryMetric label="Comments analyzed" value={job.analyzedCount} description="Comments with an individual classification." />
          <SummaryMetric label="Hate" value={job.counts.hate} description="A moderation signal for review." tone="hate" icon={<ShieldAlert className="size-4" />} />
          <SummaryMetric label="Non-hate" value={job.counts.nonHate} description="Comments not classified as Hate." tone="nonHate" icon={<ShieldCheck className="size-4" />} />
        </dl>
        {job.truncated && (
          <p className="mt-5 flex items-start gap-2 rounded-xl border border-orange-200 bg-orange-50/70 p-3 text-sm leading-6 text-orange-900 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-100">
            <AlertTriangle className="mt-1 size-4 shrink-0" aria-hidden="true" />
            This analysis reached its requested comment limit. It does not represent every comment that may exist on the video.
          </p>
        )}
      </Card>

      <Card className="border-violet-200/80 bg-gradient-to-b from-white to-violet-50/35 p-5 dark:border-violet-400/20 dark:from-slate-950 dark:to-violet-500/5 sm:p-6">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">Classification distribution</p>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Distribution of the comments that were analyzed.</p>
        <div className="mt-6" role="img" aria-label={`${job.counts.hate} Hate and ${job.counts.nonHate} Non-hate comments out of ${job.analyzedCount} analyzed comments`}>
          <div className="flex h-3.5 overflow-hidden rounded-full border border-white/60 bg-slate-100 shadow-inner dark:border-slate-800 dark:bg-slate-800">
            <span className="bg-orange-500" style={{ width: `${hateWidth}%` }} />
            <span className="bg-emerald-500" style={{ width: `${nonHateWidth}%` }} />
          </div>
          <div className="mt-5 grid gap-3">
            <DistributionLabel label="Hate" count={job.counts.hate} tone="hate" />
            <DistributionLabel label="Non-hate" count={job.counts.nonHate} tone="nonHate" />
          </div>
        </div>
      </Card>
    </section>
  )
}

function SummaryMetric({ label, value, description, tone = "default", icon }: { label: string; value: number; description: string; tone?: "default" | "hate" | "nonHate"; icon?: React.ReactNode }) {
  const toneClass = {
    default: "border-slate-200 bg-white/75 dark:border-slate-700 dark:bg-slate-900/60",
    hate: "border-orange-200 bg-orange-50/60 dark:border-orange-400/20 dark:bg-orange-500/10",
    nonHate: "border-emerald-200 bg-emerald-50/60 dark:border-emerald-400/20 dark:bg-emerald-500/10",
  }[tone]
  return <div className={"rounded-xl border p-4 " + toneClass}><dt className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">{icon}{label}</dt><dd className="mt-3 text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">{value}</dd><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{description}</p></div>
}

function DistributionLabel({ label, count, tone }: { label: string; count: number; tone: "hate" | "nonHate" }) {
  const swatch = tone === "hate" ? "bg-orange-500" : "bg-emerald-500"
  return <div className="flex items-center justify-between gap-3 text-sm"><span className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-200"><span className={"size-2.5 rounded-full " + swatch} aria-hidden="true" />{label}</span><span className="font-semibold tabular-nums text-slate-900 dark:text-white">{count} comments</span></div>
}

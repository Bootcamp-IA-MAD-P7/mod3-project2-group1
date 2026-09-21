import { Link, ShieldAlert, ShieldCheck, TrendingUp } from "lucide-react"

import type { ConversationJobView } from "@/features/analyze-conversation/analyze-conversation-view-model"
import { Badge } from "@/shared/ui/badge"

interface ModerationResultProps {
  url: string
  job: ConversationJobView
}

type RiskLevel = "Low" | "Medium" | "High"

function getRiskLevel(toxicity: number): RiskLevel {
  if (toxicity < 15) return "Low"
  if (toxicity <= 35) return "Medium"
  return "High"
}

const RISK_STYLE: Record<RiskLevel, string> = {
  Low: "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-200",
  Medium: "border-orange-300 bg-orange-50 text-orange-800 dark:border-orange-400/30 dark:bg-orange-500/10 dark:text-orange-200",
  High: "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-200",
}

export function ModerationResult({ url, job }: ModerationResultProps) {
  const analyzed = Math.max(job.analyzedCount, 0)
  const hate = Math.max(job.counts.hate, 0)
  const nonHate = Math.max(job.counts.nonHate, 0)
  const toxicity = analyzed > 0 ? Math.round((hate / analyzed) * 100) : 0
  const risk = getRiskLevel(toxicity)

  return (
    <section aria-labelledby="moderation-result-title" className="rounded-2xl border border-violet-200/80 bg-gradient-to-br from-white via-violet-50/50 to-white p-5 shadow-[0_16px_32px_rgba(109,40,147,0.1)] dark:border-violet-400/20 dark:from-slate-950 dark:via-violet-500/5 dark:to-slate-950 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200">
            <TrendingUp className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-violet-700 dark:text-violet-300">Moderation result</p>
            <h2 id="moderation-result-title" className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Conversation analysis summary</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Risk level</span>
          <Badge variant="outline" className={RISK_STYLE[risk]}>{risk}</Badge>
        </div>
      </div>

      <p className="mt-5 flex items-center gap-2 rounded-xl border border-violet-100 bg-white/70 px-3 py-2.5 text-sm text-slate-600 dark:border-violet-400/15 dark:bg-slate-950/40 dark:text-slate-300">
        <Link className="size-4 shrink-0 text-violet-600 dark:text-violet-300" aria-hidden="true" />
        <span className="truncate" title={url}>Analyzed URL: {url}</span>
      </p>

      <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <ResultMetric label="Comments analyzed" value={analyzed} description="Main comments reviewed individually." />
        <ResultMetric label="Potentially toxic" value={hate} description="Hate signals recommended for review." tone="hate" icon={<ShieldAlert className="size-4" />} />
        <ResultMetric label="Non-toxic" value={nonHate} description="Comments classified as Non-hate." tone="positive" icon={<ShieldCheck className="size-4" />} />
        <ResultMetric label="Toxicity rate" value={`${toxicity}%`} description="Share of comments with a Hate signal." />
      </dl>

      <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
        Demonstration result built with the existing local fixtures. No external service was contacted.
      </p>
    </section>
  )
}

function ResultMetric({
  label,
  value,
  description,
  tone = "default",
  icon,
}: {
  label: string
  value: number | string
  description: string
  tone?: "default" | "hate" | "positive"
  icon?: React.ReactNode
}) {
  const toneClass = {
    default: "border-slate-200 bg-white/75 dark:border-slate-700 dark:bg-slate-900/60",
    hate: "border-orange-200 bg-orange-50/60 dark:border-orange-400/20 dark:bg-orange-500/10",
    positive: "border-emerald-200 bg-emerald-50/60 dark:border-emerald-400/20 dark:bg-emerald-500/10",
  }[tone]
  return (
    <div className={"rounded-xl border p-4 " + toneClass}>
      <dt className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
        {icon}
        {label}
      </dt>
      <dd className="mt-3 text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">{value}</dd>
      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  )
}
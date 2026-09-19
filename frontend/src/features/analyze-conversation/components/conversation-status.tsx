import { AlertCircle, CheckCircle2, Clock3, Info, LoaderCircle, RefreshCw } from "lucide-react"

import type { ConversationScenario } from "@/features/analyze-conversation/analyze-conversation-view-model"
import { Badge } from "@/shared/ui/badge"

interface ConversationStatusProps {
  scenario: ConversationScenario
}

const STATUS_STYLE = {
  submitting: { icon: LoaderCircle, label: "Starting analysis", className: "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-400/25 dark:bg-violet-500/10 dark:text-violet-200" },
  queued: { icon: Clock3, label: "Queued", className: "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-400/25 dark:bg-violet-500/10 dark:text-violet-200" },
  processing: { icon: LoaderCircle, label: "Processing", className: "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-400/25 dark:bg-violet-500/10 dark:text-violet-200" },
  completed: { icon: CheckCircle2, label: "Completed", className: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-500/10 dark:text-emerald-200" },
  partial: { icon: AlertCircle, label: "Partial", className: "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-400/25 dark:bg-orange-500/10 dark:text-orange-200" },
  failed: { icon: AlertCircle, label: "Unable to complete", className: "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-400/25 dark:bg-orange-500/10 dark:text-orange-200" },
  expired: { icon: Clock3, label: "Expired", className: "border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200" },
} as const

export function ConversationStatus({ scenario }: ConversationStatusProps) {
  const style = STATUS_STYLE[scenario.id]
  const Icon = style.icon

  return (
    <section aria-labelledby="conversation-status-title" className={"rounded-2xl border p-5 sm:p-6 " + style.className}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid size-10 place-items-center rounded-xl bg-white/60 dark:bg-slate-950/25">
            <Icon className={"size-5 " + (scenario.id === "processing" || scenario.id === "submitting" ? "animate-spin" : "")} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide">Analysis status</p>
            <h2 id="conversation-status-title" className="mt-1 text-xl font-semibold tracking-tight">{style.label}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 opacity-85">{scenario.description}</p>
          </div>
        </div>
        <Badge variant="outline" className="border-current/25 bg-white/40 text-inherit dark:bg-slate-950/20">{style.label}</Badge>
      </div>

      {scenario.id === "expired" ? (
        <p className="mt-5 flex items-start gap-2 rounded-xl bg-white/45 p-3 text-sm leading-6 dark:bg-slate-950/20">
          <RefreshCw className="mt-1 size-4 shrink-0" aria-hidden="true" />
          This analysis is no longer available. Start a new analysis to obtain current results.
        </p>
      ) : scenario.job && (scenario.id === "queued" || scenario.id === "processing") ? (
        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <StatusDetail label="Comments obtained" value={String(scenario.job.fetchedCount)} />
          <StatusDetail label="Comments analyzed" value={String(scenario.job.analyzedCount)} />
        </div>
      ) : null}

      {scenario.job?.errorMessage && (
        <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl bg-white/45 p-3 text-sm leading-6 dark:bg-slate-950/20">
          <Info className="mt-1 size-4 shrink-0" aria-hidden="true" />
          {scenario.job.errorMessage}
        </p>
      )}
      {scenario.job && scenario.id !== "queued" && scenario.id !== "processing" && (
        <details className="mt-4 text-xs text-current/70">
          <summary className="w-fit cursor-pointer rounded-md font-medium underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/50">Technical analysis details</summary>
          <p className="mt-2">Video identifier: {scenario.job.videoId} · Results are available only for the temporary analysis resource.</p>
        </details>
      )}
    </section>
  )
}

function StatusDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/45 p-3 dark:bg-slate-950/20">
      <dt className="text-xs font-medium opacity-75">{label}</dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  )
}

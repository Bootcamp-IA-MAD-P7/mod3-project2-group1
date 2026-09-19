import { ChevronRight, MessageCircleMore, ShieldAlert, ShieldCheck } from "lucide-react"

import type { ConversationResultPage } from "@/features/analyze-conversation/analyze-conversation-view-model"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"

export function ConversationResults({ results }: { results: ConversationResultPage }) {
  return (
    <section aria-labelledby="conversation-results-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-violet-700 dark:text-violet-300">Individual results</p>
          <h2 id="conversation-results-title" className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Comments ready for review</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">Each label is a review signal for one main comment, not a judgment about a person.</p>
      </div>
      <ol className="mt-5 space-y-3" aria-label="Demonstration analysis results">
        {results.items.map((comment) => {
          const isHate = comment.prediction.label === "hate"
          const Icon = isHate ? ShieldAlert : ShieldCheck
          return (
            <li key={comment.commentId} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-950 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-200">
                  <MessageCircleMore className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Comment {comment.ordinal}</p>
                    <Badge variant="outline" className={isHate ? "border-orange-300 bg-orange-50 text-orange-800 dark:border-orange-400/30 dark:bg-orange-500/10 dark:text-orange-200" : "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-200"}>
                      <Icon className="size-3" aria-hidden="true" />
                      {isHate ? "Hate" : "Non-hate"}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">{comment.text}</p>
                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Review recommended · model version available to the future API integration</p>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
      {results.nextCursor && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-violet-100 bg-violet-50/50 p-3 text-sm text-slate-600 dark:border-violet-400/15 dark:bg-violet-500/5 dark:text-slate-300">
          <p>Additional pages will be available when the video analysis API is connected.</p>
          <Button type="button" variant="outline" size="sm" disabled aria-disabled="true">
            Next results page <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      )}
    </section>
  )
}

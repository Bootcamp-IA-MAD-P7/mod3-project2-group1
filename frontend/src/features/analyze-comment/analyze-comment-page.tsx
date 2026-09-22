import { MessageSquareText, ShieldCheck } from "lucide-react"
import { useState } from "react"

import { AnalysisFeedback } from "@/features/analyze-comment/components/analysis-feedback"
import { CommentForm } from "@/features/analyze-comment/components/comment-form"
import { ManualAnalysisHttpError, httpManualAnalysisDataSource } from "@/features/analyze-comment/http-manual-analysis-data-source"
import type { ManualAnalysisDataSource } from "@/features/analyze-comment/manual-analysis-data-source"
import { validateComment, type AnalyzeCommentState, type ManualPrediction } from "@/features/analyze-comment/analyze-comment-view-model"
import { Badge } from "@/shared/ui/badge"

export function AnalyzeCommentPage({ dataSource = httpManualAnalysisDataSource }: { dataSource?: ManualAnalysisDataSource }) {
  const [comment, setComment] = useState("")
  const [state, setState] = useState<AnalyzeCommentState>("initial")
  const [prediction, setPrediction] = useState<ManualPrediction | null>(null)

  const validationError = validateComment(comment)
  const formError = state === "invalid" ? validationError : null

  function handleCommentChange(value: string) {
    setComment(value)
    setPrediction(null)
    setState(value ? (validateComment(value) ? "invalid" : "ready") : "initial")
  }

  async function handleSubmit() {
    const invalidReason = validateComment(comment)
    if (invalidReason) {
      setPrediction(null)
      setState("invalid")
      return
    }

    setPrediction(null)
    setState("submitting")

    try {
      const result = await dataSource.createPrediction({ text: comment })
      setPrediction(result)
      setState("success")
    } catch (caught) {
      setPrediction(null)
      if (caught instanceof ManualAnalysisHttpError) {
        if (caught.apiError.status === 422) setState("validation_error")
        else if (caught.apiError.status === 503) setState("backend_unavailable")
        else setState("unexpected_error")
      } else {
        setState("unexpected_error")
      }
    }
  }

  return (
    <main className="space-y-7 lg:space-y-8" aria-labelledby="analyze-comment-title">
      <section className="relative isolate overflow-hidden rounded-2xl border border-violet-200/80 bg-gradient-to-br from-violet-50 via-white to-violet-100/55 px-5 py-7 shadow-[0_16px_32px_rgba(109,40,147,0.1)] dark:border-violet-400/20 dark:from-violet-950/50 dark:via-slate-950 dark:to-violet-900/20 sm:px-7 sm:py-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-16 size-52 rounded-full bg-violet-300/35 blur-3xl dark:bg-violet-400/10" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-8 size-20 rounded-full border-[12px] border-violet-200/45 dark:border-violet-300/10" />
        <div className="relative max-w-2xl"><Badge variant="outline" className="border-violet-300 bg-white/70 text-violet-800 dark:border-violet-400/30 dark:bg-violet-500/10 dark:text-violet-200"><MessageSquareText className="size-3" aria-hidden="true" /> CIVIKA</Badge><h1 id="analyze-comment-title" className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Analyze Comment</h1><p className="mt-3 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">Classify one comment as a moderation signal that supports a human review.</p><p className="mt-5 inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/60 px-3 py-1.5 text-xs font-medium text-violet-800 backdrop-blur-sm dark:border-violet-300/20 dark:bg-violet-950/25 dark:text-violet-100"><ShieldCheck className="size-3.5" aria-hidden="true" />One comment <span aria-hidden="true">→</span> Hate / Non-hate <span aria-hidden="true">→</span> human review</p></div>
      </section>

      <CommentForm value={comment} error={formError} isSubmitting={state === "submitting"} onChange={handleCommentChange} onSubmit={handleSubmit} />

      <AnalysisFeedback state={state} prediction={prediction} />
    </main>
  )
}

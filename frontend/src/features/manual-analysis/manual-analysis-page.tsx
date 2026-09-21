import { useReducer, useState } from "react"
import { MessagesSquare } from "lucide-react"

import { analyzeText } from "./api"
import { ManualAnalysisForm } from "./components/manual-analysis-form"
import { ManualAnalysisResult } from "./components/manual-analysis-result"
import {
  manualAnalysisReducer,
  validateManualText,
} from "./manual-analysis-view-model"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Card, CardContent } from "@/shared/ui/card"

export function ManualAnalysisPage() {
  const [text, setText] = useState("")
  const [state, dispatch] = useReducer(manualAnalysisReducer, { kind: "idle" })

  async function handleSubmit() {
    const validationError = validateManualText(text)
    if (validationError) {
      dispatch({ type: "set-invalid", message: validationError })
      return
    }
    dispatch({ type: "submit" })
    try {
      const analysis = await analyzeText(text)
      dispatch({ type: "succeed", analysis })
    } catch (error) {
      dispatch({ type: "fail", message: error instanceof Error ? error.message : "Analysis failed." })
    }
  }

  return (
    <main className="space-y-8 lg:space-y-10" aria-labelledby="manual-analysis-title">
      <section className="relative isolate overflow-hidden rounded-2xl border border-violet-200 bg-[radial-gradient(circle_at_84%_24%,rgba(196,181,253,0.7),transparent_24rem),linear-gradient(135deg,#f5f3ff_0%,#ede9fe_48%,#fff_100%)] p-6 shadow-[0_18px_38px_rgba(109,40,147,0.12)] dark:border-violet-400/25 dark:bg-[radial-gradient(circle_at_84%_24%,rgba(139,92,246,0.26),transparent_24rem),linear-gradient(135deg,rgba(76,29,149,0.72),#0f172a_56%,#0f172a_100%)] sm:p-8 lg:p-9">
        <div className="relative max-w-3xl">
          <Badge variant="outline" className="border-violet-300 bg-white/70 text-violet-800 dark:border-violet-400/30 dark:bg-violet-500/10 dark:text-violet-200">
            <MessagesSquare className="size-3" aria-hidden="true" /> CIVIKA
          </Badge>
          <h1 id="manual-analysis-title" className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Analyze a comment
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
            Paste one comment to get a review signal from the moderation model. The score is a
            calibrated probability of hate; no score means the signal has no probability estimate.
          </p>
        </div>
      </section>

      <Card>
        <CardContent className="pt-6">
          <ManualAnalysisForm
            text={text}
            state={state}
            onTextChange={setText}
            onSubmit={() => void handleSubmit()}
          />
        </CardContent>
      </Card>

      <div aria-live="polite" role="status" className="space-y-5">
        {state.kind === "loading" ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">Analyzing the comment…</p>
        ) : null}
        {state.kind === "error" ? (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-red-200 bg-red-50/60 px-4 py-3 dark:border-red-400/25 dark:bg-red-500/10">
            <p className="text-sm text-red-700 dark:text-red-300">{state.message}</p>
            <Button type="button" variant="outline" size="sm" onClick={() => dispatch({ type: "reset" })}>
              Dismiss
            </Button>
          </div>
        ) : null}
        {state.kind === "success" ? <ManualAnalysisResult analysis={state.analysis} /> : null}
      </div>
    </main>
  )
}
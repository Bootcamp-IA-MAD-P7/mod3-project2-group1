import { ShieldAlert, ShieldCheck } from "lucide-react"

import type { ManualAnalysisResult } from "../manual-analysis-contract"
import { Badge } from "@/shared/ui/badge"
import { Card, CardContent } from "@/shared/ui/card"

interface ManualAnalysisResultProps {
  analysis: ManualAnalysisResult
}

export function ManualAnalysisResult({ analysis }: ManualAnalysisResultProps) {
  const isHateSignal = analysis.label === "hate"
  const SignalIcon = isHateSignal ? ShieldAlert : ShieldCheck

  return (
    <Card>
      <CardContent className="space-y-3 pt-6">
        <div className="flex flex-wrap items-center gap-2">
          <SignalIcon
            className={isHateSignal ? "size-4 text-red-600 dark:text-red-300" : "size-4 text-emerald-600 dark:text-emerald-300"}
            aria-hidden="true"
          />
          <Badge variant={isHateSignal ? "destructive" : "soft"}>
            {isHateSignal ? "Hate signal" : "Non-hate signal"}
          </Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {analysis.modelVersion}
          </span>
        </div>

        {analysis.score !== null ? (
          <p className="text-sm text-slate-700 dark:text-slate-200">
            Score (calibrated probability of hate): {(analysis.score * 100).toFixed(0)}%
          </p>
        ) : (
          <p className="text-sm text-slate-700 dark:text-slate-200">
            No numeric score available for this signal.
          </p>
        )}

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Recommended for human review. This is a moderation signal, not an accusation.
        </p>
      </CardContent>
    </Card>
  )
}
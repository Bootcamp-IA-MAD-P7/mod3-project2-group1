import { AlertCircle, CircleAlert, Info, ShieldAlert, ShieldCheck, UserRoundCheck } from "lucide-react"
import { useLanguage } from "@/app/providers/language-provider"

import { type AnalyzeCommentState, type ManualPrediction } from "@/features/analyze-comment/analyze-comment-view-model"

interface AnalysisFeedbackProps {
  state: AnalyzeCommentState
  prediction: ManualPrediction | null
}

const ERROR_COPY: Partial<Record<AnalyzeCommentState, string>> = {
  validation_error: "comment.error.validation",
  backend_unavailable: "comment.error.backendUnavailable",
  unexpected_error: "comment.error.unexpected",
}

export function AnalysisFeedback({ state, prediction }: AnalysisFeedbackProps) {
  const { t } = useLanguage()
  if (state === "success" && prediction) return <PredictionResult prediction={prediction} />

  const message = ERROR_COPY[state]
  if (!message) return null

  return (
    <section aria-live="assertive" role="alert" className="rounded-2xl border border-orange-200 bg-orange-50/75 p-5 text-orange-950 dark:border-orange-400/25 dark:bg-orange-500/10 dark:text-orange-100">
      <div className="flex items-start gap-3"><AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" /><div><h2 className="font-semibold">{t("comment.error.title")}</h2><p className="mt-1 text-sm leading-6 opacity-90">{t(message)}</p></div></div>
    </section>
  )
}

function PredictionResult({ prediction }: { prediction: ManualPrediction }) {
  const { t } = useLanguage()
  const isHate = prediction.label === "hate"
  const LabelIcon = isHate ? ShieldAlert : ShieldCheck
  const tone = isHate
    ? "border-orange-200 bg-orange-50/75 text-orange-950 dark:border-orange-400/25 dark:bg-orange-500/10 dark:text-orange-100"
    : "border-emerald-200 bg-emerald-50/75 text-emerald-950 dark:border-emerald-400/25 dark:bg-emerald-500/10 dark:text-emerald-100"

  return (
    <section aria-live="polite" aria-labelledby="manual-result-title" className={`rounded-2xl border p-5 sm:p-6 ${tone}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3"><span className="grid size-10 place-items-center rounded-xl bg-white/65 dark:bg-slate-950/20"><LabelIcon className="size-5" aria-hidden="true" /></span><div><p className="text-sm font-semibold uppercase tracking-wide">{t("comment.signal")}</p><h2 id="manual-result-title" className="mt-1 text-2xl font-semibold tracking-tight">{prediction.label === "hate" ? t("common.hate") : t("common.nonHate")}</h2><p className="mt-2 text-sm leading-6 opacity-90">{t("comment.reviewDescription")}</p></div></div>
        <span className="rounded-full border border-current/20 bg-white/50 px-3 py-1 text-xs font-semibold dark:bg-slate-950/20">{prediction.label === "hate" ? t("common.hate") : t("common.nonHate")}</span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <ResultDetail icon={<UserRoundCheck className="size-4" />} title={t("comment.review")} detail={t("comment.reviewDescription")} />
        {prediction.scoreKind === "calibrated_probability" && prediction.score !== null
          ? <ResultDetail
              icon={<Info className="size-4" />}
              title={t("comment.hateProbability")}
              detail={<><span>{`${Math.round(prediction.score * 100)}%`}</span><span className="mt-1 block text-xs">{t("comment.calibrated")}</span></>}
            />
          : <ResultDetail icon={<Info className="size-4" />} title={t("comment.unavailable")} detail={t("comment.unavailableDetail")} />}
      </div>

      {prediction.modelVersion === "fake-dev-v1" && <p className="mt-5 flex items-start gap-2 rounded-xl border border-violet-200/70 bg-violet-50/70 p-3 text-sm leading-6 text-violet-950 dark:border-violet-300/20 dark:bg-violet-500/10 dark:text-violet-100"><CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><span><strong>{t("comment.preview")}.</strong> {t("comment.previewDetail")}</span></p>}

      {prediction.persistence === "disabled" && <p className="mt-4 flex items-center gap-2 text-sm leading-6 opacity-85"><Info className="size-4 shrink-0" aria-hidden="true" />{t("comment.persistence")}</p>}
    </section>
  )
}

function ResultDetail({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: React.ReactNode }) {
  return <div className="rounded-xl bg-white/55 p-3 dark:bg-slate-950/20"><p className="flex items-center gap-2 text-sm font-semibold">{icon}{title}</p><p className="mt-1 text-sm leading-6 opacity-90">{detail}</p></div>
}

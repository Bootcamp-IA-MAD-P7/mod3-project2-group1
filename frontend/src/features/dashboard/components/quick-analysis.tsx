import { ArrowUpRight, Sparkles } from "lucide-react"
import { useLanguage } from "@/app/providers/language-provider"

import type { DashboardAnalysisAction } from "@/features/dashboard/dashboard-view-model"
import { cn } from "@/lib/utils"
import { Card } from "@/shared/ui/card"

interface QuickAnalysisProps {
  actions: DashboardAnalysisAction[]
  onAction?: (action: DashboardAnalysisAction["id"]) => void
}

const ACTION_STYLES = {
  comment: {
    card: "border-violet-200/80 bg-violet-50/55 hover:border-violet-300 dark:border-violet-400/15 dark:bg-violet-500/5 dark:hover:border-violet-400/30",
    icon: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    accent: "text-violet-600 dark:text-violet-300",
    focus: "focus-visible:ring-violet-500 dark:focus-visible:ring-violet-300",
  },
  conversation: {
    card: "border-orange-200/75 bg-orange-50/50 hover:border-orange-300 dark:border-orange-400/15 dark:bg-orange-500/5 dark:hover:border-orange-400/30",
    icon: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
    accent: "text-orange-600 dark:text-orange-300",
    focus: "focus-visible:ring-orange-500 dark:focus-visible:ring-orange-300",
  },
  content: {
    card: "border-emerald-200/75 bg-emerald-50/50 hover:border-emerald-300 dark:border-emerald-400/15 dark:bg-emerald-500/5 dark:hover:border-emerald-400/30",
    icon: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    accent: "text-emerald-600 dark:text-emerald-300",
    focus: "focus-visible:ring-emerald-500 dark:focus-visible:ring-emerald-300",
  },
} as const

export function QuickAnalysis({ actions, onAction }: QuickAnalysisProps) {
  const { t } = useLanguage()
  return (
    <section aria-labelledby="analysis-actions-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 dark:text-violet-300">
            <Sparkles className="size-4" aria-hidden="true" />
            {t("dashboard.start")}
          </p>
          <h2 id="analysis-actions-title" className="mt-2 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {t("dashboard.choose")}
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
          {t("dashboard.chooseDescription")}
        </p>
      </div>

      <ul className="mt-5 grid gap-4 md:grid-cols-3" aria-label={t("dashboard.areas")}>
        {actions.map((action) => {
          const Icon = action.icon
          const styles = ACTION_STYLES[action.id]
          const isAvailable = action.id !== "content"
          return (
            <li key={action.id}>
              <Card className={cn("h-full overflow-hidden p-1 transition-all", isAvailable && "hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-black/20", styles.card)}>
                {isAvailable ? (
                  <button
                    type="button"
                    data-analysis-action={action.id}
                    onClick={() => onAction?.(action.id)}
                    className={cn("group flex h-full w-full flex-col rounded-[calc(var(--radius-xl)-0.25rem)] p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 sm:p-5", styles.focus)}
                  >
                    <span className={cn("grid size-11 place-items-center rounded-xl transition-transform group-hover:-translate-y-0.5", styles.icon)}>
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="mt-5 flex items-start justify-between gap-3">
                      <span className="text-base font-semibold text-slate-900 dark:text-white">{t(`dashboard.${action.id}Action`)}</span>
                      <ArrowUpRight className={cn("size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5", styles.accent)} aria-hidden="true" />
                    </span>
                    <span className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{t(`dashboard.${action.id}Description`)}</span>
                  </button>
                ) : (
                  <div aria-label={`${t(`dashboard.${action.id}Action`)}: ${t("common.comingSoon")}`} className="flex h-full flex-col rounded-[calc(var(--radius-xl)-0.25rem)] p-4 text-left opacity-75 sm:p-5">
                    <span className={cn("grid size-11 place-items-center rounded-xl", styles.icon)}>
                    <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="mt-5 flex items-start justify-between gap-3">
                      <span className="text-base font-semibold text-slate-900 dark:text-white">{t(`dashboard.${action.id}Action`)}</span>
                      <span className="rounded-full border border-emerald-300/70 bg-white/55 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-800 dark:border-emerald-400/25 dark:bg-slate-950/20 dark:text-emerald-200">{t("common.comingSoon")}</span>
                    </span>
                    <span className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{t(`dashboard.${action.id}Description`)}</span>
                  </div>
                )}
              </Card>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

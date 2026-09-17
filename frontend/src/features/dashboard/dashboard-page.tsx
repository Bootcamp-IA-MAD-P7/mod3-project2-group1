import { DASHBOARD_MOCK_DATA } from "@/mocks/dashboard"
import { StatCard } from "@/features/dashboard/components/stat-card"
import { ModerationOverview } from "@/features/dashboard/components/moderation-overview"
import { ContentStatus } from "@/features/dashboard/components/content-status"
import { RecentActivity } from "@/features/dashboard/components/recent-activity"
import { QuickAnalysis } from "@/features/dashboard/components/quick-analysis"

export function DashboardPage() {
  const { summary, stats, recentActivity } = DASHBOARD_MOCK_DATA

  return (
    <div className="space-y-6">
      <section aria-labelledby="greeting-title">
        <h1
          id="greeting-title"
          className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl"
        >
          Good morning, Moderator
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
          Review moderation activity and choose an analysis area to continue.
        </p>
        <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
          Use this overview to decide where to focus next.
        </p>
      </section>

      <section aria-label="Moderation statistics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 xl:gap-6">
        <div className="lg:col-span-2">
          <ModerationOverview totalAnalyzed={summary.totalAnalyzed} classifications={summary.classifications} />
        </div>
        <ContentStatus totalAnalyzed={summary.totalAnalyzed} classifications={summary.classifications} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 xl:gap-6">
        <div className="lg:col-span-2">
          <RecentActivity activity={recentActivity} />
        </div>
        <QuickAnalysis />
      </div>
    </div>
  )
}
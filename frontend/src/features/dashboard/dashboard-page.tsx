import { DASHBOARD_MOCK_DATA } from "@/mocks/dashboard"
import { CivikaHero } from "@/features/dashboard/components/civika-hero"
import { StatCard } from "@/features/dashboard/components/stat-card"
import { ModerationOverview } from "@/features/dashboard/components/moderation-overview"
import { RecentActivity } from "@/features/dashboard/components/recent-activity"
import { QuickAnalysis } from "@/features/dashboard/components/quick-analysis"

export function DashboardPage() {
  const { summary, stats, analysisActions, recentActivity } = DASHBOARD_MOCK_DATA

  return (
    <div className="space-y-8 lg:space-y-9">
      <CivikaHero />

      <QuickAnalysis actions={analysisActions} />

      <section aria-label="Moderation statistics" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(19rem,0.8fr)] xl:gap-6">
        <div>
          <ModerationOverview totalAnalyzed={summary.totalAnalyzed} classifications={summary.classifications} />
        </div>
        <RecentActivity activity={recentActivity} />
      </div>
    </div>
  )
}

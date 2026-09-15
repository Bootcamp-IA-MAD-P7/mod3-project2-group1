import { STAT_CARDS } from "@/mocks/dashboard"
import { StatCard } from "@/features/dashboard/components/stat-card"
import { ModerationOverview } from "@/features/dashboard/components/moderation-overview"
import { ContentStatus } from "@/features/dashboard/components/content-status"
import { RecentActivity } from "@/features/dashboard/components/recent-activity"
import { QuickAnalysis } from "@/features/dashboard/components/quick-analysis"

export function DashboardPage() {
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
          Monitor and analyze potentially harmful content.
        </p>
      </section>

      <section aria-label="Key statistics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_CARDS.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 xl:gap-6">
        <div className="lg:col-span-2">
          <ModerationOverview />
        </div>
        <ContentStatus />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 xl:gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <QuickAnalysis />
      </div>
    </div>
  )
}
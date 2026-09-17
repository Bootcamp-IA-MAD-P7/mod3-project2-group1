import type { LucideIcon } from "lucide-react"

export type ModerationLabel = "hate" | "non_hate"

export interface ClassificationCount {
  label: ModerationLabel
  count: number
}

export interface DashboardStat {
  id: "comments-analyzed" | "non-hate-comments" | "hate-comments"
  label: string
  value: number
  icon: LucideIcon
}

export interface RecentActivityItem {
  id: string
  comment: string
  label: ModerationLabel
  date: string
}

export interface DashboardViewModel {
  summary: {
    totalAnalyzed: number
    classifications: ClassificationCount[]
  }
  stats: DashboardStat[]
  recentActivity: RecentActivityItem[]
}
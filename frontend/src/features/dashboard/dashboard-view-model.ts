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
  tone: "violet" | "green" | "orange"
}

export interface DashboardAnalysisAction {
  id: "comment" | "conversation" | "content"
  title: string
  description: string
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
  analysisActions: DashboardAnalysisAction[]
  recentActivity: RecentActivityItem[]
}

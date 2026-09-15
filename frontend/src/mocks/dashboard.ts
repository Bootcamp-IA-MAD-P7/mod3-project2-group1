import type { LucideIcon } from "lucide-react"
import {
  AlertTriangle,
  Flame,
  MessageSquare,
  ShieldCheck,
} from "lucide-react"

export type TrendDirection = "up" | "down"

export interface StatCardData {
  id: string
  label: string
  value: string
  change: string
  direction: TrendDirection
  tone: "positive" | "info"
  icon: LucideIcon
}

export const STAT_CARDS: StatCardData[] = [
  {
    id: "comments-analyzed",
    label: "Comments analyzed",
    value: "1,284",
    change: "+12.5% this week",
    direction: "up",
    tone: "positive",
    icon: MessageSquare,
  },
  {
    id: "safe-comments",
    label: "Safe comments",
    value: "1,032",
    change: "80.4% of analyzed",
    direction: "up",
    tone: "info",
    icon: ShieldCheck,
  },
  {
    id: "potentially-toxic",
    label: "Potentially toxic",
    value: "184",
    change: "14.3% of analyzed",
    direction: "up",
    tone: "info",
    icon: AlertTriangle,
  },
  {
    id: "high-risk",
    label: "High risk",
    value: "68",
    change: "5.3% of analyzed",
    direction: "up",
    tone: "info",
    icon: Flame,
  },
]

export interface ChartDay {
  day: string
  safe: number
  toxic: number
  highRisk: number
}

export const OVERVIEW_CHART: ChartDay[] = [
  { day: "Mon", safe: 154, toxic: 44, highRisk: 22 },
  { day: "Tue", safe: 182, toxic: 52, highRisk: 26 },
  { day: "Wed", safe: 147, toxic: 42, highRisk: 21 },
  { day: "Thu", safe: 203, toxic: 58, highRisk: 29 },
  { day: "Fri", safe: 171, toxic: 49, highRisk: 25 },
  { day: "Sat", safe: 193, toxic: 55, highRisk: 28 },
  { day: "Sun", safe: 175, toxic: 50, highRisk: 25 },
]

export const OVERVIEW_TOTAL = "1,284"

export interface ContentStatusItem {
  id: string
  label: string
  count: string
  percentage: number
  bar: string
  dot: string
}

export const CONTENT_STATUS: ContentStatusItem[] = [
  {
    id: "safe",
    label: "Safe",
    count: "1,032",
    percentage: 80.4,
    bar: "bg-emerald-500",
    dot: "bg-emerald-500",
  },
  {
    id: "potentially-toxic",
    label: "Potentially toxic",
    count: "184",
    percentage: 14.3,
    bar: "bg-amber-500",
    dot: "bg-amber-500",
  },
  {
    id: "high-risk",
    label: "High risk",
    count: "68",
    percentage: 5.3,
    bar: "bg-rose-500",
    dot: "bg-rose-500",
  },
]

export const CONTENT_STATUS_TOTAL = "1,284 comments analyzed"

export type ActivityStatus = "safe" | "potentially-toxic" | "high-risk"
export type ActivityRisk = "low" | "medium" | "high"

export interface RecentActivityItem {
  id: string
  comment: string
  status: ActivityStatus
  risk: ActivityRisk
  date: string
}

export const RECENT_ACTIVITY: RecentActivityItem[] = [
  {
    id: "act-1",
    comment: "This video is really helpful, thanks for sharing!",
    status: "safe",
    risk: "low",
    date: "Sep 15, 2026",
  },
  {
    id: "act-2",
    comment: "You're a complete idiot for posting this garbage.",
    status: "high-risk",
    risk: "high",
    date: "Sep 15, 2026",
  },
  {
    id: "act-3",
    comment: "Great editing and very clear explanation.",
    status: "safe",
    risk: "low",
    date: "Sep 15, 2026",
  },
  {
    id: "act-4",
    comment: "I hope you get banned from this platform forever.",
    status: "high-risk",
    risk: "high",
    date: "Sep 14, 2026",
  },
  {
    id: "act-5",
    comment: "This is offensive content and should be removed.",
    status: "potentially-toxic",
    risk: "medium",
    date: "Sep 14, 2026",
  },
  {
    id: "act-6",
    comment: "Nice review, subscribed to the channel.",
    status: "safe",
    risk: "low",
    date: "Sep 14, 2026",
  },
]

export interface NotificationItem {
  id: string
  title: string
  time: string
}

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "12 comments flagged as potentially toxic",
    time: "2 min ago",
  },
  {
    id: "notif-2",
    title: "Video analysis completed successfully",
    time: "1 h ago",
  },
  {
    id: "notif-3",
    title: "New high-risk comment requires review",
    time: "3 h ago",
  },
]

export interface LanguageOption {
  code: string
  label: string
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
]
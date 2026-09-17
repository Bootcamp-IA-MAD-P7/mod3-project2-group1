import { AlertTriangle, MessageSquare, ShieldCheck } from "lucide-react"

import type { DashboardViewModel } from "@/features/dashboard/dashboard-view-model"

/** Example-only data for Dashboard/Home. It is not persisted or fetched from an API. */
export const DASHBOARD_MOCK_DATA: DashboardViewModel = {
  summary: {
    totalAnalyzed: 1284,
    classifications: [
      { label: "non_hate", count: 1032 },
      { label: "hate", count: 252 },
    ],
  },
  stats: [
    {
      id: "comments-analyzed",
      label: "Comments analyzed",
      value: 1284,
      icon: MessageSquare,
    },
    {
      id: "non-hate-comments",
      label: "Non-hate comments",
      value: 1032,
      icon: ShieldCheck,
    },
    {
      id: "hate-comments",
      label: "Hate comments",
      value: 252,
      icon: AlertTriangle,
    },
  ],
  recentActivity: [
    {
      id: "act-1",
      comment: "This video is really helpful, thanks for sharing!",
      label: "non_hate",
      date: "Sep 15, 2026",
    },
    {
      id: "act-2",
      comment: "You're a complete idiot for posting this garbage.",
      label: "hate",
      date: "Sep 15, 2026",
    },
    {
      id: "act-3",
      comment: "Great editing and very clear explanation.",
      label: "non_hate",
      date: "Sep 15, 2026",
    },
    {
      id: "act-4",
      comment: "I hope you get banned from this platform forever.",
      label: "hate",
      date: "Sep 14, 2026",
    },
    {
      id: "act-5",
      comment: "This is offensive content and should be removed.",
      label: "hate",
      date: "Sep 14, 2026",
    },
    {
      id: "act-6",
      comment: "Nice review, subscribed to the channel.",
      label: "non_hate",
      date: "Sep 14, 2026",
    },
  ],
}

export interface NotificationItem {
  id: string
  title: string
  time: string
}

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "12 comments classified as Hate",
    time: "2 min ago",
  },
  {
    id: "notif-2",
    title: "Video analysis completed successfully",
    time: "1 h ago",
  },
  {
    id: "notif-3",
    title: "A comment needs review",
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
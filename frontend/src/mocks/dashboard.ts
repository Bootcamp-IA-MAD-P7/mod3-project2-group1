import { AlertTriangle, FileText, MessageSquare, MessagesSquare, ShieldCheck } from "lucide-react"

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
      tone: "violet",
    },
    {
      id: "non-hate-comments",
      label: "Non-hate comments",
      value: 1032,
      icon: ShieldCheck,
      tone: "green",
    },
    {
      id: "hate-comments",
      label: "Hate comments",
      value: 252,
      icon: AlertTriangle,
      tone: "orange",
    },
  ],
  analysisActions: [
    {
      id: "comment",
      title: "Analyze comment",
      description: "Review one comment to identify toxicity.",
      icon: MessageSquare,
    },
    {
      id: "conversation",
      title: "Analyze conversation",
      description: "Study the toxicity level in a YouTube video conversation.",
      icon: MessagesSquare,
    },
    {
      id: "content",
      title: "Analyze content",
      description: "Review video text to add context to comment reactions.",
      icon: FileText,
    },
  ],
  recentActivity: [
    {
      id: "act-1",
      comment: "This video is really helpful, thanks for sharing!",
      label: "non_hate",
      date: "2026-09-15",
    },
    {
      id: "act-2",
      comment: "You're a complete idiot for posting this garbage.",
      label: "hate",
      date: "2026-09-15",
    },
    {
      id: "act-3",
      comment: "Great editing and very clear explanation.",
      label: "non_hate",
      date: "2026-09-15",
    },
    {
      id: "act-4",
      comment: "I hope you get banned from this platform forever.",
      label: "hate",
      date: "2026-09-14",
    },
    {
      id: "act-5",
      comment: "This is offensive content and should be removed.",
      label: "hate",
      date: "2026-09-14",
    },
    {
      id: "act-6",
      comment: "Nice review, subscribed to the channel.",
      label: "non_hate",
      date: "2026-09-14",
    },
  ],
}

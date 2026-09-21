import type { LucideIcon } from "lucide-react"
import {
  FileText,
  FlaskConical,
  History,
  LayoutDashboard,
  MessageSquareText,
  MessagesSquare,
  Settings,
} from "lucide-react"

export type AppSectionId =
  | "dashboard"
  | "analyze-comment"
  | "analyze-conversation"
  | "analyze-content"
  | "history"
  | "laboratory"
  | "settings"

export interface NavItem {
  id: AppSectionId
  label: string
  icon: LucideIcon
  badge?: string
}

export interface NavGroup {
  id: "analysis" | "results"
  label: string
  items: NavItem[]
}

export const APP_BRAND = "CIVIKA"

export const PRIMARY_NAV_ITEM: NavItem = {
  id: "dashboard",
  label: "Dashboard",
  icon: LayoutDashboard,
}

export const NAVIGATION_GROUPS: NavGroup[] = [
  {
    id: "analysis",
    label: "Analysis",
    items: [
      { id: "analyze-comment", label: "Analyze comment", icon: MessageSquareText },
      { id: "analyze-conversation", label: "Analyze conversation", icon: MessagesSquare },
      { id: "analyze-content", label: "Analyze content", icon: FileText },
    ],
  },
  {
    id: "results",
    label: "Results",
    items: [{ id: "history", label: "History", icon: History }],
  },
]

export const FINAL_NAV_ITEMS: NavItem[] = [
  { id: "laboratory", label: "Laboratory", icon: FlaskConical, badge: "DEV" },
  { id: "settings", label: "Settings", icon: Settings },
]

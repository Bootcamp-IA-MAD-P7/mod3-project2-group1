import type { LucideIcon } from "lucide-react"
import {
  Clapperboard,
  History,
  LayoutDashboard,
  MessageSquareText,
  Settings,
} from "lucide-react"

export type AppSectionId =
  | "dashboard"
  | "analyze-comment"
  | "analyze-video"
  | "history"
  | "settings"

export interface NavItem {
  id: AppSectionId
  label: string
  icon: LucideIcon
}

export const APP_BRAND = "Moder AI"

export const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "analyze-comment", label: "Analyze Comment", icon: MessageSquareText },
  { id: "analyze-video", label: "Analyze Video", icon: Clapperboard },
  { id: "history", label: "History", icon: History },
  { id: "settings", label: "Settings", icon: Settings },
]

export const ACTIVE_SECTION: AppSectionId = "dashboard"
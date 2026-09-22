import { Menu } from "lucide-react"

import { AppearanceMenu } from "@/shared/layout/appearance-menu"
import { LanguageSelector } from "@/shared/layout/language-selector"
import { NotificationMenu } from "@/shared/layout/notification-menu"
import { ThemeToggle } from "@/shared/layout/theme-toggle"
import { UserBadge } from "@/shared/layout/user-badge"
import { Separator } from "@/shared/ui/separator"
import type { AppSectionId } from "@/shared/navigation/nav-items"

const HEADER_COPY: Record<AppSectionId, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Overview of your content moderation activity",
  },
  "analyze-comment": {
    title: "Analyze Comment",
    subtitle: "Review one comment with a moderation signal",
  },
  "analyze-conversation": {
    title: "Analyze Conversation",
    subtitle: "Review a YouTube conversation for moderation signals",
  },
  "analyze-content": {
    title: "Analyze Content",
    subtitle: "Content analysis will be available soon",
  },
  history: {
    title: "History",
    subtitle: "Analysis history will be available soon",
  },
  laboratory: {
    title: "Laboratory",
    subtitle: "Technical DEV evidence",
  },
  settings: {
    title: "Settings",
    subtitle: "Customize your review workspace",
  },
}

interface HeaderProps {
  onMenuClick: () => void
  activeSection: AppSectionId
}

export function Header({ onMenuClick, activeSection }: HeaderProps) {
  const { title, subtitle } = HEADER_COPY[activeSection]

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80">
      <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="inline-flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 lg:hidden"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
            {title}
          </p>
          <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1.5 pr-4 sm:gap-2.5 sm:pr-6 lg:pr-8">
        <ThemeToggle />
        <AppearanceMenu />
        <LanguageSelector />
        <NotificationMenu />
        <Separator orientation="vertical" className="hidden h-6 dark:bg-slate-700 sm:block" aria-hidden="true" />
        <UserBadge />
      </div>
    </header>
  )
}

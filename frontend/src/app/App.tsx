import { useState } from "react"

import { AppLayout } from "@/app/layout/app-layout"
import { AnalyzeCommentPage } from "@/features/analyze-comment/analyze-comment-page"
import { AnalyzeConversationPage } from "@/features/analyze-conversation/analyze-conversation-page"
import { LoginPage } from "@/features/auth/login-page"
import { DashboardPage } from "@/features/dashboard/dashboard-page"
import { SettingsPage } from "@/features/settings/settings-page"
import type { AppSectionId } from "@/shared/navigation/nav-items"

type AppView = "login" | AppSectionId

const NAVIGABLE_VIEWS: AppSectionId[] = ["dashboard", "analyze-comment", "analyze-conversation", "settings"]

export function App() {
  const [view, setView] = useState<AppView>("login")

  function handleNavigate(section: AppSectionId) {
    if (NAVIGABLE_VIEWS.includes(section)) {
      setView(section)
    }
  }

  if (view === "login") {
    return <LoginPage onSuccess={() => setView("dashboard")} />
  }

  return (
    <AppLayout activeSection={view} onNavigate={handleNavigate}>
      {view === "dashboard" && <DashboardPage onNavigate={handleNavigate} />}
      {view === "analyze-comment" && <AnalyzeCommentPage />}
      {view === "analyze-conversation" && <AnalyzeConversationPage />}
      {view === "settings" && <SettingsPage />}
    </AppLayout>
  )
}

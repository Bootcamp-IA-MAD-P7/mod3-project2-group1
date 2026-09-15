import { AppLayout } from "@/app/layout/app-layout"
import { DashboardPage } from "@/features/dashboard/dashboard-page"

export function App() {
  return (
    <AppLayout>
      <DashboardPage />
    </AppLayout>
  )
}
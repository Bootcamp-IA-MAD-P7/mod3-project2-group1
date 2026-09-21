import { useState, type ReactNode } from "react"

import { useAppearance } from "@/app/providers/appearance-provider"
import { type AppSectionId } from "@/shared/navigation/nav-items"
import { Header } from "@/shared/layout/header"
import { Sidebar } from "@/shared/layout/sidebar"

interface AppLayoutProps {
  activeSection: AppSectionId
  onNavigate: (section: AppSectionId) => void
  children: ReactNode
}

export function AppLayout({ activeSection, onNavigate, children }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { brightness } = useAppearance()

  function handleNavigate(section: AppSectionId) {
    setMobileMenuOpen(false)
    onNavigate(section)
  }

  return (
    <div className="min-h-dvh bg-[var(--app-shell-bg)]">
      <a
        href="#main-content"
        className="sr-only z-[60] rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>

      <Sidebar open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} activeSection={activeSection} onNavigate={handleNavigate} />

      <div
        className="flex min-h-dvh flex-col lg:pl-72"
        style={{ filter: brightness < 100 ? `brightness(${brightness / 100})` : undefined }}
      >
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        <main id="main-content" className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
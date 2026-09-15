import { ShieldCheck, X } from "lucide-react"

import { ACTIVE_SECTION, NAV_ITEMS } from "@/shared/navigation/nav-items"
import { Avatar, AvatarFallback } from "@/shared/ui/avatar"
import { cn } from "@/lib/utils"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-200 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      <aside
        aria-label="Main navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-[#8E2BB8] bg-[#8E2BB8] transition-transform duration-200 ease-out lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <p className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-lg bg-white text-[#8E2BB8]">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-white">
              Moder <span className="text-violet-200">AI</span>
            </span>
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex size-8 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 lg:hidden"
          >
            <X className="size-4.5" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3 pt-5">
          <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-white/60">
            Menu
          </p>
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = item.id === ACTIVE_SECTION
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#8E2BB8]",
                      active
                        ? "bg-white/15 text-white"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "size-4.5 shrink-0",
                        active
                          ? "text-white"
                          : "text-white/60 transition-colors group-hover:text-white"
                      )}
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.label}</span>
                    {active && (
                      <span
                        aria-hidden="true"
                        className="ml-auto size-1.5 rounded-full bg-white"
                      />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <Avatar className="size-9 bg-gradient-to-br from-violet-500 to-purple-600">
              <AvatarFallback className="bg-transparent text-sm font-semibold text-white">
                M
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-medium text-white">Moderator</p>
              <p className="flex items-center gap-1.5 text-xs text-white/70">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-500" />
                Content moderator
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
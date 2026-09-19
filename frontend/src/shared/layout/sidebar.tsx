import { ShieldCheck, X } from "lucide-react"

import {
  ACTIVE_SECTION,
  APP_BRAND,
  FINAL_NAV_ITEMS,
  NAVIGATION_GROUPS,
  PRIMARY_NAV_ITEM,
  type NavItem,
} from "@/shared/navigation/nav-items"
import { Avatar, AvatarFallback } from "@/shared/ui/avatar"
import { cn } from "@/lib/utils"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

function NavigationItem({ item }: { item: NavItem }) {
  const active = item.id === ACTIVE_SECTION
  const Icon = item.icon

  return (
    <li>
      <button
        type="button"
        aria-current={active ? "page" : undefined}
        className={cn(
          "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#8E2BB8]",
          active
            ? "border border-violet-100/25 bg-gradient-to-r from-white/22 to-violet-100/10 text-white shadow-[0_8px_18px_rgba(43,9,79,0.22)]"
            : "border border-transparent text-white/80 hover:border-white/10 hover:bg-white/10 hover:text-white"
        )}
      >
        <Icon
          className={cn(
            "size-4.5 shrink-0",
            active ? "text-white" : "text-white/60 transition-colors group-hover:text-white"
          )}
          aria-hidden="true"
        />
        <span className="truncate">{item.label}</span>
        {item.badge && (
          <span className="ml-auto rounded-full border border-violet-100/25 bg-violet-200/20 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-violet-50 shadow-[0_2px_8px_rgba(35,6,67,0.22)]">
            {item.badge}
          </span>
        )}
        {active && <span aria-hidden="true" className="ml-auto size-1.5 rounded-full bg-white" />}
      </button>
    </li>
  )
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
          "fixed inset-y-0 left-0 z-50 isolate flex w-72 max-w-[85vw] flex-col overflow-hidden border-r border-violet-300/30 bg-gradient-to-b from-[#933CBA] via-[#7227A2] to-[#35105C] transition-transform duration-200 ease-out lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-20 z-0 size-72 rounded-full bg-violet-300/14 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute top-1/3 -left-28 z-0 size-64 rounded-full bg-indigo-950/20 blur-3xl" />
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 288 240"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-[5.5rem] z-0 hidden h-64 w-full [@media(min-height:42rem)]:block"
        >
          <path d="M0 112C53 66 102 152 156 114C207 78 246 54 288 74V240H0Z" fill="#3E1269" fillOpacity="0.56" />
          <path d="M0 144C58 96 110 190 169 148C216 114 254 116 288 132V240H0Z" fill="#59208C" fillOpacity="0.72" />
          <path d="M0 178C50 138 111 224 175 180C226 145 259 154 288 170V240H0Z" fill="#9F65D4" fillOpacity="0.3" />
        </svg>

        <div className="relative z-10 flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <p className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-lg bg-white/95 text-[#8E2BB8] shadow-sm shadow-violet-950/20">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-white">
              {APP_BRAND}
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

        <nav aria-label="Primary" className="relative z-10 flex-1 overflow-y-auto px-3 py-5">
          <ul className="space-y-1">
            <NavigationItem item={PRIMARY_NAV_ITEM} />
          </ul>

          {NAVIGATION_GROUPS.map((group) => (
            <section key={group.id} aria-labelledby={`${group.id}-navigation-title`} className="mt-6">
              <h2
                id={`${group.id}-navigation-title`}
                className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-white/60"
              >
                {group.label}
              </h2>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <NavigationItem key={item.id} item={item} />
                ))}
              </ul>
            </section>
          ))}

          <div aria-hidden="true" className="my-5 border-t border-white/10" />

          <ul className="space-y-1">
            {FINAL_NAV_ITEMS.map((item) => (
              <NavigationItem key={item.id} item={item} />
            ))}
          </ul>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-6 bottom-7 hidden text-[13px] italic leading-5 text-violet-100/55 [@media(min-height:48rem)]:block"
          >
            <p>
              Mejores conversaciones<br />
              para un internet<br />
              más humano.
            </p>
            <svg viewBox="0 0 72 12" className="mt-3 h-3 w-[72px]" fill="none">
              <path d="M2 8C16 2 33 2 48 6C57 8 64 8 70 3" stroke="rgba(237,233,254,0.5)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </nav>

        <div className="relative z-10 shrink-0 border-t border-white/10 bg-violet-950/35 p-4 backdrop-blur-md">
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

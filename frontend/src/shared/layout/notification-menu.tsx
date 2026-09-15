import { Bell } from "lucide-react"

import { NOTIFICATIONS } from "@/mocks/dashboard"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"

export function NotificationMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Notifications, 3 unread"
          className="relative inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
        >
          <Bell className="size-4.5" aria-hidden="true" />
          <span
            aria-hidden="true"
            className="absolute -top-1 -right-1 grid min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white"
          >
            3
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="px-3 text-base font-semibold text-slate-900 dark:text-white">
          Notifications
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ul className="max-h-72 overflow-y-auto">
          {NOTIFICATIONS.map((notification) => (
            <li
              key={notification.id}
              className="flex items-start gap-3 rounded-sm px-3 py-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-violet-500" />
              <span className="min-w-0">
                <span className="block text-sm font-medium leading-snug text-slate-800 dark:text-slate-100">
                  {notification.title}
                </span>
                <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                  {notification.time}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
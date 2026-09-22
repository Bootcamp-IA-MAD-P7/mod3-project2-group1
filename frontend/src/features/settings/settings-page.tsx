import { CheckCircle2, KeyRound, Moon, Palette, RotateCcw, SlidersHorizontal, Sun, Users } from "lucide-react"

import {
  useAppearance,
  type AppearanceTheme,
} from "@/app/providers/appearance-provider"
import { useLanguage } from "@/app/providers/language-provider"
import { ROLE_PERMISSIONS, SETTINGS_USERS, type SettingsUserStatus } from "@/mocks/settings"
import { AccessibilitySlider } from "@/shared/ui/accessibility-slider"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table"
import { cn } from "@/lib/utils"

const THEME_OPTIONS: { value: AppearanceTheme; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
]

const ROLE_BADGE_CLASS = {
  Administrator: "border-violet-300 bg-violet-50 text-violet-800 dark:border-violet-400/30 dark:bg-violet-500/10 dark:text-violet-200",
  Moderator: "border-slate-300 bg-slate-50 text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200",
}

const STATUS_TONE: Record<SettingsUserStatus, string> = {
  Active: "bg-emerald-500",
  Invited: "bg-sky-500",
  Pending: "bg-orange-500",
}

const CAPABILITY_KEYS: Record<string, string> = {
  Dashboard: "nav.dashboard",
  "Analyze Conversation": "nav.analyzeConversation",
  "Analyze Comment": "nav.analyzeComment",
  "Analyze Content": "nav.analyzeContent",
  History: "nav.history",
  Laboratory: "nav.laboratory",
  Settings: "nav.settings",
  "User Management": "settings.users",
}

export function SettingsPage() {
  const { t } = useLanguage()
  const { theme, brightness, intensity, setTheme, setBrightness, setIntensity, reset } =
    useAppearance()

  return (
    <main className="space-y-8 lg:space-y-10" aria-labelledby="settings-title">
      <header className="max-w-2xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:border-violet-400/25 dark:bg-violet-500/10 dark:text-violet-200">
          <SlidersHorizontal className="size-3" aria-hidden="true" />
          SETTINGS
        </p>
        <h1 id="settings-title" className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {t("settings.title")}
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
          {t("settings.heading")} {t("settings.local")}
        </p>
      </header>

      <Card className="border-violet-200/80 dark:border-violet-400/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5 text-slate-900 dark:text-white">
            <span className="grid size-9 place-items-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200">
              <Palette className="size-4.5" aria-hidden="true" />
            </span>
            {t("settings.appearance")}
          </CardTitle>
          <CardDescription>
            {t("settings.chooseAppearance")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="mb-2 text-sm font-medium text-slate-900 dark:text-slate-100">{t("appearance.colorTheme")}</p>
            <div
              role="radiogroup"
              aria-label={t("appearance.colorTheme")}
              className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800"
            >
              {THEME_OPTIONS.map(({ value, Icon }) => {
                const isActive = theme === value
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    aria-label={`${t(value === "light" ? "appearance.light" : "appearance.dark")} ${t("appearance.mode")}`}
                    onClick={() => setTheme(value)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                      isActive
                        ? "bg-white text-violet-700 shadow-sm dark:bg-slate-900 dark:text-violet-300"
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {t(value === "light" ? "appearance.light" : "appearance.dark")}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <AccessibilitySlider
              label={t("appearance.brightness")}
              min={20}
              max={100}
              value={brightness}
              onValueChange={setBrightness}
              formatValue={(raw) => `${raw}%`}
            />
            <AccessibilitySlider
              label={t("appearance.visualIntensity")}
              min={0}
              max={100}
              value={intensity}
              onValueChange={setIntensity}
              formatValue={(raw) => `${raw}%`}
            />
          </div>

          <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
            {t("settings.appearanceHelp")}
          </p>
        </CardContent>
      </Card>

      <Card className="border-violet-200/80 dark:border-violet-400/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5 text-slate-900 dark:text-white">
            <span className="grid size-9 place-items-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200">
              <RotateCcw className="size-4.5" aria-hidden="true" />
            </span>
            {t("settings.resetAppearance")}
          </CardTitle>
          <CardDescription>
            {t("settings.resetDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-xl border-violet-200 text-violet-800 hover:bg-violet-50 dark:border-violet-400/25 dark:text-violet-200 dark:hover:bg-violet-500/10"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            {t("appearance.reset")}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-violet-200/80 dark:border-violet-400/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5 text-slate-900 dark:text-white">
            <span className="grid size-9 place-items-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200">
              <Users className="size-4.5" aria-hidden="true" />
            </span>
            {t("settings.users")}
          </CardTitle>
          <CardDescription>
            {t("settings.usersDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("settings.name")}</TableHead>
                <TableHead>{t("settings.email")}</TableHead>
                <TableHead>{t("settings.role")}</TableHead>
                <TableHead>{t("settings.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SETTINGS_USERS.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-slate-900 dark:text-white">{user.name}</TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-300">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={ROLE_BADGE_CLASS[user.role]}>{t(user.role === "Administrator" ? "settings.administrator" : "settings.moderator")}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <span aria-hidden="true" className={`size-2 rounded-full ${STATUS_TONE[user.status]}`} />
                      {t(user.status === "Active" ? "settings.active" : user.status === "Invited" ? "settings.invited" : "settings.pending")}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-violet-200/80 dark:border-violet-400/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5 text-slate-900 dark:text-white">
            <span className="grid size-9 place-items-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200">
              <KeyRound className="size-4.5" aria-hidden="true" />
            </span>
            {t("settings.permissions")}
          </CardTitle>
          <CardDescription>
            {t("settings.permissionsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          {(["Administrator", "Moderator"] as const).map((role) => (
            <div key={role} className="rounded-xl border border-violet-100 bg-violet-50/40 p-5 dark:border-violet-400/15 dark:bg-violet-500/5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{t(role === "Administrator" ? "settings.administrator" : "settings.moderator")}</p>
                <Badge variant="outline" className={ROLE_BADGE_CLASS[role]}>{ROLE_PERMISSIONS[role].length} {t("settings.capabilities")}</Badge>
              </div>
              <ul className="mt-4 grid gap-2.5">
                {ROLE_PERMISSIONS[role].map((capability) => (
                  <li key={capability} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    {t(CAPABILITY_KEYS[capability])}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  )
}

import { Eye, EyeOff, Lock, Mail, MessagesSquare, ShieldCheck } from "lucide-react"
import { useState, type FormEvent } from "react"

import { APP_BRAND } from "@/shared/navigation/nav-items"
import { Button } from "@/shared/ui/button"

interface LoginPageProps {
  onSuccess?: () => void
}

export function LoginPage({ onSuccess }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSuccess?.()
  }

  return (
    <div className="flex min-h-dvh bg-slate-50 dark:bg-slate-950">
      <section
        aria-hidden="true"
        className="relative hidden w-1/2 overflow-hidden bg-gradient-to-b from-[#933CBA] via-[#7227A2] to-[#35105C] lg:block"
      >
        <div className="pointer-events-none absolute -right-24 -top-20 size-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full bg-violet-950/30 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <p className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-xl bg-white/95 shadow-md shadow-violet-950/20">
              <img src="/favicon.svg" alt="CIVIKA logo" width={32} height={32} className="size-8" />
            </span>
            <span className="text-2xl font-semibold tracking-tight text-white">{APP_BRAND}</span>
          </p>
          <div className="flex flex-1 items-center justify-center py-6">
            <img
              src="/civika-dashboard-hero.png"
              alt="CIVIKA moderation dashboard illustration"
              width={2079}
              height={756}
              className="w-full max-w-2xl rounded-3xl border border-white/20 bg-white/10 object-contain shadow-[0_24px_60px_rgba(35,6,67,0.45)] backdrop-blur-sm"
            />
          </div>
          <div>
            <h2 className="max-w-md text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              Mejores conversaciones para un internet más humano.
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-violet-100/85">
              CIVIKA apoya la moderación de comentarios de YouTube: clasifica contenido y presenta
              señales para revisión humana.
            </p>
            <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <MessagesSquare className="size-4" aria-hidden="true" />
              Comments analysis · review signals
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8" aria-labelledby="login-title">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid size-10 place-items-center rounded-lg bg-violet-700 text-white shadow-sm">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">{APP_BRAND}</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_38px_rgba(109,40,147,0.1)] dark:border-slate-700 dark:bg-slate-900 sm:p-8">
            <div>
              <h1 id="login-title" className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Welcome back
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Sign in to review comments and moderation signals.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="login-email" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-900 dark:text-slate-100">
                  <Mail className="size-4 text-violet-600 dark:text-violet-300" aria-hidden="true" />
                  Email or username
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="text"
                  autoComplete="username"
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus-visible:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:border-violet-300 dark:focus-visible:ring-violet-300/25"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <label htmlFor="login-password" className="flex items-center gap-1.5 text-sm font-medium text-slate-900 dark:text-slate-100">
                    <Lock className="size-4 text-violet-600 dark:text-violet-300" aria-hidden="true" />
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    aria-describedby="login-password-hint"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus-visible:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:border-violet-300 dark:focus-visible:ring-violet-300/25"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-slate-400 transition-colors hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="size-4.5" aria-hidden="true" /> : <Eye className="size-4.5" aria-hidden="true" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="h-11 w-full rounded-xl bg-violet-700 text-sm shadow-[0_8px_18px_rgba(109,40,147,0.2)] hover:bg-violet-800 dark:bg-violet-400 dark:text-violet-950 dark:hover:bg-violet-300">
                Sign in
              </Button>

              <p id="login-password-hint" className="rounded-xl border border-violet-100 bg-violet-50/50 px-3 py-2.5 text-center text-xs leading-5 text-slate-600 dark:border-violet-400/15 dark:bg-violet-500/5 dark:text-slate-300">
                Frontend demo only — no credentials are validated and nothing is sent.
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
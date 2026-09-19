import { Sparkles } from "lucide-react"

export function CivikaHero() {
  return (
    <section
      aria-labelledby="civika-hero-title"
      className="relative isolate overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-violet-100/70 px-6 py-7 dark:border-violet-500/20 dark:from-slate-900 dark:via-slate-900 dark:to-violet-950/45 sm:px-8 sm:py-8 lg:px-10 lg:py-9"
    >
      <div aria-hidden="true" className="absolute inset-0 hidden overflow-hidden lg:block">
        <img
          src="/civika-dashboard-hero.png"
          alt=""
          className="size-full object-cover object-[center_35%] opacity-95 dark:opacity-85"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,243,255,0.98)_0%,rgba(245,243,255,0.92)_28%,rgba(245,243,255,0.52)_50%,rgba(245,243,255,0.12)_70%,transparent_88%)] dark:bg-[linear-gradient(90deg,rgba(15,23,42,0.98)_0%,rgba(15,23,42,0.92)_28%,rgba(15,23,42,0.5)_50%,rgba(15,23,42,0.1)_70%,transparent_88%)]" />
      </div>

      <div className="relative max-w-xl lg:max-w-[54%]">
        <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold tracking-wide text-violet-700 shadow-sm dark:bg-violet-500/15 dark:text-violet-200">
          <Sparkles className="size-3.5" aria-hidden="true" />
          CIVIKA
        </p>
        <h1 id="civika-hero-title" className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Good morning, Moderator
        </h1>
        <p className="mt-3 max-w-xl text-lg leading-relaxed text-slate-700 dark:text-slate-200">
          Make space for healthier digital conversations.
        </p>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
          CIVIKA helps you understand the signals in a conversation and choose the next analysis with clarity.
        </p>
      </div>
    </section>
  )
}

import { BadgeCheck, ListChecks, MousePointerClick, ScanSearch } from "lucide-react"

const STEPS = [
  {
    icon: MousePointerClick,
    title: "Paste a YouTube URL",
    description: "Enter the link to a YouTube video in the analysis card.",
  },
  {
    icon: ScanSearch,
    title: "Obtain the main comments",
    description: "CIVIKA retrieves the top-level comments associated with the video.",
  },
  {
    icon: ListChecks,
    title: "Classify each comment",
    description: "Every comment is reviewed individually as Hate or Non-hate.",
  },
  {
    icon: BadgeCheck,
    title: "Review the signals",
    description: "A human moderator uses the signals to decide what to do.",
  },
]

export function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works-title" className="rounded-2xl border border-violet-200/70 bg-gradient-to-b from-white to-violet-50/40 p-6 shadow-[0_16px_32px_rgba(109,40,147,0.08)] dark:border-violet-400/20 dark:from-slate-950 dark:to-violet-500/5 sm:p-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300">Process</p>
        <h2 id="how-it-works-title" className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          How it works
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
          From a video URL to review-ready signals in four simple steps.
        </p>
      </div>

      <ol className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {STEPS.map(({ icon: Icon, title, description }, index) => (
          <li key={title} className="relative flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-violet-700 text-white shadow-[0_8px_18px_rgba(109,40,147,0.25)] dark:bg-violet-400 dark:text-violet-950">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span aria-hidden="true" className="text-sm font-semibold tabular-nums text-violet-400">
                Step {index + 1}
              </span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
import { CheckCircle2, Sparkles } from "lucide-react"

const WHY_ANALYZE_POINTS = [
  {
    title: "Signals, not verdicts",
    description: "Each classification is a moderation signal for one comment, never a judgment about a person.",
  },
  {
    title: "Faster triage",
    description: "Prioritize the comments that need attention without reviewing every single reply.",
  },
  {
    title: "Conversation context",
    description: "Understand the general tone of a video conversation before deciding what to do.",
  },
  {
    title: "Support for human review",
    description: "The final decision always stays with a human moderator.",
  },
]

export function WhyAnalyzeCommentsCard() {
  return (
    <section
      aria-labelledby="why-analyze-comments-title"
      className="overflow-hidden rounded-2xl border border-violet-200/80 bg-gradient-to-br from-white via-violet-50/50 to-white shadow-[0_16px_32px_rgba(109,40,147,0.1)] dark:border-violet-400/20 dark:from-slate-950 dark:via-violet-500/5 dark:to-slate-950"
    >
      <style>{`
        @keyframes civika-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .civika-float {
          animation: civika-float 6s ease-in-out infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .civika-float { animation: none; }
        }
      `}</style>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="p-6 sm:p-8">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Overview
          </p>
          <h2 id="why-analyze-comments-title" className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Why analyze comments?
          </h2>
          <p className="mt-3 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
            A single video can gather hundreds of comments. Understanding the main signals helps
            moderators act with context instead of reacting to the loudest message.
          </p>
          <ul className="mt-7 grid gap-5 sm:grid-cols-2">
            {WHY_ANALYZE_POINTS.map((point) => (
              <li key={point.title} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200">
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{point.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{point.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex min-h-64 items-center justify-center overflow-hidden bg-gradient-to-br from-violet-100/60 via-white to-violet-50/60 px-6 py-6 dark:from-violet-500/10 dark:via-slate-950 dark:to-violet-500/5">
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-violet-300/30 blur-3xl dark:bg-violet-500/15" />
          <img
            src="/image-robot.png"
            alt="CIVIKA assistant robot that represents the comment analysis"
            width={1536}
            height={1024}
            className="civika-float max-h-80 w-full max-w-md object-contain lg:max-h-[26rem]"
          />
        </div>
      </div>
    </section>
  )
}
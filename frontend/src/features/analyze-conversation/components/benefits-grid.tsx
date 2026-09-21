import { Focus, MessagesSquare, ShieldCheck, Timer } from "lucide-react"

const BENEFITS = [
  {
    icon: Timer,
    title: "Save review time",
    description: "Get the main signals from a whole conversation at a glance.",
  },
  {
    icon: Focus,
    title: "Focus on signals",
    description: "Each label is a review signal for one main comment.",
  },
  {
    icon: MessagesSquare,
    title: "Understand the tone",
    description: "See the balance between Hate and Non-hate in a video discussion.",
  },
  {
    icon: ShieldCheck,
    title: "Human review first",
    description: "Decisions are always made by a person, not by the tool.",
  },
]

export function BenefitsGrid() {
  return (
    <section aria-labelledby="benefits-title" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {BENEFITS.map(({ icon: Icon, title, description }) => (
        <article
          key={title}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_28px_rgba(109,40,147,0.08)] transition-shadow hover:shadow-[0_18px_36px_rgba(109,40,147,0.14)] dark:border-slate-700 dark:bg-slate-950"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <h3 id="benefits-title" className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
        </article>
      ))}
    </section>
  )
}
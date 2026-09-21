import { MessageCircle, MessageSquareMore, Sparkles } from "lucide-react"
import { useMemo, useState } from "react"

import { CONVERSATION_SCENARIOS, INITIAL_CONVERSATION_GUIDANCE, SUBMITTING_SCENARIO } from "@/features/analyze-conversation/analyze-conversation-fixtures"
import { BenefitsGrid } from "@/features/analyze-conversation/components/benefits-grid"
import { ConversationResults } from "@/features/analyze-conversation/components/conversation-results"
import { ConversationStatus } from "@/features/analyze-conversation/components/conversation-status"
import { ConversationSummary } from "@/features/analyze-conversation/components/conversation-summary"
import { ConversationUrlForm } from "@/features/analyze-conversation/components/conversation-url-form"
import { HowItWorks } from "@/features/analyze-conversation/components/how-it-works"
import { ModerationResult } from "@/features/analyze-conversation/components/moderation-result"
import { WhyAnalyzeCommentsCard } from "@/features/analyze-conversation/components/why-analyze-card"
import type { ConversationAnalysisStatus } from "@/features/analyze-conversation/analyze-conversation-view-model"
import { Badge } from "@/shared/ui/badge"

function validateYoutubeUrl(value: string): string | null {
  if (!value.trim()) return "Enter a YouTube video URL to continue."
  try {
    const parsed = new URL(value)
    const host = parsed.hostname.toLowerCase()
    const videoId = host === "youtu.be" ? parsed.pathname.slice(1) : parsed.searchParams.get("v") ?? parsed.pathname.split("/")[2]
    const validHost = ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"].includes(host)
    if (!validHost || !videoId || !/^[A-Za-z0-9_-]{11}$/.test(videoId)) return "Enter a supported YouTube video URL."
    return null
  } catch {
    return "Enter a supported YouTube video URL."
  }
}

export function AnalyzeConversationPage() {
  const [url, setUrl] = useState("")
  const [status, setStatus] = useState<ConversationAnalysisStatus>("initial")
  const [error, setError] = useState<string | null>(null)
  const [scenarioIndex, setScenarioIndex] = useState(1)
  const selectedScenario = CONVERSATION_SCENARIOS[scenarioIndex]

  const urlError = useMemo(() => (url ? validateYoutubeUrl(url) : null), [url])
  const isReady = status === "ready"

  function handleUrlChange(value: string) {
    setUrl(value)
    const nextError = value ? validateYoutubeUrl(value) : null
    setError(nextError)
    setStatus(nextError || !value ? "initial" : "ready")
  }

  function handleSubmit() {
    const nextError = validateYoutubeUrl(url)
    setError(nextError)
    if (nextError) {
      setStatus("initial")
      return
    }
    setStatus("submitting")
    setScenarioIndex(1)
    window.setTimeout(() => {
      setStatus("processing")
      setScenarioIndex(1)
      window.setTimeout(() => {
        setStatus("completed")
        setScenarioIndex(2)
      }, 1500)
    }, 350)
  }

  const activeScenario = status === "submitting" ? SUBMITTING_SCENARIO : status === "initial" || status === "ready" ? null : selectedScenario

  return (
    <main className="space-y-8 lg:space-y-10" aria-labelledby="analyze-conversation-title">
      <section className="relative isolate overflow-hidden rounded-2xl border border-violet-200 bg-[radial-gradient(circle_at_84%_24%,rgba(196,181,253,0.7),transparent_24rem),linear-gradient(135deg,#f5f3ff_0%,#ede9fe_48%,#fff_100%)] p-6 shadow-[0_18px_38px_rgba(109,40,147,0.12)] dark:border-violet-400/25 dark:bg-[radial-gradient(circle_at_84%_24%,rgba(139,92,246,0.26),transparent_24rem),linear-gradient(135deg,rgba(76,29,149,0.72),#0f172a_56%,#0f172a_100%)] sm:p-8 lg:p-9">
        <div aria-hidden="true" className="absolute -right-12 -top-20 size-72 rounded-full bg-violet-400/35 blur-3xl dark:bg-violet-500/20" />
        <div aria-hidden="true" className="absolute right-[12%] top-10 grid size-24 place-items-center rounded-[2rem] border border-white/60 bg-white/30 shadow-[0_16px_34px_rgba(109,40,147,0.12)] backdrop-blur-sm rotate-12 dark:border-violet-200/15 dark:bg-violet-300/5">
          <MessageCircle className="size-9 text-violet-500/75 dark:text-violet-200/60" />
        </div>
        <div aria-hidden="true" className="absolute bottom-5 right-[28%] size-16 rounded-full border-[10px] border-violet-300/45 dark:border-violet-300/15" />
        <div aria-hidden="true" className="absolute bottom-0 right-0 h-20 w-[52%] rounded-tl-[7rem] bg-violet-200/35 dark:bg-violet-400/5" />
        <div className="relative max-w-3xl">
          <Badge variant="outline" className="border-violet-300 bg-white/70 text-violet-800 dark:border-violet-400/30 dark:bg-violet-500/10 dark:text-violet-200"><MessageSquareMore className="size-3" aria-hidden="true" /> CIVIKA</Badge>
          <h1 id="analyze-conversation-title" className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Analyze Conversation</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">{INITIAL_CONVERSATION_GUIDANCE}</p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/60 px-3 py-1.5 text-xs font-medium text-violet-800 backdrop-blur-sm dark:border-violet-300/20 dark:bg-violet-950/25 dark:text-violet-100">
            <span className="size-1.5 rounded-full bg-violet-500" aria-hidden="true" />
            YouTube video <span aria-hidden="true">→</span> main comments <span aria-hidden="true">→</span> review signals
          </p>
        </div>
      </section>

      <ConversationUrlForm url={url} error={error ?? urlError} isReady={isReady} onUrlChange={handleUrlChange} onSubmit={handleSubmit} />

      {activeScenario ? <div className="space-y-7" aria-live="polite">
        <ConversationStatus scenario={activeScenario} />
        {activeScenario.job && activeScenario.results && <ModerationResult url={url} job={activeScenario.job} />}
        {activeScenario.job && activeScenario.id !== "queued" && activeScenario.id !== "processing" && activeScenario.id !== "failed" && <ConversationSummary job={activeScenario.job} />}
        {activeScenario.results && <ConversationResults results={activeScenario.results} />}
      </div> : <p className="flex items-center justify-center gap-2 rounded-xl border border-violet-100 bg-violet-50/45 px-4 py-3 text-center text-sm leading-6 text-slate-600 dark:border-violet-400/15 dark:bg-violet-500/5 dark:text-slate-300"><Sparkles className="size-4 shrink-0 text-violet-600 dark:text-violet-300" aria-hidden="true" />Enter a supported YouTube URL to prepare an analysis of its main comments.</p>}

      <BenefitsGrid />
      <WhyAnalyzeCommentsCard />
      <HowItWorks />
    </main>
  )
}

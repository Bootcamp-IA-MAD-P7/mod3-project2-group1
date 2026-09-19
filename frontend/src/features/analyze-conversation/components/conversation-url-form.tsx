import { Link, Play } from "lucide-react"
import type { FormEvent } from "react"

import { Button } from "@/shared/ui/button"

interface ConversationUrlFormProps {
  url: string
  error: string | null
  isReady: boolean
  onUrlChange: (value: string) => void
  onSubmit: () => void
}

export function ConversationUrlForm({ url, error, isReady, onUrlChange, onSubmit }: ConversationUrlFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="relative isolate overflow-hidden rounded-2xl border border-violet-200/80 bg-gradient-to-br from-white via-violet-50/65 to-white p-5 shadow-[0_16px_32px_rgba(109,40,147,0.1)] dark:border-violet-400/20 dark:from-slate-950 dark:via-violet-500/5 dark:to-slate-950 sm:p-6">
      <div aria-hidden="true" className="absolute -right-10 top-0 size-32 rounded-full bg-violet-200/45 blur-3xl dark:bg-violet-500/10" />
      <div className="relative">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300">Start an analysis</p>
        <label htmlFor="conversation-url" className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
          <span className="grid size-8 place-items-center rounded-lg bg-violet-100 text-violet-700 shadow-sm dark:bg-violet-500/15 dark:text-violet-200">
          <Link className="size-4" aria-hidden="true" />
          </span>
          YouTube video URL
        </label>
        <p id="conversation-url-help" className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          CIVIKA reviews the video&apos;s main comments individually. Replies and the video&apos;s own content are not included.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          id="conversation-url"
          value={url}
          onChange={(event) => onUrlChange(event.target.value)}
          aria-describedby="conversation-url-help conversation-url-error"
          aria-invalid={Boolean(error)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus-visible:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:border-violet-300 dark:focus-visible:ring-violet-300/25"
          />
          <Button type="submit" className="h-11 rounded-xl bg-violet-700 px-5 shadow-[0_8px_18px_rgba(109,40,147,0.2)] hover:bg-violet-800 focus-visible:ring-violet-500 dark:bg-violet-400 dark:text-violet-950 dark:hover:bg-violet-300">
          Analyze comments
          <Play className="size-4" aria-hidden="true" />
          </Button>
        </div>
        <p id="conversation-url-error" role="alert" className="mt-2 min-h-5 text-sm text-orange-700 dark:text-orange-300">
          {error}
        </p>
        {isReady && !error && <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">URL format looks ready. The server will validate it before creating an analysis.</p>}
      </div>
    </form>
  )
}

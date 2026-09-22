import { LoaderCircle, Sparkles } from "lucide-react"
import type { FormEvent } from "react"

import { MAX_COMMENT_CODE_POINTS, countCodePoints } from "@/features/analyze-comment/analyze-comment-view-model"
import { Button } from "@/shared/ui/button"

interface CommentFormProps {
  value: string
  error: string | null
  isSubmitting: boolean
  onChange: (value: string) => void
  onSubmit: () => void
}

export function CommentForm({ value, error, isSubmitting, onChange, onSubmit }: CommentFormProps) {
  const length = countCodePoints(value)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="relative isolate overflow-hidden rounded-2xl border border-violet-200/80 bg-gradient-to-br from-white via-violet-50/70 to-white p-4 shadow-[0_16px_32px_rgba(109,40,147,0.1)] dark:border-violet-400/20 dark:from-slate-950 dark:via-violet-500/5 dark:to-slate-950 sm:p-5">
      <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-12 size-40 rounded-full bg-violet-200/40 blur-3xl dark:bg-violet-500/10" />
      <div className="relative">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200">
            <Sparkles className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-violet-800 dark:text-violet-200">One comment at a time</p>
            <p id="comment-help" className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">Paste or write the comment exactly as you want it analyzed.</p>
          </div>
        </div>

        <label htmlFor="manual-comment" className="mt-5 block text-sm font-semibold text-slate-900 dark:text-white">Comment to analyze</label>
        <textarea
          id="manual-comment"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={isSubmitting}
          aria-invalid={Boolean(error)}
          aria-describedby="comment-help comment-counter comment-error"
          placeholder="Write or paste one comment..."
          rows={5}
          className="mt-2 block min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus-visible:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500/30 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:border-violet-300 dark:focus-visible:ring-violet-300/25"
        />
        <div className="mt-2 text-xs leading-5">
          <p id="comment-counter" className={length > MAX_COMMENT_CODE_POINTS ? "font-medium text-orange-700 dark:text-orange-300" : "text-slate-500 dark:text-slate-400"}>{length.toLocaleString()} / {MAX_COMMENT_CODE_POINTS.toLocaleString()} characters</p>
        </div>
        <p id="comment-error" role="alert" className="mt-1 min-h-4 text-sm font-medium text-orange-700 dark:text-orange-300">{error}</p>

        <Button type="submit" disabled={isSubmitting} className="mt-2 h-11 w-full rounded-xl bg-violet-700 px-5 shadow-[0_8px_18px_rgba(109,40,147,0.2)] hover:bg-violet-800 focus-visible:ring-violet-500 dark:bg-violet-400 dark:text-violet-950 dark:hover:bg-violet-300 sm:w-auto">
          {isSubmitting ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Sparkles className="size-4" aria-hidden="true" />}
          {isSubmitting ? "Analyzing comment" : "Analyze comment"}
        </Button>
      </div>
    </form>
  )
}

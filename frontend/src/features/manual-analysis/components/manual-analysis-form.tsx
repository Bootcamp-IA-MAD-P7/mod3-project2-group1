import { Button } from "@/shared/ui/button"
import { MAX_MANUAL_TEXT_LENGTH, type ManualAnalysisState } from "../manual-analysis-view-model"

interface ManualAnalysisFormProps {
  text: string
  state: ManualAnalysisState
  onTextChange: (value: string) => void
  onSubmit: () => void
}

const TEXTAREA_ID = "comment-text"
const ERROR_ID = "comment-text-error"

export function ManualAnalysisForm({
  text,
  state,
  onTextChange,
  onSubmit,
}: ManualAnalysisFormProps) {
  const isLoading = state.kind === "loading"
  const errorMessage = state.kind === "invalid" ? state.message : null

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
      className="space-y-4"
    >
      <div>
        <label
          htmlFor={TEXTAREA_ID}
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          Comment
        </label>
        <textarea
          id={TEXTAREA_ID}
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          rows={5}
          aria-invalid={errorMessage ? true : undefined}
          aria-describedby={errorMessage ? ERROR_ID : undefined}
          placeholder="Paste a comment to review…"
          className="w-full resize-y rounded-md border bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-violet-500 focus-visible:ring-[3px] focus-visible:ring-violet-400/40 dark:border-input dark:bg-input/30"
        />
        {errorMessage ? (
          <p id={ERROR_ID} role="alert" className="mt-1.5 text-sm text-red-700 dark:text-red-300">
            {errorMessage}
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Up to {MAX_MANUAL_TEXT_LENGTH} characters.
        </p>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Analyzing…" : "Analyze comment"}
        </Button>
      </div>
    </form>
  )
}
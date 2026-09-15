import { Clapperboard, MessageSquareText } from "lucide-react"

import { Button } from "@/shared/ui/button"
import { Card } from "@/shared/ui/card"

export function QuickAnalysis() {
  return (
    <Card className="relative h-full overflow-hidden p-5 sm:p-6">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 to-purple-600"
      />
      <span
        aria-hidden="true"
        className="grid size-10 place-items-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400"
      >
        <MessageSquareText className="size-5" />
      </span>

      <h2 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
        Start a new analysis
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        Analyze a comment or YouTube video to detect potentially harmful content.
      </p>

      <div className="mt-6 space-y-3">
        <Button type="button" size="lg" className="w-full">
          <MessageSquareText aria-hidden="true" />
          Analyze comment
        </Button>
        <Button type="button" size="lg" variant="outline" className="w-full">
          <Clapperboard aria-hidden="true" />
          Analyze video
        </Button>
      </div>
    </Card>
  )
}
import type { ManualAnalysisResult } from "./manual-analysis-contract"

export type ManualAnalysisState =
  | { kind: "idle" }
  | { kind: "invalid"; message: string }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "success"; analysis: ManualAnalysisResult }

export type ManualAnalysisAction =
  | { type: "set-invalid"; message: string }
  | { type: "submit" }
  | { type: "succeed"; analysis: ManualAnalysisResult }
  | { type: "fail"; message: string }
  | { type: "reset" }

export const MAX_MANUAL_TEXT_LENGTH = 5000

export function validateManualText(text: string): string | null {
  if (!text.trim()) return "Enter some text before analyzing a comment."
  if (Array.from(text).length > MAX_MANUAL_TEXT_LENGTH) {
    return `Text must be at most ${MAX_MANUAL_TEXT_LENGTH} characters.`
  }
  return null
}

export function manualAnalysisReducer(
  state: ManualAnalysisState,
  action: ManualAnalysisAction,
): ManualAnalysisState {
  switch (action.type) {
    case "set-invalid":
      return { kind: "invalid", message: action.message }
    case "submit":
      if (state.kind === "loading") return state
      return { kind: "loading" }
    case "succeed":
      return { kind: "success", analysis: action.analysis }
    case "fail":
      return { kind: "error", message: action.message }
    case "reset":
      return { kind: "idle" }
  }
}
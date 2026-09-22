export const MAX_COMMENT_CODE_POINTS = 5000

export type PredictionLabel = "hate" | "non_hate"
export type ScoreKind = "calibrated_probability" | "unavailable"
export type PersistenceKind = "disabled" | "stored" | "failed"

export interface ManualPredictionRequest {
  text: string
}

export interface ManualPrediction {
  predictionId: string
  label: PredictionLabel
  score: number | null
  scoreKind: ScoreKind
  modelVersion: string
  reviewRequired: true
  createdAt: string
  persistence: PersistenceKind
}

export interface ApiError {
  status: number | null
  code: string | null
}

export type AnalyzeCommentState =
  | "initial"
  | "invalid"
  | "ready"
  | "submitting"
  | "success"
  | "validation_error"
  | "backend_unavailable"
  | "unexpected_error"

export function countCodePoints(value: string) {
  return Array.from(value).length
}

export function validateComment(value: string): string | null {
  const length = countCodePoints(value)

  if (length === 0 || !value.trim()) {
    return "Enter a comment containing at least one non-space character."
  }

  if (length > MAX_COMMENT_CODE_POINTS) {
    return `Comments can contain up to ${MAX_COMMENT_CODE_POINTS.toLocaleString()} characters.`
  }

  return null
}

export function productLabel(label: PredictionLabel) {
  return label === "hate" ? "Hate" : "Non-hate"
}

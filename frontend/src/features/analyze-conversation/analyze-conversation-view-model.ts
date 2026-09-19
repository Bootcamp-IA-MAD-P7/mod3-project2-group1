export type ConversationAnalysisStatus =
  | "initial"
  | "ready"
  | "submitting"
  | "queued"
  | "processing"
  | "completed"
  | "partial"
  | "failed"
  | "expired"

export type ConversationLabel = "hate" | "non_hate"

export interface ConversationPrediction {
  label: ConversationLabel
  score: number | null
  scoreKind: "calibrated_probability" | "unavailable"
  modelVersion: string
  reviewRequired: true
}

export interface ConversationComment {
  commentId: string
  ordinal: number
  text: string
  prediction: ConversationPrediction
}

export interface ConversationCounts {
  hate: number
  nonHate: number
}

export interface ConversationJobView {
  status: Extract<ConversationAnalysisStatus, "queued" | "processing" | "completed" | "partial" | "failed">
  videoId: string
  fetchedCount: number
  analyzedCount: number
  counts: ConversationCounts
  truncated: boolean
  stopReason: "source_exhausted" | "limit_reached" | "quota_exceeded" | "upstream_error" | null
  errorMessage: string | null
  expiresAt: string
}

export interface ConversationResultPage {
  items: ConversationComment[]
  nextCursor: string | null
}

export interface ConversationScenario {
  id: Exclude<ConversationAnalysisStatus, "initial" | "ready">
  label: string
  description: string
  job: ConversationJobView | null
  results: ConversationResultPage | null
}

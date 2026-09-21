export type ManualAnalysisLabel = "hate" | "non_hate"
export type ManualAnalysisScoreKind = "calibrated_probability" | "unavailable"
export type ManualAnalysisPersistenceStatus = "disabled" | "stored" | "failed"

export interface ManualAnalysisResult {
  predictionId: string
  label: ManualAnalysisLabel
  score: number | null
  scoreKind: ManualAnalysisScoreKind
  modelVersion: string
  reviewRequired: true
  createdAt: string
  persistenceStatus: ManualAnalysisPersistenceStatus
}

export interface PredictionPayload {
  prediction_id: string
  label: ManualAnalysisLabel
  score: number | null
  score_kind: ManualAnalysisScoreKind
  model_version: string
  review_required: true
  created_at: string
  persistence: { status: ManualAnalysisPersistenceStatus }
  resource_token: string | null
}

export const DEFAULT_BASE_URL = "http://localhost:8000/api/v1"
export const PREDICTIONS_PATH = "/predictions"
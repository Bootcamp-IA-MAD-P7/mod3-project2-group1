import type { ManualAnalysisResult, PredictionPayload } from "./manual-analysis-contract"

export const SUCCESS_ANALYSIS_FIXTURE: ManualAnalysisResult = {
  predictionId: "11111111-1111-1111-1111-111111111111",
  label: "hate",
  score: 0.8123,
  scoreKind: "calibrated_probability",
  modelVersion: "0ddfbc97",
  reviewRequired: true,
  createdAt: "2026-09-21T09:00:00+00:00",
  persistenceStatus: "disabled",
}

export const NO_SCORE_ANALYSIS_FIXTURE: ManualAnalysisResult = {
  predictionId: "22222222-2222-2222-2222-222222222222",
  label: "non_hate",
  score: null,
  scoreKind: "unavailable",
  modelVersion: "0ddfbc97",
  reviewRequired: true,
  createdAt: "2026-09-21T09:01:00+00:00",
  persistenceStatus: "disabled",
}

export const ERROR_PAYLOAD_FIXTURE = {
  error: {
    code: "MODEL_UNAVAILABLE",
    message: "Predictor not available",
    request_id: "99999999-9999-9999-9999-999999999999",
    details: [],
  },
}

export const VALIDATION_ERROR_PAYLOAD_FIXTURE = {
  error: {
    code: "VALIDATION_ERROR",
    message: "Input validation failed",
    request_id: "88888888-8888-8888-8888-888888888888",
    details: [{ path: "text", reason: "Input should have at least 1 character" }],
  },
}

export function toPredictionPayload(result: ManualAnalysisResult): PredictionPayload {
  return {
    prediction_id: result.predictionId,
    label: result.label,
    score: result.score,
    score_kind: result.scoreKind,
    model_version: result.modelVersion,
    review_required: result.reviewRequired,
    created_at: result.createdAt,
    persistence: { status: result.persistenceStatus },
    resource_token: null,
  }
}
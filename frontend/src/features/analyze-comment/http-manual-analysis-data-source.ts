import type { ApiError, ManualPrediction, ManualPredictionRequest, PersistenceKind, PredictionLabel, ScoreKind } from "@/features/analyze-comment/analyze-comment-view-model"
import type { ManualAnalysisDataSource } from "@/features/analyze-comment/manual-analysis-data-source"

interface PredictionApiResponse {
  prediction_id: string
  label: PredictionLabel
  score: number | null
  score_kind: ScoreKind
  model_version: string
  review_required: true
  created_at: string
  persistence: { status: PersistenceKind }
  resource_token: string | null
}

interface ErrorEnvelope {
  error?: { code?: string }
}

export const DEFAULT_MANUAL_ANALYSIS_BASE_URL = "http://localhost:8000/api/v1"

export class ManualAnalysisHttpError extends Error {
  constructor(public readonly apiError: ApiError) {
    super("Manual analysis request failed")
  }
}

function isPredictionResponse(value: unknown): value is PredictionApiResponse {
  if (!value || typeof value !== "object") return false

  const response = value as Record<string, unknown>
  const persistence = response.persistence as Record<string, unknown>
  const hasValidScore = response.score === null || (typeof response.score === "number" && response.score >= 0 && response.score <= 1)
  const hasConsistentScore = response.score_kind === "calibrated_probability" ? response.score !== null : response.score === null

  return typeof response.prediction_id === "string"
    && (response.label === "hate" || response.label === "non_hate")
    && (response.score_kind === "calibrated_probability" || response.score_kind === "unavailable")
    && hasValidScore
    && hasConsistentScore
    && typeof response.model_version === "string"
    && response.review_required === true
    && typeof response.created_at === "string"
    && typeof response.persistence === "object"
    && response.persistence !== null
    && (persistence.status === "disabled" || persistence.status === "stored" || persistence.status === "failed")
    && (response.resource_token === null || typeof response.resource_token === "string")
}

function mapPrediction(response: PredictionApiResponse): ManualPrediction {
  return {
    predictionId: response.prediction_id,
    label: response.label,
    score: response.score,
    scoreKind: response.score_kind,
    modelVersion: response.model_version,
    reviewRequired: response.review_required,
    createdAt: response.created_at,
    persistence: response.persistence.status,
  }
}

async function readError(response: Response): Promise<ApiError> {
  try {
    const body = await response.json() as ErrorEnvelope
    return { status: response.status, code: body.error?.code ?? null }
  } catch {
    return { status: response.status, code: null }
  }
}

export function resolveManualAnalysisBaseUrl(configuredBaseUrl = import.meta.env.VITE_API_BASE_URL): string {
  return configuredBaseUrl?.trim()
    ? configuredBaseUrl.trim().replace(/\/$/, "")
    : DEFAULT_MANUAL_ANALYSIS_BASE_URL
}

/** HTTP adapter for the existing prediction endpoint. */
export function createHttpManualAnalysisDataSource(
  fetchImplementation: typeof fetch = fetch,
  baseUrl = resolveManualAnalysisBaseUrl()
): ManualAnalysisDataSource {
  return {
    async createPrediction(request: ManualPredictionRequest): Promise<ManualPrediction> {
      let response: Response

      try {
        response = await fetchImplementation(`${baseUrl}/predictions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: request.text }),
        })
      } catch {
        throw new ManualAnalysisHttpError({ status: null, code: null })
      }

      if (!response.ok) {
        throw new ManualAnalysisHttpError(await readError(response))
      }

      let payload: unknown
      try {
        payload = await response.json()
      } catch {
        throw new ManualAnalysisHttpError({ status: response.status, code: null })
      }
      if (!isPredictionResponse(payload)) {
        throw new ManualAnalysisHttpError({ status: response.status, code: null })
      }

      return mapPrediction(payload)
    },
  }
}

export const httpManualAnalysisDataSource = createHttpManualAnalysisDataSource()

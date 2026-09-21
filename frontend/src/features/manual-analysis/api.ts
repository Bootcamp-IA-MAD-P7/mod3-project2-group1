import type { ManualAnalysisResult, PredictionPayload } from "./manual-analysis-contract"

export class AnalysisApiError extends Error {
  readonly status: number | null

  constructor(message: string, status: number | null = null) {
    super(message)
    this.name = "AnalysisApiError"
    this.status = status
  }
}

function resolveBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL as string | undefined
  return configured && configured.trim() ? configured.replace(/\/$/, "") : "http://localhost:8000/api/v1"
}

function toManualAnalysisResult(payload: PredictionPayload): ManualAnalysisResult {
  return {
    predictionId: payload.prediction_id,
    label: payload.label,
    score: payload.score ?? null,
    scoreKind: payload.score_kind,
    modelVersion: payload.model_version,
    reviewRequired: payload.review_required,
    createdAt: payload.created_at,
    persistenceStatus: payload.persistence?.status ?? "disabled",
  }
}

export async function analyzeText(text: string): Promise<ManualAnalysisResult> {
  const response = await fetch(`${resolveBaseUrl()}/predictions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  })

  if (!response.ok) {
    let message = `Prediction failed (${response.status})`
    try {
      const envelope = (await response.json()) as { error?: { message?: string } }
      if (envelope?.error?.message) message = envelope.error.message
    } catch {
      message = `Prediction failed (${response.status})`
    }
    throw new AnalysisApiError(message, response.status)
  }

  const payload = (await response.json()) as PredictionPayload
  return toManualAnalysisResult(payload)
}
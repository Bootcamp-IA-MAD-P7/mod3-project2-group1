import { HttpResponse, delay, http } from "msw"

import { DEFAULT_BASE_URL, PREDICTIONS_PATH } from "@/features/manual-analysis/manual-analysis-contract"
import {
  ERROR_PAYLOAD_FIXTURE,
  NO_SCORE_ANALYSIS_FIXTURE,
  SUCCESS_ANALYSIS_FIXTURE,
  VALIDATION_ERROR_PAYLOAD_FIXTURE,
  toPredictionPayload,
} from "@/features/manual-analysis/manual-analysis-fixtures"

const predictionsEndpoint = `${DEFAULT_BASE_URL}${PREDICTIONS_PATH}`

export const successfulPredictionHandler = http.post(predictionsEndpoint, () =>
  HttpResponse.json(toPredictionPayload(SUCCESS_ANALYSIS_FIXTURE)),
)

export const noScorePredictionHandler = http.post(predictionsEndpoint, () =>
  HttpResponse.json(toPredictionPayload(NO_SCORE_ANALYSIS_FIXTURE)),
)

export const failingPredictionHandler = http.post(predictionsEndpoint, () =>
  HttpResponse.json(ERROR_PAYLOAD_FIXTURE, { status: 503 }),
)

export const validationFailurePredictionHandler = http.post(predictionsEndpoint, () =>
  HttpResponse.json(VALIDATION_ERROR_PAYLOAD_FIXTURE, { status: 422 }),
)

export const slowPredictionHandler = http.post(predictionsEndpoint, async () => {
  await delay(120)
  return HttpResponse.json(toPredictionPayload(SUCCESS_ANALYSIS_FIXTURE))
})
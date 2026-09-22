import { HttpResponse, http } from "msw"
import { afterEach, describe, expect, it, vi } from "vitest"

import { server } from "@/mocks/server"
import {
  DEFAULT_MANUAL_ANALYSIS_BASE_URL,
  ManualAnalysisHttpError,
  createHttpManualAnalysisDataSource,
  resolveManualAnalysisBaseUrl,
} from "../http-manual-analysis-data-source"

const endpoint = `${DEFAULT_MANUAL_ANALYSIS_BASE_URL}/predictions`

function predictionPayload(overrides: Record<string, unknown> = {}) {
  return {
    prediction_id: "11111111-1111-1111-1111-111111111111",
    label: "hate",
    score: 0.8123,
    score_kind: "calibrated_probability",
    model_version: "bundle-v1",
    review_required: true,
    created_at: "2026-09-21T09:00:00Z",
    persistence: { status: "disabled" },
    resource_token: "secret-token",
    ...overrides,
  }
}

afterEach(() => vi.unstubAllEnvs())

describe("HTTP ManualAnalysisDataSource", () => {
  it("uses the default backend URL and sends the literal text payload", async () => {
    let receivedText: unknown
    server.use(http.post(endpoint, async ({ request }) => {
      receivedText = (await request.json() as { text: unknown }).text
      return HttpResponse.json(predictionPayload())
    }))

    const comment = "  Héllo 👋\nhttps://example.com/path  "
    const result = await createHttpManualAnalysisDataSource().createPrediction({ text: comment })

    expect(receivedText).toBe(comment)
    expect(result).toMatchObject({ label: "hate", score: 0.8123, scoreKind: "calibrated_probability" })
    expect(Object.prototype.hasOwnProperty.call(result, "resourceToken")).toBe(false)
  })

  it("resolves configured URLs and removes only a final slash", () => {
    vi.stubEnv("VITE_API_BASE_URL", "https://api.civika.test/v1/")

    expect(resolveManualAnalysisBaseUrl()).toBe("https://api.civika.test/v1")
    expect(resolveManualAnalysisBaseUrl("https://other.test/api/")).toBe("https://other.test/api")
    expect(resolveManualAnalysisBaseUrl(" ")).toBe(DEFAULT_MANUAL_ANALYSIS_BASE_URL)
  })

  it("uses a supplied configured base URL", async () => {
    const configuredEndpoint = "https://api.civika.test/v1/predictions"
    server.use(http.post(configuredEndpoint, () => HttpResponse.json(predictionPayload({ label: "non_hate" }))))

    const result = await createHttpManualAnalysisDataSource(fetch, "https://api.civika.test/v1").createPrediction({ text: "hello" })

    expect(result.label).toBe("non_hate")
  })

  it("rejects an invalid success payload", async () => {
    server.use(http.post(endpoint, () => HttpResponse.json({ label: "hate" })))

    await expect(createHttpManualAnalysisDataSource().createPrediction({ text: "hello" })).rejects.toBeInstanceOf(ManualAnalysisHttpError)
  })

  it.each([422, 503, 500])("maps HTTP %i to a typed error", async (status) => {
    server.use(http.post(endpoint, () => HttpResponse.json({ error: { code: "REQUEST_ERROR" } }, { status })))

    await expect(createHttpManualAnalysisDataSource().createPrediction({ text: "hello" })).rejects.toMatchObject({ apiError: { status, code: "REQUEST_ERROR" } })
  })

  it("maps network failures to a typed error", async () => {
    const failingFetch = vi.fn().mockRejectedValue(new TypeError("network")) as unknown as typeof fetch

    await expect(createHttpManualAnalysisDataSource(failingFetch).createPrediction({ text: "hello" })).rejects.toMatchObject({ apiError: { status: null, code: null } })
  })
})

import { describe, expect, it } from "vitest"

import { server } from "@/mocks/server"
import { failingPredictionHandler, noScorePredictionHandler, successfulPredictionHandler } from "@/mocks/manual-analysis-handlers"
import { analyzeText } from "../api"

describe("analyzeText", () => {
  it("maps a successful payload to the contract result", async () => {
    server.use(successfulPredictionHandler)
    const result = await analyzeText("you are a complete fool")

    expect(result.label).toBe("hate")
    expect(result.score).toBeCloseTo(0.8123)
    expect(result.scoreKind).toBe("calibrated_probability")
    expect(result.modelVersion).toBe("0ddfbc97")
    expect(result.reviewRequired).toBe(true)
    expect(result.persistenceStatus).toBe("disabled")
  })

  it("keeps score null when score_kind is unavailable", async () => {
    server.use(noScorePredictionHandler)
    const result = await analyzeText("this is a nice comment")

    expect(result.score).toBeNull()
    expect(result.scoreKind).toBe("unavailable")
    expect(result.label).toBe("non_hate")
  })

  it("throws AnalysisApiError with the server message on 503", async () => {
    server.use(failingPredictionHandler)

    await expect(analyzeText("hate you")).rejects.toMatchObject({
      status: 503,
      message: "Predictor not available",
    })
  })
})
import { describe, expect, it } from "vitest"

import { SUCCESS_ANALYSIS_FIXTURE } from "../manual-analysis-fixtures"
import {
  MAX_MANUAL_TEXT_LENGTH,
  manualAnalysisReducer,
  validateManualText,
  type ManualAnalysisState,
} from "../manual-analysis-view-model"

describe("validateManualText", () => {
  it("rejects whitespace-only text", () => {
    expect(validateManualText("   \t\n ")).toBeTruthy()
  })

  it("accepts trimmed content", () => {
    expect(validateManualText("  hola  ")).toBeNull()
  })

  it("rejects text over the limit", () => {
    expect(validateManualText("a".repeat(MAX_MANUAL_TEXT_LENGTH + 1))).toBeTruthy()
  })

  it("accepts the boundary length", () => {
    expect(validateManualText("a".repeat(MAX_MANUAL_TEXT_LENGTH))).toBeNull()
  })
})

describe("manualAnalysisReducer", () => {
  it("transitions idle to loading", () => {
    expect(manualAnalysisReducer({ kind: "idle" }, { type: "submit" })).toEqual({ kind: "loading" })
  })

  it("blocks double submit while loading", () => {
    const loading: ManualAnalysisState = { kind: "loading" }
    expect(manualAnalysisReducer(loading, { type: "submit" })).toBe(loading)
  })

  it("transitions loading to success", () => {
    const state = manualAnalysisReducer({ kind: "loading" }, { type: "succeed", analysis: SUCCESS_ANALYSIS_FIXTURE })
    expect(state.kind).toBe("success")
  })

  it("transitions loading to error", () => {
    expect(manualAnalysisReducer({ kind: "loading" }, { type: "fail", message: "boom" })).toEqual({
      kind: "error",
      message: "boom",
    })
  })

  it("sets invalid with a message", () => {
    expect(manualAnalysisReducer({ kind: "idle" }, { type: "set-invalid", message: "nope" })).toEqual({
      kind: "invalid",
      message: "nope",
    })
  })

  it("resets to idle", () => {
    expect(manualAnalysisReducer({ kind: "success", analysis: SUCCESS_ANALYSIS_FIXTURE }, { type: "reset" })).toEqual({
      kind: "idle",
    })
  })
})
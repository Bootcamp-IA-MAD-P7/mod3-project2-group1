import { describe, expect, it } from "vitest"

import { MAX_COMMENT_CODE_POINTS, countCodePoints, validateComment } from "../analyze-comment-view-model"

describe("Analyze Comment validation", () => {
  it("rejects whitespace-only input", () => {
    expect(validateComment(" \t\n ")).toBeTruthy()
  })

  it("accepts exactly 5000 code points and rejects more", () => {
    expect(validateComment("a".repeat(MAX_COMMENT_CODE_POINTS))).toBeNull()
    expect(validateComment("a".repeat(MAX_COMMENT_CODE_POINTS + 1))).toBeTruthy()
  })

  it("counts Unicode code points and preserves valid Unicode input", () => {
    const comment = "¡Qué vídeo tan útil! 👋\nhttps://example.com/こんにちは"

    expect(countCodePoints(comment)).toBe(Array.from(comment).length)
    expect(validateComment(comment)).toBeNull()
  })
})

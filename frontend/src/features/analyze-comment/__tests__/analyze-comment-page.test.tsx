import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { AnalyzeCommentPage } from "../analyze-comment-page"
import type { ManualAnalysisDataSource } from "../manual-analysis-data-source"
import type { ManualPrediction } from "../analyze-comment-view-model"

function prediction(overrides: Partial<ManualPrediction> = {}): ManualPrediction {
  return {
    predictionId: "11111111-1111-1111-1111-111111111111",
    label: "hate",
    score: 0.8,
    scoreKind: "calibrated_probability",
    modelVersion: "bundle-v1",
    reviewRequired: true,
    createdAt: "2026-09-21T09:00:00Z",
    persistence: "disabled",
    ...overrides,
  }
}

function dataSourceFor(result: ManualPrediction): ManualAnalysisDataSource {
  return { createPrediction: vi.fn().mockResolvedValue(result) }
}

describe("AnalyzeCommentPage", () => {
  it("shows an accessible error for whitespace-only input", async () => {
    const user = userEvent.setup()
    render(<AnalyzeCommentPage dataSource={dataSourceFor(prediction())} />)

    await user.type(screen.getByLabelText("Comment to analyze"), "   ")
    await user.click(screen.getByRole("button", { name: "Analyze comment" }))

    const textarea = screen.getByLabelText("Comment to analyze")
    expect(screen.getByRole("alert").textContent).toContain("Enter a comment")
    expect(textarea.getAttribute("aria-invalid")).toBe("true")
    expect(textarea.getAttribute("aria-describedby")).toContain("comment-error")
  })

  it("renders Hate and identifies its score as Hate probability", async () => {
    const user = userEvent.setup()
    render(<AnalyzeCommentPage dataSource={dataSourceFor(prediction())} />)

    await user.type(screen.getByLabelText("Comment to analyze"), "a comment")
    await user.click(screen.getByRole("button", { name: "Analyze comment" }))

    expect(await screen.findByRole("heading", { name: "Hate" })).toBeTruthy()
    expect(screen.getByText("Hate probability")).toBeTruthy()
    expect(screen.getByText("80%")).toBeTruthy()
    expect(screen.getByText("Calibrated probability")).toBeTruthy()
    expect(screen.queryByText("Non-hate probability")).toBeNull()
    expect(screen.getByText("Human review required")).toBeTruthy()
    expect(screen.getByText("This analysis is not saved.")).toBeTruthy()
  })

  it("renders Non-hate and does not invent a percentage for unavailable score", async () => {
    const user = userEvent.setup()
    render(<AnalyzeCommentPage dataSource={dataSourceFor(prediction({ label: "non_hate", score: null, scoreKind: "unavailable" }))} />)

    await user.type(screen.getByLabelText("Comment to analyze"), "a kind comment")
    await user.click(screen.getByRole("button", { name: "Analyze comment" }))

    expect(await screen.findByRole("heading", { name: "Non-hate" })).toBeTruthy()
    expect(screen.getByText("Probability unavailable")).toBeTruthy()
    expect(screen.queryByText(/^\d+%$/)).toBeNull()
  })

  it("identifies a Non-hate result score as Hate probability", async () => {
    const user = userEvent.setup()
    render(
      <AnalyzeCommentPage
        dataSource={dataSourceFor(prediction({ label: "non_hate", score: 0.36 }))}
      />,
    )

    await user.type(screen.getByLabelText("Comment to analyze"), "a comment")
    await user.click(screen.getByRole("button", { name: "Analyze comment" }))

    expect(await screen.findByRole("heading", { name: "Non-hate" })).toBeTruthy()
    expect(screen.getByText("Hate probability")).toBeTruthy()
    expect(screen.getByText("36%")).toBeTruthy()
    expect(screen.getByText("Calibrated probability")).toBeTruthy()
    expect(screen.queryByText("Non-hate probability")).toBeNull()
  })

  it("shows Development preview only for fake-dev-v1 and never renders the resource token", async () => {
    const user = userEvent.setup()
    render(<AnalyzeCommentPage dataSource={dataSourceFor(prediction({ modelVersion: "fake-dev-v1" }))} />)

    await user.type(screen.getByLabelText("Comment to analyze"), "comment")
    await user.click(screen.getByRole("button", { name: "Analyze comment" }))

    expect(await screen.findByText("Development preview.")).toBeTruthy()
    expect(document.body.textContent).not.toContain("secret-token")
  })

  it("does not show Development preview for an opaque real model version", async () => {
    const user = userEvent.setup()
    render(<AnalyzeCommentPage dataSource={dataSourceFor(prediction({ modelVersion: "opaque-bundle-version" }))} />)

    await user.type(screen.getByLabelText("Comment to analyze"), "comment")
    await user.click(screen.getByRole("button", { name: "Analyze comment" }))

    await screen.findByRole("heading", { name: "Hate" })
    expect(screen.queryByText("Development preview.")).toBeNull()
  })

  it("disables submission while pending and preserves input after an error", async () => {
    let rejectRequest: ((reason?: unknown) => void) | undefined
    const source: ManualAnalysisDataSource = {
      createPrediction: vi.fn().mockImplementation(() => new Promise<ManualPrediction>((_, reject) => { rejectRequest = reject })),
    }
    const user = userEvent.setup()
    render(<AnalyzeCommentPage dataSource={source} />)

    const textarea = screen.getByLabelText("Comment to analyze")
    await user.type(textarea, "keep this Unicode text: ¡hola! 👋")
    await user.click(screen.getByRole("button", { name: "Analyze comment" }))

    expect(
      (screen.getByRole("button", { name: "Analyzing comment" }) as HTMLButtonElement).disabled,
    ).toBe(true)
    rejectRequest?.(new Error("network"))

    expect(await screen.findByText("Unable to analyze this comment")).toBeTruthy()
    expect((textarea as HTMLTextAreaElement).value).toBe("keep this Unicode text: ¡hola! 👋")
  })
})

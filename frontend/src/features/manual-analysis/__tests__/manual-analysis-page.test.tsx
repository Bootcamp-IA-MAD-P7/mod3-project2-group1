import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { failingPredictionHandler, noScorePredictionHandler, slowPredictionHandler } from "@/mocks/manual-analysis-handlers"
import { server } from "@/mocks/server"
import { ManualAnalysisPage } from "../manual-analysis-page"

describe("ManualAnalysisPage", () => {
  it("shows invalid feedback linked to the field", async () => {
    const user = userEvent.setup()
    render(<ManualAnalysisPage />)

    await user.click(screen.getByRole("button", { name: /analyze comment/i }))

    expect(screen.getByText("Enter some text before analyzing a comment.")).toBeTruthy()
    const textarea = screen.getByLabelText("Comment")
    expect(textarea.getAttribute("aria-invalid")).toBe("true")
    expect(textarea.getAttribute("aria-describedby")).toBe("comment-text-error")
  })

  it("disables submit while loading and shows the result", async () => {
    server.use(slowPredictionHandler)
    const user = userEvent.setup()
    render(<ManualAnalysisPage />)

    await user.type(screen.getByLabelText("Comment"), "you are a complete fool")
    await user.click(screen.getByRole("button", { name: /analyze comment/i }))

    const loadingButton = screen.getByRole("button", { name: /analyzing/i })
    expect((loadingButton as HTMLButtonElement).disabled).toBe(true)
    expect(await screen.findByText(/hate signal/i)).toBeTruthy()
    expect(screen.getByText(/score \(calibrated probability/i)).toBeTruthy()
  })

  it("keeps typed text and shows the server message on error", async () => {
    server.use(failingPredictionHandler)
    const user = userEvent.setup()
    render(<ManualAnalysisPage />)

    await user.type(screen.getByLabelText("Comment"), "keep this text after error")
    await user.click(screen.getByRole("button", { name: /analyze comment/i }))

    expect(await screen.findByText("Predictor not available")).toBeTruthy()
    expect((screen.getByLabelText("Comment") as HTMLTextAreaElement).value).toBe("keep this text after error")
  })

  it("shows the no-score signal without an invented percentage", async () => {
    server.use(noScorePredictionHandler)
    const user = userEvent.setup()
    render(<ManualAnalysisPage />)

    await user.type(screen.getByLabelText("Comment"), "a kind comment")
    await user.click(screen.getByRole("button", { name: /analyze comment/i }))

    expect(await screen.findByText(/no numeric score available/i)).toBeTruthy()
    expect(screen.queryByText(/%/)).toBeNull()
  })
})
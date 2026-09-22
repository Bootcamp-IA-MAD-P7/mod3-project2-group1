import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { App } from "@/app/App"
import { AppearanceProvider } from "@/app/providers/appearance-provider"

function renderApp() {
  return render(
    <AppearanceProvider>
      <App />
    </AppearanceProvider>,
  )
}

describe("App navigation (Essential)", () => {
  it("reaches the manual analysis feature from the sidebar without optional services", async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole("button", { name: /sign in/i }))
    const sidebar = screen.getByRole("complementary", { name: /main navigation/i })
    await user.click(within(sidebar).getByRole("button", { name: /analyze comment/i }))

    expect(screen.getByRole("heading", { name: "Analyze Comment" })).toBeTruthy()
    expect(screen.getByLabelText("Comment to analyze")).toBeTruthy()
  })

  it("does not render optional-service views before reaching the manual analysis", async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole("button", { name: /sign in/i }))
    const sidebar = screen.getByRole("complementary", { name: /main navigation/i })
    await user.click(within(sidebar).getByRole("button", { name: /analyze comment/i }))

    expect(screen.queryByText(/youtube video/i)).toBeNull()
  })
})

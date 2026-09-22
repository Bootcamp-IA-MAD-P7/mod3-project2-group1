import { expect, test } from "@playwright/test"

async function enterManualAnalysis(page: import("@playwright/test").Page) {
  await page.goto("/")
  await page.getByRole("button", { name: /sign in/i }).click()
  const sidebar = page.getByRole("complementary", { name: /main navigation/i })
  await sidebar.getByRole("button", { name: /analyze comment/i }).click()
  await expect(page.getByRole("heading", { name: /analyze a comment/i })).toBeVisible()
}

test("navigator reaches the real signal end to end", async ({ page }) => {
  await enterManualAnalysis(page)

  await page.getByRole("textbox", { name: "Comment" }).fill("this comment expresses real hate towards a person")
  await page.locator("main form").getByRole("button", { name: /analyze comment/i }).click()

  await expect(page.getByText(/hate signal|non-hate signal/i).first()).toBeVisible()
  await expect(page.getByText(/score \(calibrated probability/i)).toBeVisible()
  await expect(page.getByText(/^[0-9a-f]{8}$/)).toBeVisible()
})

test("empty submission shows an accessible error", async ({ page }) => {
  await enterManualAnalysis(page)

  await page.locator("main form").getByRole("button", { name: /analyze comment/i }).click()

  await expect(page.getByText("Enter some text before analyzing a comment.")).toBeVisible()
  await expect(page.getByRole("textbox", { name: "Comment" })).toHaveAttribute("aria-invalid", "true")
})
import { expect, test } from "@playwright/test"

test("shows model unavailability without inventing a signal", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("button", { name: /sign in/i }).click()
  const sidebar = page.getByRole("complementary", { name: /main navigation/i })
  await sidebar.getByRole("button", { name: /analyze comment/i }).click()

  await page.getByRole("textbox", { name: "Comment" }).fill("any comment at all")
  await page.locator("main form").getByRole("button", { name: /analyze comment/i }).click()

  await expect(page.getByText(/predictor not available|not available/i)).toBeVisible()
  await expect(page.getByText(/hate signal|non-hate signal/i)).toHaveCount(0)
})
import { expect, test } from "@playwright/test"
import { deleteCoinsAndDuties, seedCoinsAndDuties } from "../db/seeds/seedData.ts"

test.beforeEach(async () => {
  await deleteCoinsAndDuties()
  await seedCoinsAndDuties()
})

test.describe("Coins Dashboard E2E", () => {
  test("should display empty state cleanly when no coins exist", async ({ page }) => {
    await deleteCoinsAndDuties()

    await page.goto("/coins")

    await expect(page.getByRole("heading", { name: "Coins Dashboard" })).toBeVisible()
    await expect(page.getByTestId("coin-row")).toHaveCount(0)
    await expect(page.getByText("No coins available.")).toBeVisible()
  })

  test("should render seeded coins", async ({ page }) => {
    await page.goto("/coins")

    const coinLink = page.getByRole("link", { name: "Automate" })

    await expect(coinLink).toBeVisible()
  })
})

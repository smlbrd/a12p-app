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
    await expect(page.getByText("No coins available.")).toBeVisible()
  })

  test("should render seeded coins", async ({ page }) => {
    await page.goto("/coins")

    const coinHeading = page.getByRole("heading", { name: "Automate" })
    await expect(coinHeading).toBeVisible()
  })

  test("should render linked duties for each coin", async ({ page }) => {
    await page.goto("/coins")

    const coinCard = page.getByRole("listitem").filter({
      has: page.getByRole("heading", { name: "Automate" })
    })
    await expect(coinCard).toBeVisible()

    const dutyLinks = coinCard.getByRole("link", { name: /Duty \d+/ })

    await expect(dutyLinks).toHaveCount(3)
    await expect(dutyLinks).toContainText(["Duty 5", "Duty 7", "Duty 10"])
  })

  test("clicking a duty redirects user to specific duty", async ({ page }) => {
    await page.goto("/coins")

    const dutyBadge = page.getByRole("link", { name: "Duty 5" }).first()
    await expect(dutyBadge).toBeVisible()
    await dutyBadge.click()

    await expect(page).toHaveURL(/\/duties#duty-5$/)

    const targetDuty = page.locator("#duty-5")
    await expect(targetDuty).toBeVisible()
    await expect(targetDuty.getByRole("heading", { name: "Duty 5" })).toBeVisible()
  })
})

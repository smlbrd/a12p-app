import { expect, test } from "@playwright/test"
import { deleteData, seedData } from "../../app/db/seed.ts"

test.beforeEach(async () => {
    await deleteData()
    await seedData()
})

test.describe("Duties Dashboard E2E", () => {
    test("should display empty state cleanly when no duties exist", async ({page}) => {
        await deleteData()
        await page.goto("/duties")

        await expect(page.getByRole("heading", {name: "Duties Dashboard"})).toBeVisible()
        await expect(page.getByText("No duties available.")).toBeVisible()
    })

    test("should render seeded duties and their linked coins", async ({page}) => {
        await page.goto("/duties")

        const dutyCard = page.getByRole("listitem").filter({
            has: page.getByRole("heading", {name: "Duty 5"})
        })
        await expect(dutyCard).toBeVisible()

        const linkedCoinLink = dutyCard.getByRole("link", {name: "Automate"})

        await expect(linkedCoinLink).toBeVisible()
        await expect(linkedCoinLink).toHaveAttribute("href", /\/coins#coin-.*/)
    })
})

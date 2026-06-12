import { describe, expect, test } from "vitest"
import { insertCoinSchema } from "./schema.ts"

describe("insertCoinSchema Unit Tests", () => {
  describe("Success cases", () => {
    test("should pass with completely valid data", () => {
      const payload = { name: "New Coin", isCompleted: true }
      const result = insertCoinSchema.safeParse(payload)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toMatchObject(payload)
      }
    })

    test("should auto-trim whitespace and still pass if length > 0", () => {
      const payload = { name: "   Coin With Extra Space   ", isCompleted: false }
      const result = insertCoinSchema.safeParse(payload)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe("Coin With Extra Space")
      }
    })

    test("should pass when isCompleted is omitted (falls back to schema default)", () => {
      const payload = { name: "Default Test" }
      const result = insertCoinSchema.safeParse(payload)

      expect(result.success).toBe(true)
    })
  })

  describe("Failure cases", () => {
    test.each([
      {
        reason: "name contains only whitespace",
        payload: { name: "   ", isCompleted: false },
        expectedPath: "name",
        expectedMessage: "Name cannot be empty"
      },
      {
        reason: "the name exceeds 255 characters",
        payload: { name: "a".repeat(256), isCompleted: false },
        expectedPath: "name",
        expectedMessage: "Name cannot exceed 255 characters"
      },
      {
        reason: "name contains invalid special characters",
        payload: { name: "Coin!?%^&" },
        expectedPath: "name",
        expectedMessage: "Please use valid characters only: a-z A-Z 0-9 , . !"
      },
      {
        reason: "the request body is empty",
        payload: {},
        expectedPath: "name",
        expectedMessage: "Invalid input: expected string, received undefined"
      },
      {
        reason: "name is not a string type",
        payload: { name: 12345 },
        expectedPath: "name",
        expectedMessage: "Invalid input: expected string, received number"
      },
      {
        reason: "isCompleted is not a boolean type",
        payload: { name: "Valid Name", isCompleted: "true" },
        expectedPath: "isCompleted",
        expectedMessage: "Invalid input: expected boolean, received string"
      }
    ])("should fail validation if $reason", ({ payload, expectedPath, expectedMessage }) => {
      const result = insertCoinSchema.safeParse(payload)
      expect(result.success).toBe(false)

      if (!result.success) {
        const issue = result.error.issues[0]
        expect(issue?.path[0]).toBe(expectedPath)
        expect(issue?.message).toContain(expectedMessage)
      }
    })
  })
})

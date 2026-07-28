import { zValidator } from "@hono/zod-validator"
import type { ValidationTargets } from "hono"
import type { ZodSchema } from "zod"

export const validate = <
    Target extends keyof ValidationTargets,
    Schema extends ZodSchema
>(
    target: Target,
    schema: Schema
) =>
    zValidator(target, schema, (res) => {
        if (!res.success) {
            throw res.error
        }
    })

export const validateJson = <T extends ZodSchema>(schema: T) => validate("json", schema)
export const validateParam = <T extends ZodSchema>(schema: T) => validate("param", schema)
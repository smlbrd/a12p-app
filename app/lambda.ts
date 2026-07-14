import { handle } from "hono/aws-lambda"
import app from "./index.ts"

export const handler = handle(app)

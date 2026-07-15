import { handle } from "hono/aws-lambda"
import app from "./server.ts"

export const handler = handle(app)

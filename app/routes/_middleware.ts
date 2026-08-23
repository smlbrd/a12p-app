import { createRoute } from "honox/factory"
import { secureHeaders } from "hono/secure-headers"
import { optionalAuth } from "../middleware/auth.ts"
import { requestLogger } from "../middleware/requestLogger.ts"

export default createRoute(
    requestLogger,
    secureHeaders(),
    optionalAuth
)
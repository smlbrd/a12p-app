import { createRoute } from "honox/factory"
import { optionalAuth } from "../middleware/auth.ts"
import { requestLogger } from "../middleware/requestLogger.ts"
import { secureHeaders } from "../middleware/secureHeaders.ts"

export default createRoute(
    requestLogger,
    secureHeaders(),
    optionalAuth
)
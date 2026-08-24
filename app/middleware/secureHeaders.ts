import { secureHeaders as honoSecureHeaders } from "hono/secure-headers"

// Vite's dev server (used both for `npm run dev` and Playwright e2e tests)
// injects a same-origin HMR client script and opens a WebSocket connection
// back to itself for hot module reloading. Both are same-origin, so `'self'`
// covers the script, but the WebSocket needs an explicit `ws:`/`wss:` entry
// since some browsers don't fall back to `connect-src 'self'` for websockets
// consistently. Vite dev also injects a small inline
// `<script>import("/@vite/client")</script>` bootstrap snippet, which
// requires `'unsafe-inline'` for scripts in dev only. None of this is
// present in the production build (verified: production `<Script>` output
// is always an external same-origin module script, never inline).
const isDevelopment = process.env.NODE_ENV !== "production"

/**
 * Shared Content-Security-Policy (and other secure header) configuration.
 *
 * Exported so both the global app middleware (`app/server.ts`) and the
 * HonoX route middleware (`app/routes/_middleware.ts`) apply the exact same
 * policy rather than maintaining two configs that can silently drift apart.
 *
 * The app has no inline scripts or styles anywhere (all JS/CSS is served as
 * external same-origin files via HonoX's `<Script>`/`<Link>` components), so
 * a strict `'self'`-only policy works without needing nonces or
 * `'unsafe-inline'`.
 */
export const secureHeaders = () =>
    honoSecureHeaders({
        contentSecurityPolicy: {
            defaultSrc: ["'self'"],
            scriptSrc: isDevelopment ? ["'self'", "'unsafe-inline'"] : ["'self'"],
            styleSrc: ["'self'"],
            imgSrc: ["'self'", "data:"],
            fontSrc: ["'self'"],
            connectSrc: isDevelopment ? ["'self'", "ws:", "wss:"] : ["'self'"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            frameAncestors: ["'none'"]
        }
    })

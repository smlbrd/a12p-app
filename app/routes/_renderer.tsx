import { jsxRenderer } from "hono/jsx-renderer"
import { Link, Script } from "honox/server"

export default jsxRenderer(({ children, title }, c) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title || "Coins Dashboard"}</title>
        <Script src="/app/client.ts" async />
        <Link href="/app/style.css" rel="stylesheet" />
      </head>
      <body>
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  )
})

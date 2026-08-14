import { jsxRenderer } from "hono/jsx-renderer"
import { Link, Script } from "honox/server"
import LoginModal from "../islands/LoginModal.tsx"

declare module "hono" {
    interface ContextRenderer {
        (
            children: any,
            props?: { title?: string; isLoggedIn?: boolean }
        ): Response | Promise<Response>
    }
}

export default jsxRenderer(({children, title, isLoggedIn}: {
    children?: any;
    title?: string;
    isLoggedIn?: boolean
}) => {
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>{title || "Coins Dashboard"}</title>
            <Link href="/app/style.css" rel="stylesheet"/>
            <Script src="/app/client.ts" async/>
        </head>
        <body className="bg-gray-50 text-gray-900">
        <main className="container mx-auto p-4">{children}</main>

        {isLoggedIn && (
            <form action="/api/auth/logout" method="post" id="logout-form" className="hidden">
                <button type="submit"></button>
            </form>
        )}
        <LoginModal/>
        </body>
        </html>
    )
})
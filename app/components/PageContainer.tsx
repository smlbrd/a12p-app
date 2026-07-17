import type { Child } from "hono/jsx"

interface PageContainerProps {
    children: Child
}

export default function PageContainer(
    {children}: PageContainerProps) {

    return (
        <main className="space-y-8 max-w-4xl mx-auto px-4 py-6">
            {children}
        </main>
    )
}
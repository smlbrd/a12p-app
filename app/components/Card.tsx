import type { Child } from "hono/jsx"

interface CardProps {
    children: Child
    id?: string
    className?: string
    articleClassName?: string
}

export default function Card(
    {
        children,
        id,
        className = "",
        articleClassName = "gap-4",
    }: CardProps) {

    return (
        <li
            id={id}
            className={`bg-white transition-all duration-300 ${className}`}
        >
            <article className={`flex flex-col ${articleClassName}`}>
                {children}
            </article>
        </li>
    )
}
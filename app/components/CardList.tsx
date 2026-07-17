import type { Child } from "hono/jsx"

interface CardListProps {
    children: Child
    className?: string
}

export default function CardList(
    {children, className = ""}: CardListProps) {

    return (
        <ul className={`list-none p-0 m-0 ${className}`}>
            {children}
        </ul>
    )
}
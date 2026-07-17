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
            className={`
        bg-white 
        transition-all 
        duration-200 
        scroll-mt-6 
        target:bg-green-50/80 
        target:ring-2 
        target:ring-green-500 
        target:ring-offset-2
        
        ${className}
      `}
        >
            <article className={`flex flex-col ${articleClassName}`}>
                {children}
            </article>
        </li>
    )
}
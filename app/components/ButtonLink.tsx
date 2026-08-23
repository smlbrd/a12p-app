import type { Child } from "hono/jsx"

interface ButtonLinkProps {
    href: string
    children: Child
    variant?: "outline" | "solid"
    className?: string
}

export default function ButtonLink({
                                       href,
                                       children,
                                       variant = "solid",
                                       className = "",
                                   }: ButtonLinkProps) {
    const baseStyles = "inline-block text-xs font-bold rounded transition px-3 py-1.5"

    const variants = {
        solid: "text-white bg-emerald-600 hover:bg-emerald-700 font-bold font-mono",
        outline: "text-emerald-700 bg-emerald-50 hover:text-emerald-900 border border-emerald-300 hover:bg-emerald-100 font-bold font-mono"
    }

    return (
        <a href={href} className={`${baseStyles} ${variants[variant]} ${className}`}>
            {children}
        </a>
    )
}
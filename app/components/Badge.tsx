interface BadgeProps {
    href: string
    label: string
}

export default function Badge(
    {href, label}: BadgeProps) {

    return (
        <a
            href={href}
            className="block text-xs font-mono font-bold text-emerald-700 hover:text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded bg-emerald-50 hover:bg-emerald-100 transition cursor-pointer"
        >
            {label}
        </a>
    )
}
interface BadgeProps {
    href: string
    label: string
}

export default function Badge(
    {href, label}: BadgeProps) {

    return (
        <a
            href={href}
            className="block bg-blue-100 text-blue-900 px-2.5 py-1 border border-blue-200 transition-colors hover:bg-blue-200 cursor-pointer"
        >
            {label}
        </a>
    )
}
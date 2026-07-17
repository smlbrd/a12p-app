interface PageHeaderProps {
    title: string
    description: string
    actionHref?: string
    actionLabel?: string
}

export default function PageHeader(
    {
        title,
        description,
        actionHref,
        actionLabel,
    }: PageHeaderProps) {

    return (
        <header className="flex items-center justify-between border-b border-gray-600 pb-5">
            <div>
                <h1 className="text-xl font-bold text-[#003366] font-sans">{title}</h1>
                <p className="text-gray-500 text-xs mt-1">{description}</p>
            </div>
            {actionHref && actionLabel && (
                <a
                    href={actionHref}
                    className="text-xs font-mono font-bold text-blue-700 hover:text-blue-900 border border-blue-300 px-3 py-1.5 rounded bg-blue-50 hover:bg-blue-100 transition"
                >
                    {actionLabel}
                </a>
            )}
        </header>
    )
}
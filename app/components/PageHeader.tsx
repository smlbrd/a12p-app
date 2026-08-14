import AuthButton from "../islands/AuthButton.tsx"

interface PageHeaderProps {
    title: string
    description: string
    actionLabel?: string
    isLoggedIn?: boolean
}

export default function PageHeader(
    {
        title,
        description,
        actionLabel,
        isLoggedIn = false,
    }: PageHeaderProps) {

    return (
        <header className="flex items-center justify-between border-b border-gray-600 pb-5">
            <div>
                <h1 className="text-xl font-bold text-emerald-900 font-sans">{title}</h1>
                <p className="text-gray-500 text-xs mt-1">{description}</p>
            </div>
            {actionLabel && (
                <AuthButton
                    isLoggedIn={isLoggedIn}
                    actionLabel={actionLabel}
                />
            )}
        </header>
    )
}

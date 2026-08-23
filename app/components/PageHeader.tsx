import AuthButton from "../islands/AuthButton.tsx"
import ButtonLink from "./ButtonLink.tsx"

interface PageHeaderProps {
    title: string
    description: string
    actionLabel?: string
    isLoggedIn?: boolean
    isAdmin?: boolean
    showHomeLink?: boolean
}

export default function PageHeader({
                                       title,
                                       description,
                                       actionLabel,
                                       isLoggedIn = false,
                                       isAdmin = false
                                   }: PageHeaderProps) {
    return (
        <header className="flex flex-col gap-6 border-b border-gray-600 pb-5">
            <div className="flex items-center justify-between">
                <div>
                    <ButtonLink href="/" variant="outline">
                        Home
                    </ButtonLink>
                </div>

                <div className="flex items-center gap-3">
                    {isAdmin && (
                        <ButtonLink href="/admin/requests" variant="solid">
                            Admin Panel
                        </ButtonLink>
                    )}

                    {actionLabel && (
                        <AuthButton
                            isLoggedIn={isLoggedIn}
                            actionLabel={actionLabel}
                        />
                    )}
                </div>
            </div>

            <div>
                <h1 className="text-2xl font-bold text-emerald-900 font-sans">{title}</h1>
                <p className="text-gray-500 text-sm mt-1">{description}</p>
            </div>
        </header>
    )
}
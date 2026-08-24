import { useEffect, useState } from "hono/jsx"

interface AuthButtonProps {
    isLoggedIn: boolean
    actionLabel?: string
}

export default function AuthButton({
                                       isLoggedIn,
                                       actionLabel,
                                   }: AuthButtonProps) {
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) {
                window.location.reload()
            }
        }

        window.addEventListener("pageshow", handlePageShow)
        return () => window.removeEventListener("pageshow", handlePageShow)
    }, [])

    const handleClick = async () => {
        if (isLoggedIn) {
            setLoading(true)
            await fetch("/api/auth/logout", {method: "POST"})
            window.location.href = "/coins"
        } else {
            window.dispatchEvent(new CustomEvent("open-login-modal"))
        }
    }

    const label = actionLabel ?? (isLoggedIn ? "Log Out" : "Log In")

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={loading}
            className="cursor-pointer text-xs font-mono font-bold text-emerald-700 hover:text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded bg-emerald-50 hover:bg-emerald-100 transition disabled:opacity-50"
        >
            {loading ? "Processing..." : label}
        </button>
    )
}
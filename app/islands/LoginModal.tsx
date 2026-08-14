import { useEffect, useState } from "hono/jsx"

export default function LoginModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const handleOpen = () => setIsOpen(true)
        window.addEventListener("open-login-modal", handleOpen)
        return () => window.removeEventListener("open-login-modal", handleOpen)
    }, [])

    if (!isOpen) return null

    const handleSubmit = async (e: Event) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const data = Object.fromEntries(formData.entries())

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (response.ok && result.success) {
                window.location.reload()
            } else {
                setError(result.error || "Login failed")
            }
        } catch {
            setError("An unexpected error occurred.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-200 text-gray-900"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Log In</h2>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-2 bg-red-50 text-red-700 text-sm rounded border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-emerald-600 text-white py-2 px-4 rounded hover:bg-emerald-700 transition duration-200 font-medium disabled:opacity-50"
                    >
                        {isSubmitting ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    )
}
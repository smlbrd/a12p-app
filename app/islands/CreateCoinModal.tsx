import { useState } from "hono/jsx"

export default function CreateCoinModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: Event) => {
        e.preventDefault()
        setError("")
        setIsSubmitting(true)

        try {
            const response = await fetch("/api/coins", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({name}),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.error || "Failed to create coin")
            }

            setName("")
            setIsOpen(false)
            window.location.reload()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <div
                onClick={() => setIsOpen(true)}
                className="p-4 bg-gray-50 hover:bg-gray-100 border-gray-300 hover:border-gray-400 cursor-pointer flex items-center justify-center text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
                + Create new coin
            </div>

            {isOpen && (
                <div
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsOpen(false)
                    }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                >
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Create New Coin</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Coin Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName((e.target as HTMLInputElement).value)}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                    placeholder="e.g. Bitcoin"
                                    autoFocus
                                />
                                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    {isSubmitting ? "Creating..." : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
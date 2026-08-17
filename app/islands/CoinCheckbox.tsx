import { useState } from "hono/jsx"

interface CoinCheckboxProps {
    coinId: string
    coinName: string
    initialCompleted: boolean
}

export default function CoinCheckbox({
                                         coinId,
                                         coinName,
                                         initialCompleted,
                                     }: CoinCheckboxProps) {
    const [isCompleted, setIsCompleted] = useState(initialCompleted)
    const [isUpdating, setIsUpdating] = useState(false)

    const handleToggle = async () => {
        if (isUpdating) return

        const previousState = isCompleted
        const nextState = !previousState

        setIsCompleted(nextState)
        setIsUpdating(true)

        try {
            const res = await fetch(`/api/coins/${coinId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({isCompleted: nextState}),
            })

            if (!res.ok) {
                throw new Error("Failed to update coin")
            }
        } catch (error) {
            console.error("Failed to toggle status:", error)
            setIsCompleted(previousState)
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <label className="inline-flex items-center gap-3 cursor-pointer select-none group">
            <input
                type="checkbox"
                checked={isCompleted}
                disabled={isUpdating}
                onClick={handleToggle}
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 disabled:opacity-50 cursor-pointer accent-emerald-600"
                aria-label={`Mark ${coinName} as completed`}
            />
            <h2 className={`text-sm font-bold font-sans transition-colors ${
                isCompleted
                    ? "line-through text-gray-400"
                    : "text-black group-hover:text-emerald-800"
            }`}>
                {coinName}
            </h2>
        </label>
    )
}
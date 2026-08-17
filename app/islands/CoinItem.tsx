import { useState } from "hono/jsx"
import CoinCheckbox from "./CoinCheckbox.tsx"
import CoinActionsMenu from "./CoinActionsMenu.tsx"

interface CoinItemProps {
    coinId: string
    initialName: string
    initialCompleted: boolean
    isAdmin: boolean
}

export default function CoinItem({
                                     coinId,
                                     initialName,
                                     initialCompleted,
                                     isAdmin,
                                 }: CoinItemProps) {
    const [name, setName] = useState(initialName)
    const [isDeleted, setIsDeleted] = useState(false)

    if (isDeleted) return null

    const handleUpdateName = async (newName: string) => {
        const previousName = name
        setName(newName)

        try {
            const res = await fetch(`/api/coins/${coinId}`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name: newName}),
            })

            if (!res.ok) throw new Error("Failed to update name")
        } catch (error) {
            console.error(error)
            setName(previousName)
            throw error
        }
    }

    const handleDelete = async () => {
        setIsDeleted(true)

        try {
            const res = await fetch(`/api/coins/${coinId}`, {
                method: "DELETE",
            })

            if (!res.ok) throw new Error("Failed to delete coin")
        } catch (error) {
            console.error(error)
            setIsDeleted(false)
            throw error
        }
    }

    return (
        <div className="flex items-center justify-between gap-4 w-full">
            <CoinCheckbox
                coinId={coinId}
                coinName={name}
                initialCompleted={initialCompleted}
            />

            {isAdmin && (
                <CoinActionsMenu
                    coinName={name}
                    onUpdateName={handleUpdateName}
                    onDelete={handleDelete}
                />
            )}
        </div>
    )
}
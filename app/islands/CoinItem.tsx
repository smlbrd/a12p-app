import { useState } from "hono/jsx"
import Badge from "../components/Badge.tsx"
import CoinCheckbox from "./CoinCheckbox.tsx"
import CoinActionsMenu from "./CoinActionsMenu.tsx"

interface Duty {
    id: string
    number: number
}

interface CoinItemProps {
    coinId: string
    initialName: string
    initialCompleted: boolean
    isAdmin: boolean
    duties?: Duty[]
}

export default function CoinItem({
                                     coinId,
                                     initialName,
                                     initialCompleted,
                                     isAdmin,
                                     duties = [],
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
            console.error("Delete failed, restoring item:", error)
            setIsDeleted(false)
            alert("Failed to delete coin. Restoring item.")
        }
    }

    return (
        <>
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

            {duties.length > 0 && (
                <ul
                    aria-label={`Duties associated with ${name}`}
                    className="flex flex-wrap gap-2 text-xs font-mono font-bold mt-2"
                >
                    {duties.map((duty) => (
                        <li key={duty.id}>
                            <Badge
                                href={`/duties#duty-${duty.number}`}
                                label={`Duty ${duty.number}`}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </>
    )
}
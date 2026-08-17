import { useState } from "hono/jsx"

interface CoinActionsMenuProps {
    coinName: string
    onUpdateName: (newName: string) => Promise<void>
    onDelete: () => Promise<void>
}

export default function CoinActionsMenu({
                                            coinName,
                                            onUpdateName,
                                            onDelete,
                                        }: CoinActionsMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

    const [editInputName, setEditInputName] = useState(coinName)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    const handleEditSubmit = async (e: Event) => {
        e.preventDefault()
        if (isSubmitting) return

        const trimmed = editInputName.trim()
        if (!trimmed || trimmed === coinName) {
            setIsEditing(false)
            return
        }

        setIsSubmitting(true)
        setErrorMsg(null)

        try {
            await onUpdateName(trimmed)
            setIsEditing(false)
        } catch {
            setErrorMsg("Failed to save changes.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteConfirm = async () => {
        if (isSubmitting) return

        setIsSubmitting(true)
        setErrorMsg(null)

        try {
            await onDelete()
            setIsConfirmingDelete(false)
        } catch {
            setErrorMsg("Failed to delete item.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="relative inline-block text-left">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 rounded text-gray-400 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold leading-none"
                aria-label={`Actions for ${coinName}`}
            >
                &#8226;&#8226;&#8226;
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div
                    className="absolute right-0 mt-1 w-28 bg-white border border-gray-300 rounded shadow-sm z-20 py-1 font-mono text-xs">
                    <button
                        onClick={() => {
                            setIsOpen(false)
                            setEditInputName(coinName)
                            setIsEditing(true)
                        }}
                        className="w-full text-left px-3 py-1.5 text-black hover:bg-gray-100 transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => {
                            setIsOpen(false)
                            setIsConfirmingDelete(true)
                        }}
                        className="w-full text-left px-3 py-1.5 text-red-600 hover:bg-red-50 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            )}

            {/* Delete Modal */}
            {isConfirmingDelete && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded p-4 max-w-xs w-full border border-gray-300 shadow-lg font-sans">
                        <h3 className="text-sm font-bold text-black mb-1">Delete Coin?</h3>
                        <p className="text-xs text-gray-600 mb-4">
                            Are you sure you want to delete <span className="font-bold text-black">{coinName}</span>?
                        </p>
                        {errorMsg && <p className="text-xs text-red-600 mb-2">{errorMsg}</p>}
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => setIsConfirmingDelete(false)}
                                className="px-3 py-1 border border-gray-300 text-xs rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleDeleteConfirm}
                                className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded p-4 max-w-sm w-full border border-gray-300 shadow-lg font-sans">
                        <h3 className="text-sm font-bold text-black mb-3">Edit Coin</h3>
                        <form onSubmit={handleEditSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-mono text-gray-600 mb-1">
                                    Coin Name
                                </label>
                                <input
                                    type="text"
                                    value={editInputName}
                                    onInput={(e) => setEditInputName((e.target as HTMLInputElement).value)}
                                    required
                                    className="w-full border border-gray-300 rounded p-1.5 text-xs font-sans text-black focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            {errorMsg && <p className="text-xs text-red-600">{errorMsg}</p>}
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => setIsEditing(false)}
                                    className="px-3 py-1 border border-gray-300 text-xs rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
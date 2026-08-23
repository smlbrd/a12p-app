import { createRoute } from "honox/factory"
import { desc } from "drizzle-orm"
import { db } from "../../db/db.ts"
import { requestLogs } from "../../db/schema/tables.ts"
import { optionalAuth, requireAdmin } from "../../middleware/auth.ts"

import PageContainer from "../../components/PageContainer.tsx"
import PageHeader from "../../components/PageHeader.tsx"

export default createRoute(optionalAuth, requireAdmin, async (c) => {
    const logs = await db
        .select()
        .from(requestLogs)
        .orderBy(desc(requestLogs.timestamp))
        .limit(100)

    const isLoggedIn = c.get("isLoggedIn")
    const isAdmin = c.get("isAdmin")

    return c.render(
        <PageContainer>
            <PageHeader
                title="Request Logs"
                description="Audit recent incoming HTTP traffic (last 100 entries)."
                actionLabel={isLoggedIn ? "Log Out" : "Log In"}
                isLoggedIn={isLoggedIn}
                isAdmin={isAdmin}
                showHomeLink={true}
            />

            {logs.length === 0 ? (
                <p className="text-gray-700 text-xs py-4 font-mono">No request logs recorded.</p>
            ) : (
                <div className="bg-white border border-gray-400 overflow-x-auto mt-4">
                    <table className="w-full text-left font-mono text-xs text-black">
                        <thead className="bg-gray-100 border-b border-gray-400 uppercase text-gray-700">
                        <tr>
                            <th scope="col" className="px-4 py-3 font-bold">Method</th>
                            <th scope="col" className="px-4 py-3 font-bold">Path</th>
                            <th scope="col" className="px-4 py-3 font-bold">Status</th>
                            <th scope="col" className="px-4 py-3 font-bold">User</th>
                            <th scope="col" className="px-4 py-3 font-bold">Timestamp</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-400">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-bold">{log.method}</td>
                                <td className="px-4 py-3 text-gray-800">{log.path}</td>
                                <td className="px-4 py-3 font-bold">{log.statusCode}</td>
                                <td className="px-4 py-3 text-gray-600">
                                    {log.userId ?? <span className="italic text-gray-400">Anonymous</span>}
                                </td>
                                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </PageContainer>,
        {isLoggedIn}
    )
})
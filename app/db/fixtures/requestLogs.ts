import { requestLogs } from "../schema/index.ts"
import { USER_IDS } from "./users.ts"

export const REQUEST_LOG_IDS = {
    LOG_1: "00000000-0000-0000-0000-000000000101",
    LOG_2: "00000000-0000-0000-0000-000000000102",
    LOG_3: "00000000-0000-0000-0000-000000000103",
    LOG_4: "00000000-0000-0000-0000-000000000104",
    LOG_5: "00000000-0000-0000-0000-000000000105",
} as const

export const requestLogsData = [
    {
        id: REQUEST_LOG_IDS.LOG_1,
        method: "GET",
        path: "/coins",
        statusCode: 200,
        userId: USER_IDS.TEST_USER,
        timestamp: new Date("2026-03-30T10:00:00Z"),
    },
    {
        id: REQUEST_LOG_IDS.LOG_2,
        method: "GET",
        path: "/duties",
        statusCode: 200,
        userId: USER_IDS.TEST_USER,
        timestamp: new Date("2026-03-30T10:05:00Z"),
    },
    {
        id: REQUEST_LOG_IDS.LOG_3,
        method: "POST",
        path: "/coins",
        statusCode: 201,
        userId: USER_IDS.TEST_ADMIN,
        timestamp: new Date("2026-03-30T10:10:00Z"),
    },
    {
        id: REQUEST_LOG_IDS.LOG_4,
        method: "POST",
        path: "/auth/login",
        statusCode: 401,
        userId: null,
        timestamp: new Date("2026-03-30T10:15:00Z"),
    },
    {
        id: REQUEST_LOG_IDS.LOG_5,
        method: "POST",
        path: "/auth/logout",
        statusCode: 200,
        userId: USER_IDS.TEST_USER,
        timestamp: new Date("2026-03-30T10:20:00Z"),
    },
] satisfies (typeof requestLogs.$inferInsert)[]
import { users } from "../schema/index.ts"

export const USER_IDS = {
    TEST_USER: "00000000-0000-0000-0000-000000000001",
    TEST_ADMIN: "00000000-0000-0000-0000-000000000002"
} as const

export const usersData = [
    {
        id: USER_IDS.TEST_USER,
        username: "testuser",
        passwordHash: "$argon2id$v=19$m=19456,t=2,p=1$t+LwHc4R6N54XYsc8PxA3g$r1Ug3ej2JaH2cAY4AmIQ58exs/M6/dr3OnwvbvEk9Ag",
        role: "user"
    },
    {
        id: USER_IDS.TEST_ADMIN,
        username: "testadmin",
        passwordHash: "$argon2id$v=19$m=19456,t=2,p=1$xIoTy/1368qVIG3YeQYntw$Fy3dBCJ7t0FzTiFcbOqAZEe2ULM0QQeLRh7sjQQXsKY",
        role: "admin"
    }
] satisfies (typeof users.$inferInsert)[]
// backend/prisma.config.ts

import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        // Prisma 7 방식: env 헬퍼로 읽기
        url: env("DATABASE_URL"),
    },
});

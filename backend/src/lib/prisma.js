import dotenv from "dotenv";
import path from "node:path";
import Database from "better-sqlite3";
import { PrismaBetterSQLite } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL || "file:./mydb.sqlite";
// Prisma 7 client runs with the driver adapter, so we need an actual SQLite file path.
const sqlitePath = databaseUrl.startsWith("file:")
    ? databaseUrl.replace("file:", "")
    : databaseUrl;
const resolvedPath = path.isAbsolute(sqlitePath)
    ? sqlitePath
    : path.join(process.cwd(), sqlitePath);

const adapter = new PrismaBetterSQLite(new Database(resolvedPath));

// Reuse a single Prisma client instance across the app to avoid extra connections.
const prisma = new PrismaClient({ adapter });

export default prisma;

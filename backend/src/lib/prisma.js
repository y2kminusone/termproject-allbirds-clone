import dotenv from "dotenv";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import prismaPkg from "@prisma/client";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL || "file:./mydb.sqlite";

const adapter = new PrismaBetterSqlite3({ url: databaseUrl });

const { PrismaClient } = prismaPkg;

// Reuse a single Prisma client instance across the app to avoid extra connections.
const prisma = new PrismaClient({ adapter });

export default prisma;

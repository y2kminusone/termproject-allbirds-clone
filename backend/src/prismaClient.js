// src/prismaClient.js
import 'dotenv/config';
import pkg from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const { PrismaClient } = pkg;

// SQLite용 드라이버 어댑터 생성 (DATABASE_URL 사용)
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./mydb.sqlite',
});

// ✅ 이제 반드시 adapter를 넣어서 생성해야 함
export const prisma = new PrismaClient({ adapter });
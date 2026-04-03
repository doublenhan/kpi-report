import { createClient } from "@libsql/client";
import "dotenv/config";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const statements = [
  `CREATE TABLE IF NOT EXISTS "Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "month" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "taskName" TEXT NOT NULL,
    "progressTime" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "MonthMeta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "month" TEXT NOT NULL,
    "totalShifts" TEXT NOT NULL DEFAULT '',
    "fullName" TEXT NOT NULL DEFAULT ''
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "MonthMeta_month_key" ON "MonthMeta"("month")`,
];

for (const sql of statements) {
  console.log("Executing:", sql.slice(0, 60) + "...");
  await client.execute(sql);
}

// Add new columns if they don't exist (safe for existing tables)
const alterStatements = [
  `ALTER TABLE "MonthMeta" ADD COLUMN "fullName" TEXT NOT NULL DEFAULT ''`,
];

for (const sql of alterStatements) {
  try {
    console.log("Executing:", sql.slice(0, 60) + "...");
    await client.execute(sql);
  } catch (err) {
    // Ignore "duplicate column" errors
    if (err.message?.includes("duplicate column")) {
      console.log("  ↳ Column already exists, skipping.");
    } else {
      throw err;
    }
  }
}

console.log("✅ Turso database schema pushed successfully!");

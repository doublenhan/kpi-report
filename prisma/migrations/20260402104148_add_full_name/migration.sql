-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MonthMeta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "month" TEXT NOT NULL,
    "totalShifts" TEXT NOT NULL DEFAULT '',
    "fullName" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_MonthMeta" ("id", "month", "totalShifts") SELECT "id", "month", "totalShifts" FROM "MonthMeta";
DROP TABLE "MonthMeta";
ALTER TABLE "new_MonthMeta" RENAME TO "MonthMeta";
CREATE UNIQUE INDEX "MonthMeta_month_key" ON "MonthMeta"("month");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateTable
CREATE TABLE "MonthMeta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "month" TEXT NOT NULL,
    "totalShifts" TEXT NOT NULL DEFAULT ''
);

-- CreateIndex
CREATE UNIQUE INDEX "MonthMeta_month_key" ON "MonthMeta"("month");

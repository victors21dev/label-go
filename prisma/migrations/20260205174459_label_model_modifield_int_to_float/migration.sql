/*
  Warnings:

  - You are about to alter the column `heightMm` on the `LabelModel` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `widthMm` on the `LabelModel` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LabelModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "widthMm" REAL NOT NULL,
    "heightMm" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_LabelModel" ("createdAt", "heightMm", "id", "name", "updatedAt", "widthMm") SELECT "createdAt", "heightMm", "id", "name", "updatedAt", "widthMm" FROM "LabelModel";
DROP TABLE "LabelModel";
ALTER TABLE "new_LabelModel" RENAME TO "LabelModel";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

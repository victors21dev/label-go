/*
  Warnings:

  - You are about to drop the column `sectorId` on the `LabelModel` table. All the data in the column will be lost.
  - Added the required column `date` to the `LabelGeneration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `LabelGeneration` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LabelGeneration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "sectorId" TEXT NOT NULL,
    "labelModelId" TEXT NOT NULL,
    "printerId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "justification" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'GENERATED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LabelGeneration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LabelGeneration_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LabelGeneration_labelModelId_fkey" FOREIGN KEY ("labelModelId") REFERENCES "LabelModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LabelGeneration_printerId_fkey" FOREIGN KEY ("printerId") REFERENCES "Printer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LabelGeneration" ("createdAt", "id", "justification", "labelModelId", "printerId", "sectorId", "status", "userId") SELECT "createdAt", "id", "justification", "labelModelId", "printerId", "sectorId", "status", "userId" FROM "LabelGeneration";
DROP TABLE "LabelGeneration";
ALTER TABLE "new_LabelGeneration" RENAME TO "LabelGeneration";
CREATE TABLE "new_LabelModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "widthMm" INTEGER NOT NULL,
    "heightMm" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_LabelModel" ("createdAt", "heightMm", "id", "name", "updatedAt", "widthMm") SELECT "createdAt", "heightMm", "id", "name", "updatedAt", "widthMm" FROM "LabelModel";
DROP TABLE "LabelModel";
ALTER TABLE "new_LabelModel" RENAME TO "LabelModel";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

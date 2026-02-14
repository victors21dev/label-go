-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_sectorId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "sectorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id") ON DELETE SET NULL ON UPDATE CASCADE;

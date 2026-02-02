/*
  Warnings:

  - You are about to drop the column `assetId` on the `Lead` table. All the data in the column will be lost.
  - The `status` column on the `Lead` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[name]` on the table `Asset` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Cluster` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Lead` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Agent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_assetId_fkey";

-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "area" DOUBLE PRECISION,
ADD COLUMN     "availableUnits" INTEGER,
ADD COLUMN     "bathrooms" INTEGER,
ADD COLUMN     "bedrooms" INTEGER,
ADD COLUMN     "capitalAppreciation" DOUBLE PRECISION,
ADD COLUMN     "capitalAppreciationMax" DOUBLE PRECISION,
ADD COLUMN     "capitalAppreciationMin" DOUBLE PRECISION,
ADD COLUMN     "projectedRentalIncome" DOUBLE PRECISION,
ADD COLUMN     "rentalYieldMax" DOUBLE PRECISION,
ADD COLUMN     "rentalYieldMin" DOUBLE PRECISION,
ADD COLUMN     "riskFactors" TEXT[],
ADD COLUMN     "riskLevel" TEXT,
ADD COLUMN     "totalReturnsMax" DOUBLE PRECISION,
ADD COLUMN     "totalReturnsMin" DOUBLE PRECISION,
ADD COLUMN     "totalUnits" INTEGER;

-- AlterTable
ALTER TABLE "InstallmentPlan" ADD COLUMN     "buyerEmail" TEXT,
ADD COLUMN     "buyerName" TEXT,
ADD COLUMN     "buyerPhone" TEXT;

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "assetId",
ADD COLUMN     "assetInterest" TEXT,
ADD COLUMN     "assignedCluster" TEXT,
ADD COLUMN     "leadSource" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "ownershipType" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Asset_name_key" ON "Asset"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Cluster_name_key" ON "Cluster"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_email_key" ON "Lead"("email");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_assetInterest_fkey" FOREIGN KEY ("assetInterest") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

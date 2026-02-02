/*
  Warnings:

  - You are about to drop the column `basePrice` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `finalPrice` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `markup` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `publishedAt` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `referenceCode` on the `Asset` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Asset_name_key";

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "basePrice",
DROP COLUMN "finalPrice",
DROP COLUMN "markup",
DROP COLUMN "publishedAt",
DROP COLUMN "referenceCode",
ADD COLUMN     "commission" TEXT,
ADD COLUMN     "commissionRate" TEXT,
ADD COLUMN     "constructionStage" TEXT,
ADD COLUMN     "facilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "fractionCost" TEXT,
ADD COLUMN     "fundingStatus" INTEGER,
ADD COLUMN     "furnished" TEXT,
ADD COLUMN     "ownershipOptions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "parking" TEXT,
ADD COLUMN     "price" TEXT,
ADD COLUMN     "priceRange" TEXT,
ADD COLUMN     "projectStatus" TEXT,
ADD COLUMN     "rentalYield" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "totalReturns" TEXT,
ADD COLUMN     "units" INTEGER,
ADD COLUMN     "virtualTours" INTEGER,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;

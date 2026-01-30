-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "area" TEXT,
ADD COLUMN     "bathrooms" INTEGER,
ADD COLUMN     "bedrooms" INTEGER,
ADD COLUMN     "furnishing" TEXT,
ADD COLUMN     "monthlyRentalIncome" DOUBLE PRECISION,
ADD COLUMN     "rentalYield" DOUBLE PRECISION,
ALTER COLUMN "exitLiquidity" DROP NOT NULL,
ALTER COLUMN "managementMode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "landUnitCount" INTEGER,
ADD COLUMN     "landUnitType" TEXT;

-- AlterTable
ALTER TABLE "Cluster" ADD COLUMN     "commissionType" TEXT DEFAULT 'AGENT';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountNumber" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "beneficiaryName" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "dateOfRecruitment" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "homeAddress" TEXT,
ADD COLUMN     "kinAddress" TEXT,
ADD COLUMN     "kinFullName" TEXT,
ADD COLUMN     "kinPhoneNumber" TEXT,
ADD COLUMN     "kinRelationship" TEXT,
ADD COLUMN     "nin" TEXT,
ADD COLUMN     "stateOfOrigin" TEXT,
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorSecret" TEXT;

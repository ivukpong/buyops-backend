/*
  Warnings:

  - You are about to drop the column `activeDeals` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `performance` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Agent` table. All the data in the column will be lost.
  - The `status` column on the `Agent` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `address` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `area` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `availableUnits` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `basePrice` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `bathrooms` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `bedrooms` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `builtSize` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `capitalAppreciation` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `closerCommission` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `constructionEnd` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `constructionStage` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `constructionStart` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `costPerFraction` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `documents` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `downPaymentAmount` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `exitLiquidity` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `facilities` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `facilityManagement` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `featured` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `finalPrice` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `firstPayoutDate` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `fractionTotal` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `furnishing` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `furnishingStatus` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `installmentPeriods` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `landSize` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `leadCommission` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `managementMode` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `markup` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `monthlyRentalIncome` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `offPlanDiscount` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `offPlanSecurity` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `operatingCost` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `ownershipType` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `paymentOptions` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `projectStatus` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `projectedRentalIncome` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `propertyCategory` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `referenceCode` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `rentalFrequency` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `rentalYield` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `riskLevel` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `sharedFacilities` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `stageBasedDiscount` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `totalAnnualReturn` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `totalUnits` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `unitConfiguration` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `activeAssets` on the `Cluster` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `Cluster` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Cluster` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Cluster` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Cluster` table. All the data in the column will be lost.
  - You are about to drop the column `teamLead` on the `Cluster` table. All the data in the column will be lost.
  - You are about to drop the column `totalCommission` on the `Cluster` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Cluster` table. All the data in the column will be lost.
  - You are about to drop the column `accountName` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `accountNumber` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `activeAssets` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `agreementExpiryDate` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `agreementStartDate` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `bankName` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `commissionRate` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `contactPerson` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `paymentTerms` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `registrationNumber` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `totalTransactions` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Freelancer` table. All the data in the column will be lost.
  - You are about to drop the column `performance` on the `Freelancer` table. All the data in the column will be lost.
  - You are about to drop the column `registeredBy` on the `Freelancer` table. All the data in the column will be lost.
  - You are about to drop the column `registrarName` on the `Freelancer` table. All the data in the column will be lost.
  - You are about to drop the column `registrarType` on the `Freelancer` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Freelancer` table. All the data in the column will be lost.
  - The `status` column on the `Freelancer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `paymentMethod` on the `Installment` table. All the data in the column will be lost.
  - The `status` column on the `Installment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `buyerEmail` on the `InstallmentPlan` table. All the data in the column will be lost.
  - You are about to drop the column `buyerName` on the `InstallmentPlan` table. All the data in the column will be lost.
  - You are about to drop the column `buyerPhone` on the `InstallmentPlan` table. All the data in the column will be lost.
  - You are about to drop the column `assetInterest` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `assignedCluster` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `assignedTo` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `leadSource` on the `Lead` table. All the data in the column will be lost.
  - The `status` column on the `Lead` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `amount` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `earnedCloserCommission` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `earnedLeadCommission` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `installmentPlanId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `paymentType` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `pendingCloserCommission` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `pendingLeadCommission` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `pendingTotalCommission` on the `Transaction` table. All the data in the column will be lost.
  - The `commissionPaymentStatus` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Investment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sale` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[agentProfileId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[freelancerProfileId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transactionId` to the `Installment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Made the column `closerCommission` on table `Transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `earnedTotalCommission` on table `Transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'AGENT', 'FREELANCER', 'INVESTOR', 'USER');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "AgentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- CreateEnum
CREATE TYPE "FreelancerStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CommissionPaymentStatus" AS ENUM ('UNPAID', 'SENT', 'PAID');

-- CreateEnum
CREATE TYPE "InstallmentStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CommissionStatus" AS ENUM ('UNPAID', 'PARTIAL', 'PAID');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ERROR');

-- DropForeignKey
ALTER TABLE "Agent" DROP CONSTRAINT "Agent_clusterId_fkey";

-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Freelancer" DROP CONSTRAINT "Freelancer_clusterId_fkey";

-- DropForeignKey
ALTER TABLE "Installment" DROP CONSTRAINT "Installment_installmentPlanId_fkey";

-- DropForeignKey
ALTER TABLE "Investment" DROP CONSTRAINT "Investment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_assignedCluster_fkey";

-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_productId_fkey";

-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_installmentPlanId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_leadAgentId_fkey";

-- DropIndex
DROP INDEX "Asset_companyId_idx";

-- DropIndex
DROP INDEX "Asset_location_idx";

-- DropIndex
DROP INDEX "Asset_referenceCode_key";

-- DropIndex
DROP INDEX "Asset_status_idx";

-- DropIndex
DROP INDEX "Asset_type_idx";

-- DropIndex
DROP INDEX "Cluster_code_key";

-- DropIndex
DROP INDEX "Company_email_key";

-- DropIndex
DROP INDEX "Installment_dueDate_idx";

-- DropIndex
DROP INDEX "Installment_installmentPlanId_idx";

-- DropIndex
DROP INDEX "Installment_status_idx";

-- DropIndex
DROP INDEX "InstallmentPlan_assetId_idx";

-- DropIndex
DROP INDEX "InstallmentPlan_buyerEmail_idx";

-- DropIndex
DROP INDEX "InstallmentPlan_status_idx";

-- DropIndex
DROP INDEX "InstallmentPlan_transactionId_key";

-- DropIndex
DROP INDEX "Lead_assignedCluster_idx";

-- DropIndex
DROP INDEX "Lead_email_idx";

-- DropIndex
DROP INDEX "Lead_status_idx";

-- DropIndex
DROP INDEX "SavedProperty_assetId_idx";

-- DropIndex
DROP INDEX "SavedProperty_read_idx";

-- DropIndex
DROP INDEX "SavedProperty_timestamp_idx";

-- DropIndex
DROP INDEX "SavedProperty_userId_idx";

-- DropIndex
DROP INDEX "Transaction_assetId_idx";

-- DropIndex
DROP INDEX "Transaction_buyerId_idx";

-- DropIndex
DROP INDEX "Transaction_date_idx";

-- DropIndex
DROP INDEX "Transaction_installmentPlanId_key";

-- DropIndex
DROP INDEX "Transaction_leadAgentId_idx";

-- DropIndex
DROP INDEX "Transaction_status_idx";

-- DropIndex
DROP INDEX "User_email_idx";

-- DropIndex
DROP INDEX "User_role_idx";

-- AlterTable
ALTER TABLE "Agent" DROP COLUMN "activeDeals",
DROP COLUMN "createdAt",
DROP COLUMN "performance",
DROP COLUMN "role",
DROP COLUMN "updatedAt",
ALTER COLUMN "clusterId" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "AgentStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "address",
DROP COLUMN "area",
DROP COLUMN "availableUnits",
DROP COLUMN "basePrice",
DROP COLUMN "bathrooms",
DROP COLUMN "bedrooms",
DROP COLUMN "builtSize",
DROP COLUMN "capitalAppreciation",
DROP COLUMN "closerCommission",
DROP COLUMN "constructionEnd",
DROP COLUMN "constructionStage",
DROP COLUMN "constructionStart",
DROP COLUMN "costPerFraction",
DROP COLUMN "createdAt",
DROP COLUMN "documents",
DROP COLUMN "downPaymentAmount",
DROP COLUMN "exitLiquidity",
DROP COLUMN "facilities",
DROP COLUMN "facilityManagement",
DROP COLUMN "featured",
DROP COLUMN "finalPrice",
DROP COLUMN "firstPayoutDate",
DROP COLUMN "fractionTotal",
DROP COLUMN "furnishing",
DROP COLUMN "furnishingStatus",
DROP COLUMN "images",
DROP COLUMN "installmentPeriods",
DROP COLUMN "landSize",
DROP COLUMN "leadCommission",
DROP COLUMN "location",
DROP COLUMN "managementMode",
DROP COLUMN "markup",
DROP COLUMN "monthlyRentalIncome",
DROP COLUMN "offPlanDiscount",
DROP COLUMN "offPlanSecurity",
DROP COLUMN "operatingCost",
DROP COLUMN "ownershipType",
DROP COLUMN "paymentOptions",
DROP COLUMN "projectStatus",
DROP COLUMN "projectedRentalIncome",
DROP COLUMN "propertyCategory",
DROP COLUMN "referenceCode",
DROP COLUMN "rentalFrequency",
DROP COLUMN "rentalYield",
DROP COLUMN "riskLevel",
DROP COLUMN "sharedFacilities",
DROP COLUMN "stageBasedDiscount",
DROP COLUMN "status",
DROP COLUMN "totalAnnualReturn",
DROP COLUMN "totalUnits",
DROP COLUMN "type",
DROP COLUMN "unitConfiguration",
DROP COLUMN "updatedAt",
ALTER COLUMN "companyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Cluster" DROP COLUMN "activeAssets",
DROP COLUMN "code",
DROP COLUMN "createdAt",
DROP COLUMN "location",
DROP COLUMN "status",
DROP COLUMN "teamLead",
DROP COLUMN "totalCommission",
DROP COLUMN "updatedAt",
ADD COLUMN     "managerId" TEXT;

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "accountName",
DROP COLUMN "accountNumber",
DROP COLUMN "activeAssets",
DROP COLUMN "address",
DROP COLUMN "agreementExpiryDate",
DROP COLUMN "agreementStartDate",
DROP COLUMN "bankName",
DROP COLUMN "commissionRate",
DROP COLUMN "contactPerson",
DROP COLUMN "createdAt",
DROP COLUMN "email",
DROP COLUMN "notes",
DROP COLUMN "paymentTerms",
DROP COLUMN "phone",
DROP COLUMN "registrationNumber",
DROP COLUMN "status",
DROP COLUMN "totalTransactions",
DROP COLUMN "type",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Freelancer" DROP COLUMN "createdAt",
DROP COLUMN "performance",
DROP COLUMN "registeredBy",
DROP COLUMN "registrarName",
DROP COLUMN "registrarType",
DROP COLUMN "updatedAt",
ALTER COLUMN "clusterId" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "FreelancerStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Installment" DROP COLUMN "paymentMethod",
ADD COLUMN     "transactionId" TEXT NOT NULL,
ALTER COLUMN "installmentPlanId" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "InstallmentStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "InstallmentPlan" DROP COLUMN "buyerEmail",
DROP COLUMN "buyerName",
DROP COLUMN "buyerPhone";

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "assetInterest",
DROP COLUMN "assignedCluster",
DROP COLUMN "assignedTo",
DROP COLUMN "createdBy",
DROP COLUMN "leadSource",
ADD COLUMN     "assignedToId" TEXT,
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "notes" TEXT,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "budget" DROP NOT NULL,
ALTER COLUMN "source" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "LeadStatus" NOT NULL DEFAULT 'NEW';

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "amount",
DROP COLUMN "companyId",
DROP COLUMN "earnedCloserCommission",
DROP COLUMN "earnedLeadCommission",
DROP COLUMN "installmentPlanId",
DROP COLUMN "paymentType",
DROP COLUMN "pendingCloserCommission",
DROP COLUMN "pendingLeadCommission",
DROP COLUMN "pendingTotalCommission",
ADD COLUMN     "commission" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "leadAgentId" DROP NOT NULL,
ALTER COLUMN "leadCommission" SET DEFAULT 0,
ALTER COLUMN "closerCommission" SET NOT NULL,
ALTER COLUMN "closerCommission" SET DEFAULT 0,
ALTER COLUMN "totalCommission" SET DEFAULT 0,
ALTER COLUMN "earnedTotalCommission" SET NOT NULL,
ALTER COLUMN "earnedTotalCommission" SET DEFAULT 0,
DROP COLUMN "commissionPaymentStatus",
ADD COLUMN     "commissionPaymentStatus" "CommissionPaymentStatus" NOT NULL DEFAULT 'UNPAID',
DROP COLUMN "status",
ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "phone",
ADD COLUMN     "agentProfileId" TEXT,
ADD COLUMN     "freelancerProfileId" TEXT,
ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "refreshToken" TEXT,
ALTER COLUMN "name" SET NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL;

-- DropTable
DROP TABLE "Investment";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "Sale";

-- CreateTable
CREATE TABLE "Commission" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "status" "CommissionStatus" NOT NULL DEFAULT 'UNPAID',
    "paidDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'INFO',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_agentProfileId_key" ON "User"("agentProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "User_freelancerProfileId_key" ON "User"("freelancerProfileId");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "Cluster"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Freelancer" ADD CONSTRAINT "Freelancer_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "Cluster"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cluster" ADD CONSTRAINT "Cluster_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_leadAgentId_fkey" FOREIGN KEY ("leadAgentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallmentPlan" ADD CONSTRAINT "InstallmentPlan_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Installment" ADD CONSTRAINT "Installment_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Installment" ADD CONSTRAINT "Installment_installmentPlanId_fkey" FOREIGN KEY ("installmentPlanId") REFERENCES "InstallmentPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commission" ADD CONSTRAINT "Commission_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commission" ADD CONSTRAINT "Commission_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

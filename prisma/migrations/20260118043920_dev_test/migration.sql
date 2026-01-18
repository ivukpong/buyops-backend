/*
  Warnings:

  - A unique constraint covering the columns `[transactionId]` on the table `InstallmentPlan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[installmentPlanId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "InstallmentPlan" DROP CONSTRAINT "InstallmentPlan_closerAgentId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_closerAgentId_fkey";

-- AlterTable
ALTER TABLE "InstallmentPlan" ADD COLUMN     "transactionId" TEXT,
ALTER COLUMN "closerAgentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "installmentPlanId" TEXT,
ALTER COLUMN "closerAgentId" DROP NOT NULL,
ALTER COLUMN "closerCommission" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "InstallmentPlan_transactionId_key" ON "InstallmentPlan"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_installmentPlanId_key" ON "Transaction"("installmentPlanId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_closerAgentId_fkey" FOREIGN KEY ("closerAgentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallmentPlan" ADD CONSTRAINT "InstallmentPlan_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallmentPlan" ADD CONSTRAINT "InstallmentPlan_closerAgentId_fkey" FOREIGN KEY ("closerAgentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

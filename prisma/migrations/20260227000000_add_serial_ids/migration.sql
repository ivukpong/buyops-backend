-- Migration: add_serial_ids
-- Adds human-readable serial IDs (BO-{PREFIX}-{NNNN}) to all key entities.
-- These are display-only identifiers; the UUID `id` remains the primary key.

ALTER TABLE "User"             ADD COLUMN "serialId" TEXT UNIQUE;
ALTER TABLE "Company"          ADD COLUMN "serialId" TEXT UNIQUE;
ALTER TABLE "Asset"            ADD COLUMN "serialId" TEXT UNIQUE;
ALTER TABLE "Lead"             ADD COLUMN "serialId" TEXT UNIQUE;
ALTER TABLE "Agent"            ADD COLUMN "serialId" TEXT UNIQUE;
ALTER TABLE "Freelancer"       ADD COLUMN "serialId" TEXT UNIQUE;
ALTER TABLE "Cluster"          ADD COLUMN "serialId" TEXT UNIQUE;
ALTER TABLE "Transaction"      ADD COLUMN "serialId" TEXT UNIQUE;
ALTER TABLE "InstallmentPlan"  ADD COLUMN "serialId" TEXT UNIQUE;
ALTER TABLE "Installment"      ADD COLUMN "serialId" TEXT UNIQUE;
ALTER TABLE "Commission"       ADD COLUMN "serialId" TEXT UNIQUE;

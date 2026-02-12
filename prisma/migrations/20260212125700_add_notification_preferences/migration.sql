-- AlterTable
ALTER TABLE "User" ADD COLUMN     "agentUpdates" BOOLEAN DEFAULT true,
ADD COLUMN     "emailNotifications" BOOLEAN DEFAULT true,
ADD COLUMN     "pushNotifications" BOOLEAN DEFAULT true,
ADD COLUMN     "transactionAlerts" BOOLEAN DEFAULT true,
ADD COLUMN     "weeklyReports" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currency" TEXT DEFAULT 'NGN',
ADD COLUMN     "dateFormat" TEXT DEFAULT 'DD/MM/YYYY',
ADD COLUMN     "timezone" TEXT DEFAULT 'Africa/Lagos';

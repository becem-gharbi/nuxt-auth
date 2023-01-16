-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerifyToken" TEXT,
ADD COLUMN     "passwordResetToken" TEXT;

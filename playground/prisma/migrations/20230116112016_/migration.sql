/*
  Warnings:

  - You are about to drop the column `emailVerifyToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordResetToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerifyToken",
DROP COLUMN "passwordResetToken";

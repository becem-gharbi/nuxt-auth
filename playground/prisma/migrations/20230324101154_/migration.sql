/*
  Warnings:

  - You are about to drop the column `blocked` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "blocked",
ADD COLUMN     "suspended" BOOLEAN NOT NULL DEFAULT false;

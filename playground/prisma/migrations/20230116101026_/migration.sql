/*
  Warnings:

  - You are about to drop the column `secret` on the `RefreshToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uid]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uid` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "RefreshToken_secret_key";

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "secret",
ADD COLUMN     "uid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_uid_key" ON "RefreshToken"("uid");

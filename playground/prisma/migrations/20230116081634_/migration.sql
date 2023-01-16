/*
  Warnings:

  - You are about to drop the column `token` on the `RefreshToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[secret]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `secret` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "RefreshToken_token_key";

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "token",
ADD COLUMN     "secret" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "metadata" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_secret_key" ON "RefreshToken"("secret");

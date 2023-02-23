/*
  Warnings:

  - The values [github,facebook] on the enum `Provider` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `updatedAt` on table `RefreshToken` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Provider_new" AS ENUM ('default', 'google');
ALTER TABLE "User" ALTER COLUMN "provider" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "provider" TYPE "Provider_new" USING ("provider"::text::"Provider_new");
ALTER TYPE "Provider" RENAME TO "Provider_old";
ALTER TYPE "Provider_new" RENAME TO "Provider";
DROP TYPE "Provider_old";
ALTER TABLE "User" ALTER COLUMN "provider" SET DEFAULT 'default';
COMMIT;

-- AlterTable
ALTER TABLE "RefreshToken" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET NOT NULL;

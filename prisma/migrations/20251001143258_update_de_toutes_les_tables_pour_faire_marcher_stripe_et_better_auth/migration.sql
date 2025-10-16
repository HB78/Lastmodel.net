/*
  Warnings:

  - You are about to drop the column `amount` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `canceledAt` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `renewalDate` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `stripePriceId` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `subscriptions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[referenceId]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.
  - Made the column `cancelAtPeriodEnd` on table `subscriptions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `subscriptions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."subscriptions" DROP CONSTRAINT "subscriptions_userId_fkey";

-- DropIndex
DROP INDEX "public"."subscriptions_userId_key";

-- AlterTable
ALTER TABLE "public"."subscriptions" DROP COLUMN "amount",
DROP COLUMN "canceledAt",
DROP COLUMN "currency",
DROP COLUMN "endDate",
DROP COLUMN "renewalDate",
DROP COLUMN "startDate",
DROP COLUMN "stripePriceId",
DROP COLUMN "userId",
ADD COLUMN     "trialEnd" TIMESTAMP(3),
ADD COLUMN     "trialStart" TIMESTAMP(3),
ALTER COLUMN "cancelAtPeriodEnd" SET NOT NULL,
ALTER COLUMN "cancelAtPeriodEnd" SET DEFAULT false,
ALTER COLUMN "status" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_referenceId_key" ON "public"."subscriptions"("referenceId");

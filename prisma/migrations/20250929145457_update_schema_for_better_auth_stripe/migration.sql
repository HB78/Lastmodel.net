/*
  Warnings:

  - You are about to alter the column `amount` on the `subscriptions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to drop the column `subscriptionStatus` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[stripeSubscriptionId]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `plan` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referenceId` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_subscriptionId_fkey";

-- AlterTable
ALTER TABLE "public"."subscriptions" ADD COLUMN     "cancelAtPeriodEnd" BOOLEAN,
ADD COLUMN     "periodEnd" TIMESTAMP(3),
ADD COLUMN     "periodStart" TIMESTAMP(3),
ADD COLUMN     "plan" TEXT NOT NULL,
ADD COLUMN     "referenceId" TEXT NOT NULL,
ADD COLUMN     "seats" INTEGER,
ADD COLUMN     "status" TEXT,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "subscriptionStatus",
ADD COLUMN     "stripeCustomerId" TEXT;

-- DropTable
DROP TABLE "public"."payments";

-- DropEnum
DROP TYPE "public"."SubscriptionStatus";

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripeSubscriptionId_key" ON "public"."subscriptions"("stripeSubscriptionId");

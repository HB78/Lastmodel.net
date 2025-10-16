-- CreateEnum
CREATE TYPE "public"."SubscriptionType" AS ENUM ('FREE', 'MONTHLY', 'YEARLY');

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "subscriptionType" "public"."SubscriptionType" NOT NULL DEFAULT 'FREE';

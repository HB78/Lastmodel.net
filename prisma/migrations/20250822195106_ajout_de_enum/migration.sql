-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'USER';

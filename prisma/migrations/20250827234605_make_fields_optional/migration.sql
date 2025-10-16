-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_originId_fkey";

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "age" DROP NOT NULL,
ALTER COLUMN "age" DROP DEFAULT,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "description" DROP DEFAULT,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "city" DROP DEFAULT,
ALTER COLUMN "originId" DROP NOT NULL,
ALTER COLUMN "originId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_originId_fkey" FOREIGN KEY ("originId") REFERENCES "public"."origins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

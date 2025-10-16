/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "sex" TEXT NOT NULL DEFAULT 'femme';

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "public"."users"("phone");

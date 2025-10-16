/*
  Warnings:

  - You are about to drop the column `userId` on the `commentaires` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `commentaires` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `commentaires` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."commentaires" DROP CONSTRAINT "commentaires_userId_fkey";

-- AlterTable
ALTER TABLE "public"."commentaires" DROP COLUMN "userId",
ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "profileId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."commentaires" ADD CONSTRAINT "commentaires_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."commentaires" ADD CONSTRAINT "commentaires_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

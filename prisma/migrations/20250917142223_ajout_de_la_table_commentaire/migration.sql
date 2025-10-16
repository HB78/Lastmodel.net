-- CreateTable
CREATE TABLE "public"."commentaires" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commentaires_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."commentaires" ADD CONSTRAINT "commentaires_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

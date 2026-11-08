-- CreateTable
CREATE TABLE "public"."profile_views" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "viewerKey" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "profile_views_profileId_day_idx" ON "public"."profile_views"("profileId", "day");

-- CreateIndex
CREATE UNIQUE INDEX "profile_views_profileId_viewerKey_day_key" ON "public"."profile_views"("profileId", "viewerKey", "day");

-- AddForeignKey
ALTER TABLE "public"."profile_views" ADD CONSTRAINT "profile_views_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "reach_ads" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "business_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "cta_text" TEXT,
    "cta_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "ad_type" TEXT NOT NULL DEFAULT 'image',
    "image_url" TEXT,
    "image_key" TEXT,
    "start_at" DATETIME,
    "end_at" DATETIME,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "is_prime_time_enabled" BOOLEAN NOT NULL DEFAULT false,
    "created_by" TEXT,
    "updated_by" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "reach_ad_placement_rules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reach_ad_id" TEXT NOT NULL,
    "placement_type" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "max_impressions_per_session" INTEGER,
    "cooldown_minutes" INTEGER,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "reach_ad_placement_rules_reach_ad_id_fkey" FOREIGN KEY ("reach_ad_id") REFERENCES "reach_ads" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

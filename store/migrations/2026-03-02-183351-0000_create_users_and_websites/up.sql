-- Your SQL goes here

-- Create Enum
CREATE TYPE "website_status" AS ENUM ('UP', 'DOWN', 'UNKNOWN');

-- Create Website Table
CREATE TABLE "website" (
    "id" TEXT PRIMARY KEY,
    "url" TEXT NOT NULL,
    "time_added" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Region Table
CREATE TABLE "region" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- Create Website Tick Table
CREATE TABLE "website_tick" (
    "id" TEXT PRIMARY KEY,
    "response_time_ms" INTEGER NOT NULL,
    "status" "website_status" NOT NULL,
    "website_id" TEXT NOT NULL,
    "region_id" TEXT NOT NULL,

    CONSTRAINT "webiste_tick_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "region" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "webiste_tick_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "website" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
-- Your SQL goes here

-- Alter table website
ALTER TABLE "website" ADD COLUMN "user_id" TEXT NOT NULL;

-- Alter table website_tick
ALTER TABLE "website_tick" ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Create User Table
CREATE TABLE "user" (
    "id" TEXT PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- Add Foreign Key Constraint
ALTER TABLE "website" ADD CONSTRAINT "website_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
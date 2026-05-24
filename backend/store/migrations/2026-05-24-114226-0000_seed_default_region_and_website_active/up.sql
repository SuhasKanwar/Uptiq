INSERT INTO "region" ("id", "name")
VALUES ('reg_default', 'Default (Local)')
ON CONFLICT ("id") DO NOTHING;

ALTER TABLE "website" ADD COLUMN IF NOT EXISTS "is_active" BOOLEAN NOT NULL DEFAULT TRUE;
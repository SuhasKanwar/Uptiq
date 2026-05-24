DELETE FROM "region" WHERE "id" = 'reg_default';
ALTER TABLE "website" DROP COLUMN IF EXISTS "is_active";
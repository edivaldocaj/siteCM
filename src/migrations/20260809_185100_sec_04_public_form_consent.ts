import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      IF to_regclass('public.leads') IS NOT NULL THEN
        ALTER TABLE "leads"
          ADD COLUMN IF NOT EXISTS "consent_text" varchar,
          ADD COLUMN IF NOT EXISTS "consented_at" timestamp(3) with time zone,
          ADD COLUMN IF NOT EXISTS "ip" varchar,
          ADD COLUMN IF NOT EXISTS "user_agent" varchar;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      IF to_regclass('public.nps_responses') IS NOT NULL THEN
        ALTER TABLE "nps_responses"
          ADD COLUMN IF NOT EXISTS "consent_text" varchar,
          ADD COLUMN IF NOT EXISTS "consented_at" timestamp(3) with time zone,
          ADD COLUMN IF NOT EXISTS "ip" varchar,
          ADD COLUMN IF NOT EXISTS "user_agent" varchar;
      END IF;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      IF to_regclass('public.leads') IS NOT NULL THEN
        ALTER TABLE "leads"
          DROP COLUMN IF EXISTS "consent_text",
          DROP COLUMN IF EXISTS "consented_at",
          DROP COLUMN IF EXISTS "ip",
          DROP COLUMN IF EXISTS "user_agent";
      END IF;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      IF to_regclass('public.nps_responses') IS NOT NULL THEN
        ALTER TABLE "nps_responses"
          DROP COLUMN IF EXISTS "consent_text",
          DROP COLUMN IF EXISTS "consented_at",
          DROP COLUMN IF EXISTS "ip",
          DROP COLUMN IF EXISTS "user_agent";
      END IF;
    END $$;
  `)
}

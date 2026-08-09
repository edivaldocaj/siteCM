import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "leads"
      ADD COLUMN IF NOT EXISTS "consent_text" varchar,
      ADD COLUMN IF NOT EXISTS "consented_at" timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "ip" varchar,
      ADD COLUMN IF NOT EXISTS "user_agent" varchar;

    ALTER TABLE "nps_responses"
      ADD COLUMN IF NOT EXISTS "consent_text" varchar,
      ADD COLUMN IF NOT EXISTS "consented_at" timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "ip" varchar,
      ADD COLUMN IF NOT EXISTS "user_agent" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "leads"
      DROP COLUMN IF EXISTS "consent_text",
      DROP COLUMN IF EXISTS "consented_at",
      DROP COLUMN IF EXISTS "ip",
      DROP COLUMN IF EXISTS "user_agent";

    ALTER TABLE "nps_responses"
      DROP COLUMN IF EXISTS "consent_text",
      DROP COLUMN IF EXISTS "consented_at",
      DROP COLUMN IF EXISTS "ip",
      DROP COLUMN IF EXISTS "user_agent";
  `)
}

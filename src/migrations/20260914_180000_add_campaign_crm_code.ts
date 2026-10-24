import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "campaign_code" varchar;
    CREATE INDEX IF NOT EXISTS "campaigns_campaign_code_idx" ON "campaigns" USING btree ("campaign_code");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "campaigns_campaign_code_idx";
    ALTER TABLE "campaigns" DROP COLUMN IF EXISTS "campaign_code";
  `)
}

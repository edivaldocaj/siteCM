import { sql, type MigrateUpArgs } from '@payloadcms/db-postgres'

// The admin already exposes these values. Older databases only contain the
// original five categories and reject saves with PostgreSQL error 22P02.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "campaign_category_backup_20260908" AS
      SELECT "id", "category"::text AS "category", "updated_at" FROM "campaigns";
    ALTER TYPE "public"."enum_campaigns_category" ADD VALUE IF NOT EXISTS 'licitacoes';
    ALTER TYPE "public"."enum_campaigns_category" ADD VALUE IF NOT EXISTS 'civil';
    ALTER TYPE "public"."enum_campaigns_category" ADD VALUE IF NOT EXISTS 'penal';
  `)
}

export async function down(): Promise<void> {
  throw new Error('Category values may be in use. Review campaign_category_backup_20260908 and current records before a manual rollback.')
}

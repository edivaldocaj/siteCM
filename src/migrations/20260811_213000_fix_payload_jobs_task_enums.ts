import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TYPE "public"."enum_payload_jobs_task_slug" ADD VALUE IF NOT EXISTS 'sync-news-feed';`)
  await db.execute(sql`ALTER TYPE "public"."enum_payload_jobs_task_slug" ADD VALUE IF NOT EXISTS 'send-deadline-alerts';`)
  await db.execute(sql`ALTER TYPE "public"."enum_payload_jobs_log_task_slug" ADD VALUE IF NOT EXISTS 'sync-news-feed';`)
  await db.execute(sql`ALTER TYPE "public"."enum_payload_jobs_log_task_slug" ADD VALUE IF NOT EXISTS 'send-deadline-alerts';`)
  await db.execute(sql`ALTER TYPE "public"."enum_payload_jobs_log_parent_task_slug" ADD VALUE IF NOT EXISTS 'sync-news-feed';`)
  await db.execute(sql`ALTER TYPE "public"."enum_payload_jobs_log_parent_task_slug" ADD VALUE IF NOT EXISTS 'send-deadline-alerts';`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- PostgreSQL does not support dropping enum values safely.
  `)
}

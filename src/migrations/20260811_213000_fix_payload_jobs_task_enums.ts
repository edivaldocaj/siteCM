import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_payload_jobs_task_slug') THEN
        ALTER TYPE "public"."enum_payload_jobs_task_slug" ADD VALUE IF NOT EXISTS 'sync-news-feed';
        ALTER TYPE "public"."enum_payload_jobs_task_slug" ADD VALUE IF NOT EXISTS 'send-deadline-alerts';
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_payload_jobs_log_task_slug') THEN
        ALTER TYPE "public"."enum_payload_jobs_log_task_slug" ADD VALUE IF NOT EXISTS 'sync-news-feed';
        ALTER TYPE "public"."enum_payload_jobs_log_task_slug" ADD VALUE IF NOT EXISTS 'send-deadline-alerts';
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_payload_jobs_log_parent_task_slug') THEN
        ALTER TYPE "public"."enum_payload_jobs_log_parent_task_slug" ADD VALUE IF NOT EXISTS 'sync-news-feed';
        ALTER TYPE "public"."enum_payload_jobs_log_parent_task_slug" ADD VALUE IF NOT EXISTS 'send-deadline-alerts';
      END IF;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- PostgreSQL does not support dropping enum values safely.
  `)
}

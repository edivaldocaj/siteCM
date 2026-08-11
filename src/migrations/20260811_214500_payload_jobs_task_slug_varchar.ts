import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'payload_jobs'
          AND column_name = 'task_slug'
      ) THEN
        ALTER TABLE "payload_jobs" ALTER COLUMN "task_slug" TYPE varchar USING "task_slug"::text;
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'payload_jobs_log'
          AND column_name = 'task_slug'
      ) THEN
        ALTER TABLE "payload_jobs_log" ALTER COLUMN "task_slug" TYPE varchar USING "task_slug"::text;
      END IF;
    END $$;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'payload_jobs_log'
          AND column_name = 'parent_task_slug'
      ) THEN
        ALTER TABLE "payload_jobs_log" ALTER COLUMN "parent_task_slug" TYPE varchar USING "parent_task_slug"::text;
      END IF;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- No-op: restoring enum-backed task slugs can break existing queued jobs.
  `)
}

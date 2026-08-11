import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'sync-news-feed', 'send-deadline-alerts');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_payload_jobs_log_parent_task_slug" AS ENUM('inline', 'sync-news-feed', 'send-deadline-alerts');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'sync-news-feed', 'send-deadline-alerts');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    CREATE TABLE IF NOT EXISTS "payload_kv" (
      "id" serial PRIMARY KEY NOT NULL,
      "key" varchar NOT NULL,
      "data" jsonb NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "payload_jobs" (
      "id" serial PRIMARY KEY NOT NULL,
      "input" jsonb,
      "completed_at" timestamp(3) with time zone,
      "total_tried" numeric DEFAULT 0,
      "has_error" boolean DEFAULT false,
      "error" jsonb,
      "task_slug" "public"."enum_payload_jobs_task_slug",
      "queue" varchar DEFAULT 'default',
      "wait_until" timestamp(3) with time zone,
      "processing" boolean DEFAULT false,
      "meta" jsonb,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "payload_jobs_log" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "executed_at" timestamp(3) with time zone NOT NULL,
      "completed_at" timestamp(3) with time zone NOT NULL,
      "task_slug" "public"."enum_payload_jobs_log_task_slug" NOT NULL,
      "task_i_d" varchar NOT NULL,
      "input" jsonb,
      "output" jsonb,
      "state" "public"."enum_payload_jobs_log_state" NOT NULL,
      "error" jsonb,
      "parent_task_slug" "public"."enum_payload_jobs_log_parent_task_slug",
      "parent_task_i_d" varchar
    );

    CREATE TABLE IF NOT EXISTS "payload_jobs_stats" (
      "id" serial PRIMARY KEY NOT NULL,
      "stats" jsonb,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    DO $$ BEGIN
      ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    CREATE UNIQUE INDEX IF NOT EXISTS "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
    CREATE INDEX IF NOT EXISTS "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
    CREATE INDEX IF NOT EXISTS "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
    CREATE INDEX IF NOT EXISTS "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
    CREATE INDEX IF NOT EXISTS "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
    CREATE INDEX IF NOT EXISTS "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
    CREATE INDEX IF NOT EXISTS "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
    CREATE INDEX IF NOT EXISTS "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
    CREATE INDEX IF NOT EXISTS "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_jobs_log" DROP CONSTRAINT IF EXISTS "payload_jobs_log_parent_id_fk";

    DROP INDEX IF EXISTS "payload_jobs_created_at_idx";
    DROP INDEX IF EXISTS "payload_jobs_updated_at_idx";
    DROP INDEX IF EXISTS "payload_jobs_processing_idx";
    DROP INDEX IF EXISTS "payload_jobs_wait_until_idx";
    DROP INDEX IF EXISTS "payload_jobs_queue_idx";
    DROP INDEX IF EXISTS "payload_jobs_task_slug_idx";
    DROP INDEX IF EXISTS "payload_jobs_has_error_idx";
    DROP INDEX IF EXISTS "payload_jobs_total_tried_idx";
    DROP INDEX IF EXISTS "payload_jobs_completed_at_idx";
    DROP INDEX IF EXISTS "payload_jobs_log_parent_id_idx";
    DROP INDEX IF EXISTS "payload_jobs_log_order_idx";
    DROP INDEX IF EXISTS "payload_kv_key_idx";

    DROP TABLE IF EXISTS "payload_jobs_stats" CASCADE;
    DROP TABLE IF EXISTS "payload_jobs_log" CASCADE;
    DROP TABLE IF EXISTS "payload_jobs" CASCADE;
    DROP TABLE IF EXISTS "payload_kv" CASCADE;

    DROP TYPE IF EXISTS "public"."enum_payload_jobs_task_slug";
    DROP TYPE IF EXISTS "public"."enum_payload_jobs_log_parent_task_slug";
    DROP TYPE IF EXISTS "public"."enum_payload_jobs_log_state";
    DROP TYPE IF EXISTS "public"."enum_payload_jobs_log_task_slug";
  `)
}


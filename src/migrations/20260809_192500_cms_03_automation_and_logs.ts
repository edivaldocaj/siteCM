import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "automation_config" (
      "id" serial PRIMARY KEY NOT NULL,
      "news_enabled" boolean DEFAULT false,
      "news_interval_hours" numeric DEFAULT 4,
      "news_auto_publish_score" numeric DEFAULT 85,
      "news_retention_days" numeric DEFAULT 90,
      "lead_auto_reply" boolean DEFAULT false,
      "lead_auto_reply_template" varchar,
      "lead_sla_hours" numeric DEFAULT 4,
      "lead_escalation_email" varchar DEFAULT '__PENDENTE__',
      "deadline_alerts_enabled" boolean DEFAULT false,
      "deadline_alert_hour" numeric DEFAULT 8,
      "datajud_sync_enabled" boolean DEFAULT false,
      "datajud_sync_hour" numeric DEFAULT 7,
      "nps_trigger_days" numeric DEFAULT 30,
      "nps_auto_testimonial" boolean DEFAULT false,
      "social_auto_generate" boolean DEFAULT false,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "automation_config_news_sources" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "url" varchar NOT NULL,
      "enabled" boolean DEFAULT true
    );

    CREATE TABLE IF NOT EXISTS "automation_config_deadline_alert_days" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "days" numeric NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "faqs" (
      "id" serial PRIMARY KEY NOT NULL,
      "question" varchar NOT NULL,
      "answer" jsonb NOT NULL,
      "area_id" integer,
      "order" numeric DEFAULT 0,
      "active" boolean DEFAULT true,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "automation_runs" (
      "id" serial PRIMARY KEY NOT NULL,
      "task" varchar NOT NULL,
      "status" varchar DEFAULT 'pending' NOT NULL,
      "started_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "finished_at" timestamp(3) with time zone,
      "items_in" numeric DEFAULT 0,
      "items_out" numeric DEFAULT 0,
      "error_message" varchar,
      "payload" jsonb,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "audit_log" (
      "id" serial PRIMARY KEY NOT NULL,
      "action" varchar NOT NULL,
      "collection_slug" varchar,
      "document_id" varchar,
      "user_id" integer,
      "before" jsonb,
      "after" jsonb,
      "metadata" jsonb,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "automation_config_news_sources" ADD CONSTRAINT "automation_config_news_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."automation_config"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "automation_config_deadline_alert_days" ADD CONSTRAINT "automation_config_deadline_alert_days_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."automation_config"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "faqs" ADD CONSTRAINT "faqs_area_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."practice_areas"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "automation_config_news_sources_order_idx" ON "automation_config_news_sources" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "automation_config_news_sources_parent_id_idx" ON "automation_config_news_sources" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "automation_config_deadline_alert_days_order_idx" ON "automation_config_deadline_alert_days" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "automation_config_deadline_alert_days_parent_id_idx" ON "automation_config_deadline_alert_days" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "automation_config_updated_at_idx" ON "automation_config" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "automation_config_created_at_idx" ON "automation_config" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "faqs_area_idx" ON "faqs" USING btree ("area_id");
    CREATE INDEX IF NOT EXISTS "faqs_active_idx" ON "faqs" USING btree ("active");
    CREATE INDEX IF NOT EXISTS "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "automation_runs_task_idx" ON "automation_runs" USING btree ("task");
    CREATE INDEX IF NOT EXISTS "automation_runs_status_idx" ON "automation_runs" USING btree ("status");
    CREATE INDEX IF NOT EXISTS "automation_runs_started_at_idx" ON "automation_runs" USING btree ("started_at");
    CREATE INDEX IF NOT EXISTS "automation_runs_updated_at_idx" ON "automation_runs" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "automation_runs_created_at_idx" ON "automation_runs" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "audit_log_action_idx" ON "audit_log" USING btree ("action");
    CREATE INDEX IF NOT EXISTS "audit_log_collection_slug_idx" ON "audit_log" USING btree ("collection_slug");
    CREATE INDEX IF NOT EXISTS "audit_log_document_id_idx" ON "audit_log" USING btree ("document_id");
    CREATE INDEX IF NOT EXISTS "audit_log_user_idx" ON "audit_log" USING btree ("user_id");
    CREATE INDEX IF NOT EXISTS "audit_log_updated_at_idx" ON "audit_log" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "audit_log_created_at_idx" ON "audit_log" USING btree ("created_at");

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "automation_config_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "faqs_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "automation_runs_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "audit_log_id" integer;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_automation_config_fk" FOREIGN KEY ("automation_config_id") REFERENCES "public"."automation_config"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_automation_runs_fk" FOREIGN KEY ("automation_runs_id") REFERENCES "public"."automation_runs"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audit_log_fk" FOREIGN KEY ("audit_log_id") REFERENCES "public"."audit_log"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_automation_config_id_idx" ON "payload_locked_documents_rels" USING btree ("automation_config_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_automation_runs_id_idx" ON "payload_locked_documents_rels" USING btree ("automation_runs_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_audit_log_id_idx" ON "payload_locked_documents_rels" USING btree ("audit_log_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_automation_config_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_faqs_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_automation_runs_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_audit_log_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_automation_config_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_faqs_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_automation_runs_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_audit_log_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "automation_config_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "faqs_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "automation_runs_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "audit_log_id";

    DROP TABLE IF EXISTS "audit_log" CASCADE;
    DROP TABLE IF EXISTS "automation_runs" CASCADE;
    DROP TABLE IF EXISTS "faqs" CASCADE;
    DROP TABLE IF EXISTS "automation_config_deadline_alert_days" CASCADE;
    DROP TABLE IF EXISTS "automation_config_news_sources" CASCADE;
    DROP TABLE IF EXISTS "automation_config" CASCADE;
  `)
}
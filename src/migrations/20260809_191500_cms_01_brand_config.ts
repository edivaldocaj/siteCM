import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "brand_config" (
      "id" serial PRIMARY KEY NOT NULL,
      "trade_name" varchar DEFAULT 'Cavalcante Albuquerque',
      "descriptor" varchar DEFAULT 'Advocacia e Consultoria',
      "legal_name" varchar DEFAULT '__PENDENTE__',
      "cnpj" varchar DEFAULT '__PENDENTE__',
      "oab_registration" varchar DEFAULT '__PENDENTE__',
      "founder_name" varchar DEFAULT '__PENDENTE__',
      "founded_year" varchar DEFAULT '__PENDENTE__',
      "tagline" varchar DEFAULT 'Advocacia com estrategia e solidez.',
      "domain" varchar DEFAULT 'cavalcantealbuquerque.com.br',
      "email" varchar DEFAULT '__PENDENTE__',
      "phone" varchar DEFAULT '__PENDENTE__',
      "whatsapp" varchar DEFAULT '__PENDENTE__',
      "whatsapp_default_message" varchar DEFAULT 'Ola, gostaria de atendimento juridico.',
      "address_street" varchar DEFAULT '__PENDENTE__',
      "address_district" varchar DEFAULT '__PENDENTE__',
      "address_city" varchar DEFAULT 'Natal',
      "address_state" varchar DEFAULT 'RN',
      "address_zip" varchar DEFAULT '__PENDENTE__',
      "latitude" numeric,
      "longitude" numeric,
      "emergency_line" varchar DEFAULT '__PENDENTE__',
      "emergency_label" varchar DEFAULT 'Plantao criminal 24h',
      "instagram" varchar,
      "linkedin" varchar,
      "facebook" varchar,
      "youtube" varchar,
      "google_business" varchar,
      "privacy_policy" jsonb,
      "terms_of_use" jsonb,
      "cookie_policy" jsonb,
      "dpo_name" varchar DEFAULT '__PENDENTE__',
      "dpo_email" varchar DEFAULT '__PENDENTE__',
      "oab_disclaimer" varchar DEFAULT 'Informacoes de carater exclusivamente informativo, sem promessa de resultado e conforme o Codigo de Etica e Disciplina da OAB.',
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "brand_config_business_hours" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "day" varchar NOT NULL,
      "opens_at" varchar,
      "closes_at" varchar
    );

    CREATE TABLE IF NOT EXISTS "brand_config_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "media_id" integer
    );

    DO $$ BEGIN
      ALTER TABLE "brand_config_business_hours" ADD CONSTRAINT "brand_config_business_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brand_config"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "brand_config_rels" ADD CONSTRAINT "brand_config_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."brand_config"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "brand_config_rels" ADD CONSTRAINT "brand_config_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "brand_config_business_hours_order_idx" ON "brand_config_business_hours" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "brand_config_business_hours_parent_id_idx" ON "brand_config_business_hours" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "brand_config_rels_order_idx" ON "brand_config_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "brand_config_rels_parent_idx" ON "brand_config_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "brand_config_rels_path_idx" ON "brand_config_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "brand_config_rels_media_id_idx" ON "brand_config_rels" USING btree ("media_id");
    CREATE INDEX IF NOT EXISTS "brand_config_updated_at_idx" ON "brand_config" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "brand_config_created_at_idx" ON "brand_config" USING btree ("created_at");

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "brand_config_id" integer;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_brand_config_fk" FOREIGN KEY ("brand_config_id") REFERENCES "public"."brand_config"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_brand_config_id_idx" ON "payload_locked_documents_rels" USING btree ("brand_config_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_brand_config_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_brand_config_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "brand_config_id";

    DROP TABLE IF EXISTS "brand_config_rels" CASCADE;
    DROP TABLE IF EXISTS "brand_config_business_hours" CASCADE;
    DROP TABLE IF EXISTS "brand_config" CASCADE;
  `)
}
import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "navigation" (
      "id" serial PRIMARY KEY NOT NULL,
      "cta_label" varchar DEFAULT 'Fale com um advogado',
      "cta_href" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "navigation_header_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "href" varchar NOT NULL,
      "highlight" boolean DEFAULT false
    );

    CREATE TABLE IF NOT EXISTS "navigation_footer_columns" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "navigation_footer_columns_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "href" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "navigation_legal_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "href" varchar NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "navigation_header_links" ADD CONSTRAINT "navigation_header_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "navigation_footer_columns" ADD CONSTRAINT "navigation_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "navigation_footer_columns_links" ADD CONSTRAINT "navigation_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "navigation_legal_links" ADD CONSTRAINT "navigation_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "navigation_header_links_order_idx" ON "navigation_header_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "navigation_header_links_parent_id_idx" ON "navigation_header_links" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "navigation_footer_columns_order_idx" ON "navigation_footer_columns" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "navigation_footer_columns_parent_id_idx" ON "navigation_footer_columns" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "navigation_footer_columns_links_order_idx" ON "navigation_footer_columns_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "navigation_footer_columns_links_parent_id_idx" ON "navigation_footer_columns_links" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "navigation_legal_links_order_idx" ON "navigation_legal_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "navigation_legal_links_parent_id_idx" ON "navigation_legal_links" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "navigation_updated_at_idx" ON "navigation" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "navigation_created_at_idx" ON "navigation" USING btree ("created_at");

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "navigation_id" integer;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_navigation_fk" FOREIGN KEY ("navigation_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_navigation_id_idx" ON "payload_locked_documents_rels" USING btree ("navigation_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_navigation_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_navigation_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "navigation_id";

    DROP TABLE IF EXISTS "navigation_legal_links" CASCADE;
    DROP TABLE IF EXISTS "navigation_footer_columns_links" CASCADE;
    DROP TABLE IF EXISTS "navigation_footer_columns" CASCADE;
    DROP TABLE IF EXISTS "navigation_header_links" CASCADE;
    DROP TABLE IF EXISTS "navigation" CASCADE;
  `)
}
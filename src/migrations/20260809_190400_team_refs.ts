import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "team" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "short_name" varchar,
      "slug" varchar NOT NULL,
      "role" varchar NOT NULL,
      "oab" varchar,
      "email" varchar,
      "whatsapp" varchar,
      "bio" jsonb,
      "photo_id" integer,
      "linkedin" varchar,
      "lattes" varchar,
      "order" numeric DEFAULT 0,
      "active" boolean DEFAULT true,
      "show_on_site" boolean DEFAULT true,
      "former_member" boolean DEFAULT false,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "team_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "practice_areas_id" integer
    );

    DO $$ BEGIN
      ALTER TABLE "team" ADD CONSTRAINT "team_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "team_rels" ADD CONSTRAINT "team_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "team_rels" ADD CONSTRAINT "team_rels_practice_areas_fk" FOREIGN KEY ("practice_areas_id") REFERENCES "public"."practice_areas"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    ALTER TABLE "posts"
      ADD COLUMN IF NOT EXISTS "author_ref_id" integer,
      ADD COLUMN IF NOT EXISTS "by_firm" boolean DEFAULT false;

    ALTER TABLE "leads"
      ADD COLUMN IF NOT EXISTS "assigned_to_ref_id" integer,
      ADD COLUMN IF NOT EXISTS "by_firm" boolean DEFAULT false;

    ALTER TABLE "practice_areas"
      ADD COLUMN IF NOT EXISTS "responsible_ref_id" integer,
      ADD COLUMN IF NOT EXISTS "by_firm" boolean DEFAULT false;

    ALTER TABLE "clients_processes"
      ADD COLUMN IF NOT EXISTS "attorney_ref_id" integer;

    ALTER TABLE "deadlines"
      ADD COLUMN IF NOT EXISTS "attorney_ref_id" integer;

    ALTER TABLE "nps_responses"
      ADD COLUMN IF NOT EXISTS "attorney_ref_id" integer;

    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "team_id" integer;

    DO $$ BEGIN
      ALTER TABLE "posts" ADD CONSTRAINT "posts_author_ref_id_team_id_fk" FOREIGN KEY ("author_ref_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_to_ref_id_team_id_fk" FOREIGN KEY ("assigned_to_ref_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "practice_areas" ADD CONSTRAINT "practice_areas_responsible_ref_id_team_id_fk" FOREIGN KEY ("responsible_ref_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "clients_processes" ADD CONSTRAINT "clients_processes_attorney_ref_id_team_id_fk" FOREIGN KEY ("attorney_ref_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "deadlines" ADD CONSTRAINT "deadlines_attorney_ref_id_team_id_fk" FOREIGN KEY ("attorney_ref_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "nps_responses" ADD CONSTRAINT "nps_responses_attorney_ref_id_team_id_fk" FOREIGN KEY ("attorney_ref_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE UNIQUE INDEX IF NOT EXISTS "team_slug_idx" ON "team" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "team_photo_idx" ON "team" USING btree ("photo_id");
    CREATE INDEX IF NOT EXISTS "team_active_idx" ON "team" USING btree ("active");
    CREATE INDEX IF NOT EXISTS "team_updated_at_idx" ON "team" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "team_created_at_idx" ON "team" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "team_rels_order_idx" ON "team_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "team_rels_parent_idx" ON "team_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "team_rels_path_idx" ON "team_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "team_rels_practice_areas_id_idx" ON "team_rels" USING btree ("practice_areas_id");
    CREATE INDEX IF NOT EXISTS "posts_author_ref_idx" ON "posts" USING btree ("author_ref_id");
    CREATE INDEX IF NOT EXISTS "leads_assigned_to_ref_idx" ON "leads" USING btree ("assigned_to_ref_id");
    CREATE INDEX IF NOT EXISTS "practice_areas_responsible_ref_idx" ON "practice_areas" USING btree ("responsible_ref_id");
    CREATE INDEX IF NOT EXISTS "clients_processes_attorney_ref_idx" ON "clients_processes" USING btree ("attorney_ref_id");
    CREATE INDEX IF NOT EXISTS "deadlines_attorney_ref_idx" ON "deadlines" USING btree ("attorney_ref_id");
    CREATE INDEX IF NOT EXISTS "nps_responses_attorney_ref_idx" ON "nps_responses" USING btree ("attorney_ref_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_team_id_idx" ON "payload_locked_documents_rels" USING btree ("team_id");

    INSERT INTO "team" ("name", "short_name", "slug", "role", "oab", "order", "active", "show_on_site", "former_member")
    VALUES ('Dr. Edivaldo Cavalcante Albuquerque', 'Dr. Edivaldo', 'edivaldo-cavalcante-albuquerque', 'Advogado Titular', '__PENDENTE__', 0, true, true, false)
    ON CONFLICT ("slug") DO UPDATE SET
      "name" = EXCLUDED."name",
      "short_name" = EXCLUDED."short_name",
      "role" = EXCLUDED."role",
      "active" = EXCLUDED."active",
      "show_on_site" = EXCLUDED."show_on_site",
      "former_member" = EXCLUDED."former_member",
      "updated_at" = now();

    INSERT INTO "team" ("name", "short_name", "slug", "role", "order", "active", "show_on_site", "former_member")
    VALUES ('Dra. Gabrielly Melo', 'Dra. Gabrielly', 'gabrielly-melo', 'Ex-integrante', 1, false, false, true)
    ON CONFLICT ("slug") DO UPDATE SET
      "name" = EXCLUDED."name",
      "short_name" = EXCLUDED."short_name",
      "role" = EXCLUDED."role",
      "active" = EXCLUDED."active",
      "show_on_site" = EXCLUDED."show_on_site",
      "former_member" = EXCLUDED."former_member",
      "updated_at" = now();
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "team_id";
    ALTER TABLE "nps_responses" DROP COLUMN IF EXISTS "attorney_ref_id";
    ALTER TABLE "deadlines" DROP COLUMN IF EXISTS "attorney_ref_id";
    ALTER TABLE "clients_processes" DROP COLUMN IF EXISTS "attorney_ref_id";
    ALTER TABLE "practice_areas" DROP COLUMN IF EXISTS "responsible_ref_id", DROP COLUMN IF EXISTS "by_firm";
    ALTER TABLE "leads" DROP COLUMN IF EXISTS "assigned_to_ref_id", DROP COLUMN IF EXISTS "by_firm";
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "author_ref_id", DROP COLUMN IF EXISTS "by_firm";
    DROP TABLE IF EXISTS "team_rels" CASCADE;
    DROP TABLE IF EXISTS "team" CASCADE;
  `)
}

import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor', 'staff', 'client');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "users_roles" (
      "order" integer NOT NULL,
      "parent_id" integer NOT NULL,
      "value" "public"."enum_users_roles",
      "id" serial PRIMARY KEY NOT NULL
    );
  `)

  await db.execute(sql`
    DO $$ BEGIN
      IF to_regclass('public.users') IS NOT NULL
        AND to_regclass('public.users_roles') IS NOT NULL
        AND NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'users_roles_parent_id_users_id_fk'
        )
      THEN
        ALTER TABLE "users_roles"
          ADD CONSTRAINT "users_roles_parent_id_users_id_fk"
          FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
  `)

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "users_roles_order_idx" ON "users_roles" USING btree ("order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");`)

  await db.execute(sql`
    DO $$ BEGIN
      IF to_regclass('public.users') IS NOT NULL
        AND to_regclass('public.users_roles') IS NOT NULL
      THEN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'users'
            AND column_name = 'role'
        )
        THEN
          INSERT INTO "users_roles" ("order", "parent_id", "value")
          SELECT 1, "id", COALESCE("role"::text, 'client')::"public"."enum_users_roles"
          FROM "users"
          WHERE NOT EXISTS (
            SELECT 1 FROM "users_roles" WHERE "users_roles"."parent_id" = "users"."id"
          );
        ELSE
          INSERT INTO "users_roles" ("order", "parent_id", "value")
          SELECT 1, "id", 'client'::"public"."enum_users_roles"
          FROM "users"
          WHERE NOT EXISTS (
            SELECT 1 FROM "users_roles" WHERE "users_roles"."parent_id" = "users"."id"
          );
        END IF;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      IF to_regclass('public.testimonials') IS NOT NULL THEN
        ALTER TABLE "testimonials"
          ADD COLUMN IF NOT EXISTS "approved" boolean DEFAULT false;
      END IF;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "testimonials" DROP COLUMN IF EXISTS "approved";`)
  await db.execute(sql`DROP TABLE IF EXISTS "users_roles" CASCADE;`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_users_roles";`)
}

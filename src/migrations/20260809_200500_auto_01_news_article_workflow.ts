import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "source_hash" varchar;
    ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "relevance_score" numeric;
    ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "ai_summary" varchar;
    ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "editorial_notes" varchar;
    ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "expires_at" timestamp(3) with time zone;

    CREATE UNIQUE INDEX IF NOT EXISTS "news_articles_source_hash_idx" ON "news_articles" USING btree ("source_hash");
    CREATE INDEX IF NOT EXISTS "news_articles_relevance_score_idx" ON "news_articles" USING btree ("relevance_score");
    CREATE INDEX IF NOT EXISTS "news_articles_expires_at_idx" ON "news_articles" USING btree ("expires_at");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "news_articles_expires_at_idx";
    DROP INDEX IF EXISTS "news_articles_relevance_score_idx";
    DROP INDEX IF EXISTS "news_articles_source_hash_idx";

    ALTER TABLE "news_articles" DROP COLUMN IF EXISTS "expires_at";
    ALTER TABLE "news_articles" DROP COLUMN IF EXISTS "editorial_notes";
    ALTER TABLE "news_articles" DROP COLUMN IF EXISTS "ai_summary";
    ALTER TABLE "news_articles" DROP COLUMN IF EXISTS "relevance_score";
    ALTER TABLE "news_articles" DROP COLUMN IF EXISTS "source_hash";
  `)
}

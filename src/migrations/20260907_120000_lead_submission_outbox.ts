import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_lead_submissions_escritorio" AS ENUM('CA');
    CREATE TYPE "public"."enum_lead_submissions_origem" AS ENUM('landing', 'contato');
    CREATE TYPE "public"."enum_lead_submissions_status" AS ENUM('pendente', 'entregue', 'rejeitada', 'falha');
    CREATE TABLE "lead_submissions_respostas" (
      "_order" integer NOT NULL, "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL, "pergunta" varchar NOT NULL, "resposta" varchar NOT NULL
    );
    CREATE TABLE "lead_submissions" (
      "id" serial PRIMARY KEY NOT NULL,
      "idempotencia" varchar NOT NULL, "enviado_em" timestamp(3) with time zone NOT NULL,
      "escritorio" "enum_lead_submissions_escritorio" NOT NULL, "telefone" varchar NOT NULL,
      "nome" varchar NOT NULL, "email" varchar, "campanha" varchar,
      "origem" "enum_lead_submissions_origem" NOT NULL,
      "utm_source" varchar, "utm_medium" varchar, "utm_campaign" varchar, "utm_content" varchar, "utm_term" varchar,
      "referrer" varchar, "consent_aceito" boolean DEFAULT false NOT NULL,
      "consent_versao" varchar NOT NULL, "consent_em" timestamp(3) with time zone NOT NULL,
      "consent_ip" varchar, "status" "enum_lead_submissions_status" DEFAULT 'pendente' NOT NULL,
      "tentativas" numeric DEFAULT 0, "ultimo_erro" varchar, "lead_id_crm" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "lead_submissions_id" integer;
    ALTER TABLE "lead_submissions_respostas" ADD CONSTRAINT "lead_submissions_respostas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lead_submissions"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lead_submissions_fk" FOREIGN KEY ("lead_submissions_id") REFERENCES "public"."lead_submissions"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "lead_submissions_respostas_order_idx" ON "lead_submissions_respostas" USING btree ("_order");
    CREATE INDEX "lead_submissions_respostas_parent_id_idx" ON "lead_submissions_respostas" USING btree ("_parent_id");
    CREATE UNIQUE INDEX "lead_submissions_idempotencia_idx" ON "lead_submissions" USING btree ("idempotencia");
    CREATE INDEX "lead_submissions_updated_at_idx" ON "lead_submissions" USING btree ("updated_at");
    CREATE INDEX "lead_submissions_created_at_idx" ON "lead_submissions" USING btree ("created_at");
    CREATE INDEX "payload_locked_documents_rels_lead_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("lead_submissions_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_lead_submissions_fk";
    DROP INDEX "payload_locked_documents_rels_lead_submissions_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "lead_submissions_id";
    DROP TABLE "lead_submissions_respostas" CASCADE;
    DROP TABLE "lead_submissions" CASCADE;
    DROP TYPE "public"."enum_lead_submissions_escritorio";
    DROP TYPE "public"."enum_lead_submissions_origem";
    DROP TYPE "public"."enum_lead_submissions_status";
  `)
}

import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Confirmed against the existing CA CRM records on 2026-10-24.
// Preserve explicit CMS configuration and never activate a CRM campaign here.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "campaigns" AS campaign
    SET "campaign_code" = mapping.code
    FROM (VALUES
      ('recursos-licitacoes', 'LIC-RECURSOS'),
      ('contratos-empresariais', 'CIV-CONTRATOS'),
      ('regularizacao-imoveis', 'CIV-REGULARIZACAO-IMOVEIS'),
      ('lgpd-pequenos-negocios', 'DIG-LGPD-NEGOCIOS'),
      ('plantao-criminal-24h', 'PENAL-24H'),
      ('negativacao-indevida', 'CONS-NEGATIVACAO'),
      ('fraudes-bancarias', 'DIG-FRAUDES-BANCARIAS')
    ) AS mapping(slug, code)
    WHERE campaign.slug = mapping.slug
      AND NULLIF(BTRIM(campaign.campaign_code), '') IS NULL;
  `)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Preserve attribution data: a rollback cannot distinguish these values from
  // later administrative edits or references already used by submissions.
}

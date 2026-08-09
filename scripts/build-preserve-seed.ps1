param(
  [Parameter(Mandatory = $true)]
  [string]$InputSql,

  [string]$OutputSql
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $InputSql)) {
  throw "Arquivo nao encontrado: $InputSql"
}

if (-not $OutputSql) {
  $dir = Split-Path -Parent $InputSql
  $OutputSql = Join-Path $dir "seed-preserve-existing.sql"
}

$content = Get-Content -Raw -LiteralPath $InputSql

$content = [regex]::Replace(
  $content,
  '(?m)^(INSERT INTO .+? VALUES \(.+?\));\s*$',
  '$1 ON CONFLICT DO NOTHING;'
)

$content = [regex]::Replace(
  $content,
  '(?m)^SELECT pg_catalog\.setval\(.+?\);\s*$',
  '-- setval removido: sequences serao recalculadas ao final deste seed.'
)

$header = @(
  '-- Seed idempotente gerado por scripts/build-preserve-seed.ps1',
  "-- Origem: $InputSql",
  "-- Gerado em: $(Get-Date -Format o)",
  '-- Comportamento: insere registros ausentes e preserva registros existentes.',
  '-- Importante: revisar dados sensiveis antes de commitar ou compartilhar.',
  '',
  'BEGIN;',
  ''
) -join "`r`n"

$sequenceRepair = @(
  '',
  '-- Recalcula sequences sem diminuir valores existentes.',
  'DO $$',
  'DECLARE',
  '  item record;',
  '  max_id bigint;',
  'BEGIN',
  '  FOR item IN',
  '    SELECT',
  '      seq_ns.nspname AS sequence_schema,',
  '      seq.relname AS sequence_name,',
  '      tbl_ns.nspname AS table_schema,',
  '      tbl.relname AS table_name,',
  '      col.attname AS column_name',
  '    FROM pg_class seq',
  '    JOIN pg_namespace seq_ns ON seq_ns.oid = seq.relnamespace',
  '    JOIN pg_depend dep ON dep.objid = seq.oid AND dep.deptype = ''a''',
  '    JOIN pg_class tbl ON tbl.oid = dep.refobjid',
  '    JOIN pg_namespace tbl_ns ON tbl_ns.oid = tbl.relnamespace',
  '    JOIN pg_attribute col ON col.attrelid = tbl.oid AND col.attnum = dep.refobjsubid',
  '    WHERE seq.relkind = ''S''',
  '  LOOP',
  '    EXECUTE format(''SELECT max(%I)::bigint FROM %I.%I'', item.column_name, item.table_schema, item.table_name) INTO max_id;',
  '    IF max_id IS NOT NULL THEN',
  '      EXECUTE format(',
  '        ''SELECT setval(%L, GREATEST((SELECT last_value FROM %I.%I), %s), true)'',',
  '        format(''%I.%I'', item.sequence_schema, item.sequence_name),',
  '        item.sequence_schema,',
  '        item.sequence_name,',
  '        max_id',
  '      );',
  '    END IF;',
  '  END LOOP;',
  'END $$;'
) -join "`r`n"

$footer = "`r`n$sequenceRepair`r`nCOMMIT;`r`n"

Set-Content -LiteralPath $OutputSql -Value ($header + $content + $footer) -Encoding utf8
Write-Host "Seed gerado: $OutputSql"
const fs = require('fs')
const path = require('path')

function parseArgs(argv) {
  const args = {}
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i]
    if (value === '--input' || value === '-i' || value === '-InputSql') {
      args.input = argv[i + 1]
      i += 1
    } else if (value === '--output' || value === '-o' || value === '-OutputSql') {
      args.output = argv[i + 1]
      i += 1
    } else if (!value.startsWith('-') && !args.input) {
      args.input = value
    }
  }
  return args
}

const args = parseArgs(process.argv.slice(2))
if (!args.input) {
  console.error('Uso: node scripts/build-preserve-seed.cjs db-exports/<timestamp>/data-only.sql [--output seed-preserve-existing.sql]')
  process.exit(1)
}

const inputPath = path.resolve(args.input)
if (!fs.existsSync(inputPath)) {
  console.error(`Arquivo nao encontrado: ${inputPath}`)
  process.exit(1)
}

const outputPath = path.resolve(args.output || path.join(path.dirname(inputPath), 'seed-preserve-existing.sql'))
let content = fs.readFileSync(inputPath, 'utf8').replace(/^\uFEFF/, '')

content = content.replace(/^(INSERT INTO .+? VALUES \(.+?\));\s*$/gm, '$1 ON CONFLICT DO NOTHING;')
content = content.replace(/^SELECT pg_catalog\.setval\(.+?\);\s*$/gm, '-- setval removido: sequences serao recalculadas ao final deste seed.')

const header = [
  '-- Seed idempotente gerado por scripts/build-preserve-seed.cjs',
  `-- Origem: ${inputPath}`,
  `-- Gerado em: ${new Date().toISOString()}`,
  '-- Comportamento: insere registros ausentes e preserva registros existentes.',
  '-- Importante: revisar dados sensiveis antes de commitar ou compartilhar.',
  '',
  'BEGIN;',
  '',
].join('\n')

const sequenceRepair = `
-- Recalcula sequences sem diminuir valores existentes.
DO $$
DECLARE
  item record;
  max_id bigint;
BEGIN
  FOR item IN
    SELECT
      seq_ns.nspname AS sequence_schema,
      seq.relname AS sequence_name,
      tbl_ns.nspname AS table_schema,
      tbl.relname AS table_name,
      col.attname AS column_name
    FROM pg_class seq
    JOIN pg_namespace seq_ns ON seq_ns.oid = seq.relnamespace
    JOIN pg_depend dep ON dep.objid = seq.oid AND dep.deptype = 'a'
    JOIN pg_class tbl ON tbl.oid = dep.refobjid
    JOIN pg_namespace tbl_ns ON tbl_ns.oid = tbl.relnamespace
    JOIN pg_attribute col ON col.attrelid = tbl.oid AND col.attnum = dep.refobjsubid
    WHERE seq.relkind = 'S'
  LOOP
    EXECUTE format('SELECT max(%I)::bigint FROM %I.%I', item.column_name, item.table_schema, item.table_name) INTO max_id;
    IF max_id IS NOT NULL THEN
      EXECUTE format(
        'SELECT setval(%L, GREATEST((SELECT last_value FROM %I.%I), %s), true)',
        format('%I.%I', item.sequence_schema, item.sequence_name),
        item.sequence_schema,
        item.sequence_name,
        max_id
      );
    END IF;
  END LOOP;
END $$;
`

fs.writeFileSync(outputPath, `${header}${content}\n${sequenceRepair}\nCOMMIT;\n`, 'utf8')
console.log(`Seed gerado: ${outputPath}`)

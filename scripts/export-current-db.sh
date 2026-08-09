#!/usr/bin/env sh
set -eu

DATABASE_URL_VALUE="${DATABASE_URL:-}"
OUT_DIR="${OUT_DIR:-db-exports}"
INCLUDE_OWNER_AND_PRIVILEGES="${INCLUDE_OWNER_AND_PRIVILEGES:-0}"

while [ "$#" -gt 0 ]; do
  case "$1" in
    --database-url)
      DATABASE_URL_VALUE="$2"
      shift 2
      ;;
    --out-dir)
      OUT_DIR="$2"
      shift 2
      ;;
    --include-owner-and-privileges)
      INCLUDE_OWNER_AND_PRIVILEGES="1"
      shift 1
      ;;
    *)
      echo "Argumento desconhecido: $1" >&2
      exit 1
      ;;
  esac
done

if [ -z "$DATABASE_URL_VALUE" ]; then
  echo "DATABASE_URL nao informado. Use DATABASE_URL='postgres://user:senha@host:5432/db' sh scripts/export-current-db.sh" >&2
  exit 1
fi

if ! command -v pg_dump >/dev/null 2>&1; then
  echo "pg_dump nao encontrado. Rode no container/servidor que tenha postgresql-client instalado." >&2
  exit 1
fi

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
TARGET="$OUT_DIR/$TIMESTAMP"
mkdir -p "$TARGET"

COMMON_ARGS="--no-owner --no-privileges"
if [ "$INCLUDE_OWNER_AND_PRIVILEGES" = "1" ]; then
  COMMON_ARGS=""
fi

# shellcheck disable=SC2086
pg_dump "$DATABASE_URL_VALUE" $COMMON_ARGS --format=custom --file="$TARGET/full.dump"
# shellcheck disable=SC2086
pg_dump "$DATABASE_URL_VALUE" $COMMON_ARGS --schema-only --file="$TARGET/schema-only.sql"
# shellcheck disable=SC2086
pg_dump "$DATABASE_URL_VALUE" $COMMON_ARGS --data-only --column-inserts --disable-triggers --file="$TARGET/data-only.sql"

cat > "$TARGET/manifest.txt" <<EOF
Export gerado em: $TARGET
Data: $(date -Iseconds)
Arquivos:
- full.dump: backup restauravel com pg_restore
- schema-only.sql: estrutura atual do banco
- data-only.sql: inserts com nomes de colunas para criar seed SQL

Comandos uteis:
pg_restore --clean --if-exists --dbname=<DATABASE_URL_DESTINO> "$TARGET/full.dump"
psql <DATABASE_URL_DESTINO> -f "$TARGET/data-only.sql"
EOF

echo "Export concluido: $TARGET"
echo "Compacte e envie a pasta, principalmente data-only.sql e schema-only.sql."

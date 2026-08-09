param(
  [string]$DatabaseUrl = $env:DATABASE_URL,
  [string]$OutDir = "db-exports",
  [switch]$IncludeOwnerAndPrivileges
)

$ErrorActionPreference = "Stop"

if (-not $DatabaseUrl) {
  throw "DATABASE_URL nao foi informado. Use: .\scripts\export-current-db.ps1 -DatabaseUrl 'postgres://user:senha@host:5432/db'"
}

$pgDump = Get-Command pg_dump -ErrorAction SilentlyContinue
if (-not $pgDump) {
  throw "pg_dump nao encontrado no PATH. Instale o PostgreSQL client ou rode este script no servidor onde pg_dump existe."
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$target = Join-Path $OutDir $timestamp
New-Item -ItemType Directory -Force -Path $target | Out-Null

$commonArgs = @()
if (-not $IncludeOwnerAndPrivileges) {
  $commonArgs += "--no-owner"
  $commonArgs += "--no-privileges"
}

$fullDump = Join-Path $target "full.dump"
$dataSql = Join-Path $target "data-only.sql"
$schemaSql = Join-Path $target "schema-only.sql"
$manifest = Join-Path $target "manifest.txt"

& pg_dump $DatabaseUrl @commonArgs --format=custom --file=$fullDump
if ($LASTEXITCODE -ne 0) { throw "pg_dump full.dump falhou com codigo $LASTEXITCODE" }

& pg_dump $DatabaseUrl @commonArgs --schema-only --file=$schemaSql
if ($LASTEXITCODE -ne 0) { throw "pg_dump schema-only.sql falhou com codigo $LASTEXITCODE" }

& pg_dump $DatabaseUrl @commonArgs --data-only --column-inserts --disable-triggers --file=$dataSql
if ($LASTEXITCODE -ne 0) { throw "pg_dump data-only.sql falhou com codigo $LASTEXITCODE" }

@"
Export gerado em: $target
Data: $(Get-Date -Format o)
Arquivos:
- full.dump: backup restauravel com pg_restore
- schema-only.sql: estrutura atual do banco
- data-only.sql: inserts com nomes de colunas para criar seed SQL

Comandos uteis:
pg_restore --clean --if-exists --dbname=<DATABASE_URL_DESTINO> "$fullDump"
psql <DATABASE_URL_DESTINO> -f "$dataSql"
"@ | Set-Content -Path $manifest -Encoding utf8

Write-Host "Export concluido: $target"
Write-Host "Me envie a pasta compactada: $target"
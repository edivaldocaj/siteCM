# Cavalcante Albuquerque

Site institucional em Next.js 16 e Payload CMS 3.80 para Cavalcante Albuquerque.

## Comandos principais

```bash
npm run dev
npm run generate:types
npx tsc --noEmit
npm run build
```

## Observacoes

- Dados institucionais juridicamente sensiveis que ainda dependem de confirmacao devem permanecer como `__PENDENTE__` no CMS.
- Nao rode migracoes destrutivas sem backup verificado.
- Use `overrideAccess: false` ao passar `user` para a Local API do Payload.

## Subir com banco novo

Use este caminho se o banco atual puder ser descartado ou mantido apenas como backup historico.

1. Crie um Postgres vazio no Easypanel e configure no app:

```bash
DATABASE_URL="postgres://usuario:senha@host:5432/banco_novo"
PAYLOAD_SECRET="uma-chave-forte"
NEXT_PUBLIC_SITE_URL="https://cavalcantealbuquerque.com.br"
NEXT_PUBLIC_WHATSAPP_NUMBER="5584991243985"
```


Antes de migrar/buildar em producao, valide as variaveis:

```bash
npm run preflight:production
```

Depois que o app estiver no ar, valide o healthcheck:

```bash
curl -fsS "$NEXT_PUBLIC_SITE_URL/api/health"
```

2. Aplique migrations no banco novo:

```bash
npm run migrate
```

3. Rode o bootstrap idempotente:

```bash
ADMIN_EMAIL="seu-email@dominio.com" ADMIN_PASSWORD="senha-forte" npm run bootstrap:new-db
```

Se `ADMIN_EMAIL` e `ADMIN_PASSWORD` nao forem informados, o bootstrap cria apenas globals, navegacao, areas e equipe inicial.

4. Gere build e reinicie o app:

```bash
npm run build
npm run start
```

Dados juridicos/institucionais nao confirmados ficam como `__PENDENTE__` para revisao no painel.

## Exportar banco atual sem perder dados

Se o Postgres so fica acessivel dentro do Easypanel, rode o dump no terminal do app/container ou no servidor onde o site esta rodando.

### Easypanel / Linux

```bash
export DATABASE_URL="postgres://usuario:senha@host:5432/banco"
sh scripts/export-current-db.sh
```

Isso gera uma pasta `db-exports/AAAAmmdd-HHmmss` com:

- `full.dump`: backup restauravel com `pg_restore`.
- `schema-only.sql`: estrutura atual.
- `data-only.sql`: dados em `INSERT` com colunas nomeadas.

Depois compacte essa pasta e traga principalmente `data-only.sql` e `schema-only.sql` para eu gerar/conferir o seed final.

### Windows / local

```powershell
$env:DATABASE_URL="postgres://usuario:senha@host:5432/banco"
.\scripts\export-current-db.ps1
```

### Export JSON via Payload

Quando o app conseguir acessar o banco atual:

```bash
npm run export:content
```

Use `npm run export:content:users` somente se precisar exportar usuarios; esse arquivo pode conter dados sensiveis.

### Gerar seed preservando dados existentes

```bash
npm run seed:from-dump -- db-exports/AAAAmmdd-HHmmss/data-only.sql
```

O arquivo `seed-preserve-existing.sql` usa `ON CONFLICT DO NOTHING`, nao sobrescreve registros existentes e recalcula sequences ao final sem reduzir valores atuais.


## Deploy

No GitHub Actions, configure estes secrets para o workflow atual:

- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_KEY`
- `VPS_PORT`
- `SITE_URL`
- `CRON_SECRET`

O deploy executa `npm run preflight:production`, `npm run migrate`, `npm run build` e depois recarrega o processo PM2 `cavalcantealbuquerque`.

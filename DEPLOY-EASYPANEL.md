# Deploy no Easypanel via Git

Este guia assume um projeto novo no Easypanel usando este repositorio Git e um Postgres novo.

## Variaveis obrigatorias

Configure no app do Easypanel:

```bash
DATABASE_URL=postgres://usuario:senha@host:5432/banco
PAYLOAD_SECRET=gere-uma-chave-com-32-caracteres-ou-mais
NEXT_PUBLIC_SITE_URL=https://seudominio.com.br
NEXT_PUBLIC_WHATSAPP_NUMBER=5584991243985
CRON_SECRET=gere-outra-chave-forte
REVALIDATE_SECRET=gere-outra-chave-forte
```

O `PAYLOAD_SECRET` precisa ser definitivo antes de criar usuarios. Trocar depois pode invalidar sessoes/tokens.

## Build e start

Se o Easypanel usar Dockerfile:

- Build: usa o `Dockerfile` do repositorio.
- Porta interna: `3000`.
- Healthcheck HTTP do Easypanel: `/api/live` (liveness sem banco). Use `/api/health` apenas para diagnóstico completo com banco/Payload.
- Volume persistente recomendado: `/app/public/media`.

Se o Easypanel usar modo Node/buildpack:

```bash
npm ci
npm run build
npm run start
```

## Primeira inicializacao com banco novo

Depois do primeiro build/deploy, abra um terminal do app no Easypanel e rode:

```bash
npm run preflight:production
npm run migrate
ADMIN_EMAIL="seu-email@dominio.com" ADMIN_PASSWORD="senha-forte" npm run bootstrap:new-db
```

O bootstrap pode ser repetido. Ele atualiza dados iniciais por slug/e-mail e nao duplica registros.

## Opcao automatica no primeiro start Docker

Se quiser que o container rode as etapas iniciais sozinho na primeira subida, configure temporariamente:

```bash
RUN_PREFLIGHT_ON_START=true
RUN_MIGRATIONS_ON_START=true
BOOTSTRAP_NEW_DB_ON_START=true
DB_WAIT_SECONDS=60
DB_STARTUP_STRICT=false
ADMIN_EMAIL=seu-email@dominio.com
ADMIN_PASSWORD=senha-forte
```

Depois que o bootstrap concluir e voce conseguir acessar o /admin, volte pelo menos estas variaveis para false:

```bash
BOOTSTRAP_NEW_DB_ON_START=false
RUN_MIGRATIONS_ON_START=false
```

O container aguarda o Postgres por ate `DB_WAIT_SECONDS` quando migrations ou bootstrap estiverem ativos.

Manter tarefas automáticas de banco em todo start pode ser aceitável no começo, mas para produção estável prefira rodar preparo de banco de forma controlada antes do reload. `DB_STARTUP_STRICT=false` evita 502 por falha de bootstrap, mantendo o app no ar para diagnóstico.

## Smoke test

Depois que o app reiniciar:

```bash
curl -fsS "$NEXT_PUBLIC_SITE_URL/api/live"
curl -fsS "$NEXT_PUBLIC_SITE_URL/api/health"
curl -I "$NEXT_PUBLIC_SITE_URL/"
curl -I "$NEXT_PUBLIC_SITE_URL/admin"
curl -I "$NEXT_PUBLIC_SITE_URL/robots.txt"
curl -I "$NEXT_PUBLIC_SITE_URL/sitemap.xml"
```

Resultado esperado para `/api/live`: HTTP 200 e `status: "ok"`. Resultado esperado para `/api/health`: HTTP 200 quando banco e Payload estiverem prontos; se retornar 503, o app subiu, mas o banco/CMS ainda precisa de correção.

## Primeira revisao no CMS

No painel `/admin`, revisar e substituir todos os campos `__PENDENTE__` antes de considerar o site pronto para divulgacao:

- Identidade Institucional: razao social, CNPJ, OAB/RN, titular, DPO e endereco.
- Configuracoes Gerais do Site: contato, textos principais e endereco.
- Pagina Inicial: equipe, historia e textos comerciais.
- Areas de atuacao: conteudo completo, FAQ e SEO.
- Politica de privacidade, termos de uso e politica de cookies.

## Notas

- O banco antigo pode ficar separado como backup historico.
- Nao rode `bootstrap:new-db` com senha fraca ou temporaria em ambiente publico.
- O endpoint `/api/news-feed` aceita `Authorization: Bearer $CRON_SECRET`.

# Deploy e rollback do CA

## Estado publicado

- Serviço EasyPanel: `cavalcante_albuquerque/site`
- Domínio: `https://cavalcantealbuquerque.com.br`
- Commit publicado: `09573bb`
- Comunicação com clientes: modo sombra

## Smoke somente leitura

Após cada publicação, validar:

```text
GET /
GET /agendar
GET /campanhas
GET /api/health
```

Critérios: HTTP 200; a agenda deve exibir somente 09:00, 10:00, 11:00,
14:00, 15:00 e 16:00; a home não pode conter erro do Next.js.

## Rollback

Se a home ou as rotas principais falharem, selecionar no EasyPanel o commit
seguro anterior `1625aef`, republicar o serviço e repetir o smoke. Registrar
data, motivo, resultado e nova versão antes de qualquer promoção.

Não apagar banco, executar seed demo ou limpar reservas como mecanismo de
rollback. O rollback de código não desfaz dados nem comunicações.

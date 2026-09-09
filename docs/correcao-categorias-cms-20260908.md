# Correção de categorias do CMS — 08/09/2026

O formulário oferecia licitacoes/civil/penal, mas enum_campaigns_category no
PostgreSQL só continha consumidor/digital/criminal/imobiliario/tributario.
Salvar uma opção nova falhava com a mensagem genérica do Payload.

A migração 20260908_180000_campaign_category_values acrescenta os três valores
sem converter/remover valores legados. Guarda id, categoria e updated_at na
tabela campaign_category_backup_20260908 antes da alteração.

Aplicada em produção pelo console autorizado do serviço site em 08/09/2026,
com transação, lock_timeout de 5 segundos e advisory lock 82417031, compartilhado
com o startup. O deploy pode executá-la novamente: os comandos são idempotentes.

Validação: banco isolado com enum legado, execução dupla, preservação do backup
e gravação de licitacoes. No CMS de produção, campanha 8 salva com Licitações
e Contratos e título original; API pública confirmou categoria e updatedAt.
Antes do teste, cópia integral pública foi salva em .audit local (não versionada).

Rollback exige revisão manual: categorias novas podem estar em uso. Não reduzir
o enum nem substituir categorias a partir do backup sem comparar os registros.

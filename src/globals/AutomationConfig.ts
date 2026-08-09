import type { GlobalConfig } from 'payload'
import { adminOnly, anyone } from '../access'

export const AutomationConfig: GlobalConfig = {
  slug: 'automation-config',
  label: 'Configuracao de Automacoes',
  access: { read: anyone, update: adminOnly },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Noticias',
          fields: [
            { name: 'newsEnabled', type: 'checkbox', label: 'Ativar ingestao de noticias', defaultValue: false },
            { name: 'newsIntervalHours', type: 'number', label: 'Intervalo em horas', defaultValue: 4, min: 1 },
            { name: 'newsAutoPublishScore', type: 'number', label: 'Score minimo para publicar automaticamente', defaultValue: 85, min: 0, max: 100 },
            { name: 'newsRetentionDays', type: 'number', label: 'Retencao de noticias pendentes em dias', defaultValue: 90, min: 1 },
            {
              name: 'newsSources',
              type: 'array',
              label: 'Fontes de noticias',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
                { name: 'enabled', type: 'checkbox', defaultValue: true },
              ],
            },
          ],
        },
        {
          label: 'Leads',
          fields: [
            { name: 'leadAutoReply', type: 'checkbox', label: 'Resposta automatica ao lead', defaultValue: false },
            { name: 'leadAutoReplyTemplate', type: 'textarea', label: 'Template da resposta automatica' },
            { name: 'leadSlaHours', type: 'number', label: 'SLA de atendimento em horas uteis', defaultValue: 4, min: 1 },
            { name: 'leadEscalationEmail', type: 'text', label: 'E-mail para escalonamento', defaultValue: '__PENDENTE__' },
          ],
        },
        {
          label: 'Prazos e processos',
          fields: [
            { name: 'deadlineAlertsEnabled', type: 'checkbox', label: 'Alertas de prazos ativos', defaultValue: false },
            {
              name: 'deadlineAlertDays',
              type: 'array',
              label: 'Dias de alerta antes do prazo',
              defaultValue: [{ days: 7 }, { days: 3 }, { days: 1 }, { days: 0 }],
              fields: [{ name: 'days', type: 'number', required: true, min: 0 }],
            },
            { name: 'deadlineAlertHour', type: 'number', label: 'Hora do alerta', defaultValue: 8, min: 0, max: 23 },
            { name: 'datajudSyncEnabled', type: 'checkbox', label: 'Sincronizacao DataJud ativa', defaultValue: false },
            { name: 'datajudSyncHour', type: 'number', label: 'Hora da sincronizacao DataJud', defaultValue: 7, min: 0, max: 23 },
          ],
        },
        {
          label: 'Relacionamento e marketing',
          fields: [
            { name: 'npsTriggerDays', type: 'number', label: 'Dias apos encerramento para NPS', defaultValue: 30, min: 1 },
            { name: 'npsAutoTestimonial', type: 'checkbox', label: 'Criar rascunho de depoimento a partir do NPS', defaultValue: false },
            { name: 'socialAutoGenerate', type: 'checkbox', label: 'Gerar pecas sociais automaticamente', defaultValue: false },
          ],
        },
      ],
    },
  ],
}
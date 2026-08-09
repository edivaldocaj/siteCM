import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrStaff, anyone, fieldAdminOrStaff } from '../access'

export const Leads: CollectionConfig = {
  slug: 'leads',
  endpoints: false,
  graphQL: false,
  access: {
    read: adminOrStaff,
    create: anyone,
    update: adminOrStaff,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'source', 'campaignSlug', 'status', 'score', 'assignedTo', 'createdAt'],
    description: 'Pipeline de leads â€” todos os contatos captados pelo site, formulÃ¡rios e campanhas.',
    listSearchableFields: ['name', 'phone', 'email', 'campaignSlug'],
  },
  fields: [
    /* â”€â”€ DADOS DO LEAD â”€â”€ */
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Nome Completo' },
        { name: 'phone', type: 'text', required: true, label: 'Telefone / WhatsApp' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', label: 'E-mail' },
        { name: 'cpf', type: 'text', label: 'CPF', access: { read: fieldAdminOrStaff } },
      ],
    },

    /* â”€â”€ ORIGEM â”€â”€ */
    {
      type: 'row',
      fields: [
        {
          name: 'source',
          type: 'select',
          required: true,
          label: 'Origem',
          defaultValue: 'contact-form',
          options: [
            { label: 'FormulÃ¡rio de Campanha', value: 'campaign-form' },
            { label: 'FormulÃ¡rio de Contato', value: 'contact-form' },
            { label: 'WhatsApp (manual)', value: 'whatsapp' },
            { label: 'IndicaÃ§Ã£o', value: 'referral' },
            { label: 'Calculadora do Site', value: 'calculator' },
            { label: 'Outro', value: 'other' },
          ],
        },
        {
          name: 'campaignSlug',
          type: 'text',
          label: 'Campanha de Origem',
          admin: { description: 'Slug da campanha (preenchido automaticamente)' },
        },
      ],
    },

    /* â”€â”€ UTM TRACKING â”€â”€ */
    {
      type: 'collapsible',
      label: 'Rastreamento (UTM)',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'utmSource', type: 'text', label: 'UTM Source', admin: { description: 'google, instagram, facebook...' } },
            { name: 'utmMedium', type: 'text', label: 'UTM Medium', admin: { description: 'cpc, social, email...' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'utmCampaign', type: 'text', label: 'UTM Campaign' },
            { name: 'utmContent', type: 'text', label: 'UTM Content' },
          ],
        },
        { name: 'referrerUrl', type: 'text', label: 'URL de ReferÃªncia' },
        { name: 'consentText', type: 'textarea', label: 'Texto do Consentimento', admin: { readOnly: true } },
        { name: 'consentedAt', type: 'date', label: 'Consentido em', admin: { readOnly: true } },
        { name: 'ip', type: 'text', label: 'IP', admin: { readOnly: true } },
        { name: 'userAgent', type: 'textarea', label: 'User Agent', admin: { readOnly: true } },
      ],
    },

    /* â”€â”€ QUALIFICAÃ‡ÃƒO â”€â”€ */
    {
      type: 'tabs',
      tabs: [
        {
          label: 'QualificaÃ§Ã£o',
          fields: [
            {
              name: 'qualificationAnswers',
              type: 'array',
              label: 'Respostas de QualificaÃ§Ã£o',
              admin: { description: 'Preenchido automaticamente pelo formulÃ¡rio multi-step da campanha.' },
              fields: [
                { name: 'question', type: 'text', required: true, label: 'Pergunta' },
                { name: 'answer', type: 'text', required: true, label: 'Resposta' },
              ],
            },
            { name: 'caseDescription', type: 'textarea', label: 'DescriÃ§Ã£o do Caso (pelo lead)' },
            {
              name: 'estimatedValue',
              type: 'number',
              label: 'Valor Estimado da Causa (R$)',
              admin: { description: 'Valor informado pelo lead ou estimado pelo formulÃ¡rio.' },
            },
            {
              name: 'urgency',
              type: 'select',
              label: 'UrgÃªncia',
              options: [
                { label: 'Baixa â€” Informativo', value: 'low' },
                { label: 'MÃ©dia â€” Quer resolver', value: 'medium' },
                { label: 'Alta â€” Prazo correndo', value: 'high' },
                { label: 'Urgente â€” EmergÃªncia', value: 'urgent' },
              ],
              defaultValue: 'medium',
            },
          ],
        },
        {
          label: 'Pipeline',
          fields: [
            {
              name: 'status',
              type: 'select',
              required: true,
              label: 'Status',
              defaultValue: 'new',
              options: [
                { label: 'ðŸŸ¡ Novo', value: 'new' },
                { label: 'ðŸ“ž Contatado', value: 'contacted' },
                { label: 'âœ… Qualificado', value: 'qualified' },
                { label: 'ðŸ“‹ Proposta Enviada', value: 'proposal' },
                { label: 'ðŸŽ‰ Convertido (Cliente)', value: 'converted' },
                { label: 'âŒ Perdido', value: 'lost' },
              ],
              admin: { position: 'sidebar' },
            },
            {
              name: 'score',
              type: 'number',
              label: 'Score (0-100)',
              min: 0,
              max: 100,
              defaultValue: 0,
              admin: {
                position: 'sidebar',
                description: 'Calculado automaticamente. Quanto maior, mais qualificado.',
              },
            },
            {
              name: 'assignedTo',
              type: 'select',
              label: 'Advogado ResponsÃ¡vel',
              options: [
                { label: 'Dr. Edivaldo Cavalcante', value: 'edivaldo' },
                { label: 'Dra. Gabrielly Melo', value: 'gabrielly' },
              ],
              admin: { position: 'sidebar' },
            },
            {
              name: 'assignedToRef',
              type: 'relationship',
              relationTo: 'team',
              label: 'Advogado Responsável (Team)',
              filterOptions: { active: { equals: true } },
              admin: { position: 'sidebar', description: 'Campo temporário para migração. Mantém assignedTo legado.' },
            },
            {
              name: 'byFirm',
              type: 'checkbox',
              defaultValue: false,
              label: 'Responsabilidade do escritório',
              admin: { position: 'sidebar' },
            },            {
              name: 'lostReason',
              type: 'select',
              label: 'Motivo da Perda',
              options: [
                { label: 'Sem resposta', value: 'no-response' },
                { label: 'Escolheu outro escritÃ³rio', value: 'competitor' },
                { label: 'Desistiu da aÃ§Ã£o', value: 'gave-up' },
                { label: 'Sem mÃ©rito jurÃ­dico', value: 'no-merit' },
                { label: 'Valor inviÃ¡vel', value: 'price' },
                { label: 'Outro', value: 'other' },
              ],
              admin: {
                condition: (data) => data?.status === 'lost',
              },
            },
          ],
        },
        {
          label: 'Acompanhamento',
          fields: [
            {
              name: 'notes',
              type: 'array',
              label: 'AnotaÃ§Ãµes / Follow-up',
              fields: [
                { name: 'text', type: 'textarea', required: true, label: 'AnotaÃ§Ã£o' },
                {
                  name: 'author',
                  type: 'select',
                  label: 'Autor',
                  options: [
                    { label: 'Dr. Edivaldo', value: 'edivaldo' },
                    { label: 'Dra. Gabrielly', value: 'gabrielly' },
                    { label: 'Sistema', value: 'system' },
                  ],
                  defaultValue: 'system',
                },
                { name: 'date', type: 'date', label: 'Data', defaultValue: () => new Date().toISOString() },
              ],
            },
            {
              name: 'nextFollowUp',
              type: 'date',
              label: 'PrÃ³ximo Follow-up',
              admin: {
                position: 'sidebar',
                description: 'Data para lembrete de acompanhamento.',
                date: { pickerAppearance: 'dayAndTime' },
              },
            },
          ],
        },
        {
          label: 'ConversÃ£o',
          fields: [
            {
              name: 'convertedToClient',
              type: 'relationship',
              relationTo: 'clients' as any,
              label: 'Cliente Vinculado',
              admin: {
                description: 'Quando convertido, vincular ao registro de cliente.',
                condition: (data) => data?.status === 'converted',
              },
            },
            {
              name: 'conversionDate',
              type: 'date',
              label: 'Data de ConversÃ£o',
              admin: {
                condition: (data) => data?.status === 'converted',
              },
            },
            {
              name: 'contractValue',
              type: 'number',
              label: 'Valor do Contrato (R$)',
              admin: {
                condition: (data) => data?.status === 'converted',
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-calculate lead score
        if (data) {
          let score = 0

          // Phone provided (+10)
          if (data.phone) score += 10
          // Email provided (+10)
          if (data.email) score += 10
          // CPF provided (+5)
          if (data.cpf) score += 5
          // Case description (+10)
          if (data.caseDescription) score += 10
          // Qualification answers (+5 each, max 20)
          if (data.qualificationAnswers?.length) {
            score += Math.min(data.qualificationAnswers.length * 5, 20)
          }
          // Estimated value
          if (data.estimatedValue) {
            if (data.estimatedValue >= 50000) score += 20
            else if (data.estimatedValue >= 20000) score += 15
            else if (data.estimatedValue >= 5000) score += 10
            else score += 5
          }
          // Urgency
          if (data.urgency === 'urgent') score += 20
          else if (data.urgency === 'high') score += 15
          else if (data.urgency === 'medium') score += 10
          else score += 5

          // From campaign (+5)
          if (data.campaignSlug) score += 5

          data.score = Math.min(score, 100)
        }
        return data
      },
    ],
  },
}







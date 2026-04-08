import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'source', 'campaignSlug', 'status', 'score', 'assignedTo', 'createdAt'],
    description: 'Pipeline de leads — todos os contatos captados pelo site, formulários e campanhas.',
    listSearchableFields: ['name', 'phone', 'email', 'campaignSlug'],
  },
  fields: [
    /* ── DADOS DO LEAD ── */
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
        { name: 'cpf', type: 'text', label: 'CPF' },
      ],
    },

    /* ── ORIGEM ── */
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
            { label: 'Formulário de Campanha', value: 'campaign-form' },
            { label: 'Formulário de Contato', value: 'contact-form' },
            { label: 'WhatsApp (manual)', value: 'whatsapp' },
            { label: 'Indicação', value: 'referral' },
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

    /* ── UTM TRACKING ── */
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
        { name: 'referrerUrl', type: 'text', label: 'URL de Referência' },
      ],
    },

    /* ── QUALIFICAÇÃO ── */
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Qualificação',
          fields: [
            {
              name: 'qualificationAnswers',
              type: 'array',
              label: 'Respostas de Qualificação',
              admin: { description: 'Preenchido automaticamente pelo formulário multi-step da campanha.' },
              fields: [
                { name: 'question', type: 'text', required: true, label: 'Pergunta' },
                { name: 'answer', type: 'text', required: true, label: 'Resposta' },
              ],
            },
            { name: 'caseDescription', type: 'textarea', label: 'Descrição do Caso (pelo lead)' },
            {
              name: 'estimatedValue',
              type: 'number',
              label: 'Valor Estimado da Causa (R$)',
              admin: { description: 'Valor informado pelo lead ou estimado pelo formulário.' },
            },
            {
              name: 'urgency',
              type: 'select',
              label: 'Urgência',
              options: [
                { label: 'Baixa — Informativo', value: 'low' },
                { label: 'Média — Quer resolver', value: 'medium' },
                { label: 'Alta — Prazo correndo', value: 'high' },
                { label: 'Urgente — Emergência', value: 'urgent' },
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
                { label: '🟡 Novo', value: 'new' },
                { label: '📞 Contatado', value: 'contacted' },
                { label: '✅ Qualificado', value: 'qualified' },
                { label: '📋 Proposta Enviada', value: 'proposal' },
                { label: '🎉 Convertido (Cliente)', value: 'converted' },
                { label: '❌ Perdido', value: 'lost' },
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
              label: 'Advogado Responsável',
              options: [
                { label: 'Dr. Edivaldo Cavalcante', value: 'edivaldo' },
                { label: 'Dra. Gabrielly Melo', value: 'gabrielly' },
              ],
              admin: { position: 'sidebar' },
            },
            {
              name: 'lostReason',
              type: 'select',
              label: 'Motivo da Perda',
              options: [
                { label: 'Sem resposta', value: 'no-response' },
                { label: 'Escolheu outro escritório', value: 'competitor' },
                { label: 'Desistiu da ação', value: 'gave-up' },
                { label: 'Sem mérito jurídico', value: 'no-merit' },
                { label: 'Valor inviável', value: 'price' },
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
              label: 'Anotações / Follow-up',
              fields: [
                { name: 'text', type: 'textarea', required: true, label: 'Anotação' },
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
              label: 'Próximo Follow-up',
              admin: {
                position: 'sidebar',
                description: 'Data para lembrete de acompanhamento.',
                date: { pickerAppearance: 'dayAndTime' },
              },
            },
          ],
        },
        {
          label: 'Conversão',
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
              label: 'Data de Conversão',
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

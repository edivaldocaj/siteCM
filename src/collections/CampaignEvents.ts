import type { CollectionConfig } from 'payload'

export const CampaignEvents: CollectionConfig = {
  slug: 'campaign-events',
  admin: {
    useAsTitle: 'eventType',
    defaultColumns: ['campaignSlug', 'eventType', 'createdAt'],
    description: 'Eventos de analytics das campanhas (visualizações, cliques, conversões).',
    hidden: false,
  },
  fields: [
    {
      name: 'campaignSlug',
      type: 'text',
      required: true,
      label: 'Campanha',
      index: true,
    },
    {
      name: 'eventType',
      type: 'select',
      required: true,
      label: 'Tipo de Evento',
      options: [
        { label: 'Visualização da página', value: 'page_view' },
        { label: 'Clique no WhatsApp', value: 'whatsapp_click' },
        { label: 'Formulário iniciado', value: 'form_start' },
        { label: 'Formulário enviado', value: 'form_submit' },
        { label: 'Compartilhamento', value: 'share' },
        { label: 'Clique no CTA final', value: 'cta_click' },
        { label: 'Scroll até o fim', value: 'scroll_complete' },
      ],
    },
    { name: 'utmSource', type: 'text', label: 'UTM Source' },
    { name: 'utmMedium', type: 'text', label: 'UTM Medium' },
    { name: 'utmCampaign', type: 'text', label: 'UTM Campaign' },
    { name: 'referrer', type: 'text', label: 'Referrer' },
    { name: 'userAgent', type: 'text', label: 'User Agent' },
    {
      name: 'metadata',
      type: 'json',
      label: 'Metadados',
      admin: { description: 'Dados adicionais do evento (ex: variante A/B, tempo na página).' },
    },
  ],
}

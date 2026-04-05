import type { CollectionConfig } from 'payload'

export const Campaigns: CollectionConfig = {
  slug: 'campaigns',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'featuredOnHomepage'],
    description: 'Campanhas jurídicas — cada campanha gera uma landing page independente.',
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Título da Campanha' },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      label: 'Categoria',
      options: [
        { label: 'Consumidor / Cível', value: 'consumidor' },
        { label: 'Digital / LGPD', value: 'digital' },
        { label: 'Criminal', value: 'criminal' },
        { label: 'Imobiliário', value: 'imobiliario' },
        { label: 'Tributário', value: 'tributario' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Status',
      options: [
        { label: 'Rascunho', value: 'draft' },
        { label: 'Ativa', value: 'active' },
        { label: 'Pausada', value: 'paused' },
        { label: 'Encerrada', value: 'ended' },
      ],
      defaultValue: 'draft',
    },
    { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Imagem Hero' },
    { name: 'subtitle', type: 'text', label: 'Subtítulo / Headline' },
    { name: 'problemDescription', type: 'richText', required: false, label: 'Descrição do Problema' },
    { name: 'rightsExplanation', type: 'richText', required: false, label: 'Explicação dos Direitos' },
    { name: 'benefits', type: 'richText', required: false, label: 'Benefícios da Atuação Jurídica' },
    {
      name: 'socialProof',
      type: 'array',
      label: 'Prova Social',
      fields: [
        { name: 'text', type: 'textarea', required: true, label: 'Depoimento' },
        { name: 'author', type: 'text', label: 'Nome (pode ser iniciais)' },
        { name: 'caseType', type: 'text', label: 'Tipo de Caso' },
      ],
    },
    {
      name: 'faq',
      type: 'array',
      label: 'Perguntas Frequentes',
      fields: [
        { name: 'question', type: 'text', required: true, label: 'Pergunta' },
        { name: 'answer', type: 'textarea', required: true, label: 'Resposta' },
      ],
    },
    { name: 'whatsappMessage', type: 'text', label: 'Mensagem WhatsApp (pré-preenchida)' },
    { name: 'showForm', type: 'checkbox', label: 'Exibir Formulário de Captação', defaultValue: true },
    { name: 'urgencyText', type: 'text', label: 'Texto de Urgência (barra topo)' },
    { name: 'featuredOnHomepage', type: 'checkbox', label: 'Destaque na Homepage' },
    { name: 'startDate', type: 'date', label: 'Início' },
    { name: 'endDate', type: 'date', label: 'Término (opcional)' },

    /* ────────────────────────────────────────────
     * REDES SOCIAIS / MARKETING VISUAL
     * ──────────────────────────────────────────── */
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Redes Sociais',
          fields: [
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagem Feed (1080×1080)',
              admin: { description: 'Imagem quadrada para posts de feed no Instagram/Facebook.' },
            },
            {
              name: 'storyImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagem Story/Reels (1080×1920)',
              admin: { description: 'Imagem vertical para Stories, Reels e TikTok.' },
            },
            {
              name: 'videoUrl',
              type: 'text',
              label: 'URL do Vídeo (YouTube/Vimeo)',
              admin: { description: 'Link para embed de vídeo curto na landing page.' },
            },
            {
              name: 'videoFile',
              type: 'upload',
              relationTo: 'media',
              label: 'Vídeo Curto (upload direto)',
              admin: { description: 'Upload de vídeo curto (até 60s) — MP4 recomendado.' },
            },
            {
              name: 'socialCaption',
              type: 'textarea',
              label: 'Legenda para Redes Sociais',
              admin: { description: 'Texto pré-escrito para copiar e colar nos posts. Máx ~2200 caracteres (limite do Instagram).' },
            },
            {
              name: 'socialHashtags',
              type: 'text',
              hasMany: true,
              label: 'Hashtags',
              admin: { description: 'Ex: #direitodoconsumidor, #lgpd, #advocaciadigital' },
            },
            {
              name: 'colorAccent',
              type: 'select',
              label: 'Cor de Destaque (cards sociais)',
              options: [
                { label: 'Dourado (padrão CM)', value: 'gold' },
                { label: 'Vermelho (urgência)', value: 'red' },
                { label: 'Azul (institucional)', value: 'blue' },
                { label: 'Verde (positivo)', value: 'green' },
              ],
              defaultValue: 'gold',
            },
            {
              name: 'targetAudience',
              type: 'textarea',
              label: 'Público-Alvo',
              admin: { description: 'Descrição do público-alvo para segmentação de anúncios.' },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'metaTitle', type: 'text', label: 'Meta Title' },
            { name: 'metaDescription', type: 'textarea', label: 'Meta Description' },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagem OpenGraph (1200×630)',
              admin: { description: 'Imagem de preview quando o link for compartilhado no WhatsApp/Telegram/Facebook.' },
            },
          ],
        },
      ],
    },
  ],
}

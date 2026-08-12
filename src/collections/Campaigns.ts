import type { CollectionConfig } from 'payload'
import { activeCampaignOnly, adminOnly, adminOrEditor } from '../access'

export const Campaigns: CollectionConfig = {
  slug: 'campaigns',
  labels: {
    singular: 'Campanha',
    plural: 'Campanhas',
  },
  access: {
    read: activeCampaignOnly,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'featuredOnHomepage', 'startDate'],
    description: 'Campanhas jurídicas com landing page, formulário, prova social e peças de divulgação.',
    group: 'Conteúdo do Site',
    listSearchableFields: ['title', 'slug', 'subtitle'],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Estratégia',
          description: 'Defina o foco jurídico, a URL pública e o status operacional da campanha.',
          fields: [
            { name: 'title', type: 'text', required: true, label: 'Título da Campanha' },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              label: 'Slug da URL',
              admin: {
                description: 'Usado em /campanhas/slug-da-campanha. Use letras minúsculas, números e hífens.',
              },
            },
            {
              name: 'category',
              type: 'select',
              required: true,
              label: 'Área foco',
              options: [
                { label: 'Licitações e Contratos', value: 'licitacoes' },
                { label: 'Direito Digital / LGPD', value: 'digital' },
                { label: 'Direito Civil', value: 'civil' },
                { label: 'Direito Penal', value: 'penal' },
                { label: 'Consumidor / Cível', value: 'consumidor' },
                { label: 'Criminal (legado)', value: 'criminal' },
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
              admin: { position: 'sidebar' },
            },
            { name: 'featuredOnHomepage', type: 'checkbox', label: 'Destaque na Homepage', admin: { position: 'sidebar' } },
            { name: 'startDate', type: 'date', label: 'Início', admin: { position: 'sidebar' } },
            { name: 'endDate', type: 'date', label: 'Término (opcional)', admin: { position: 'sidebar' } },
          ],
        },
        {
          label: 'Landing Page',
          description: 'Conteúdo principal exibido na página pública da campanha.',
          fields: [
            {
              name: 'subtitle',
              type: 'text',
              label: 'Subtítulo / Headline',
              admin: { description: 'Frase curta logo abaixo do título. Evite promessas de resultado.' },
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagem Hero',
              admin: { description: 'Imagem horizontal de apoio. O site usa fallback institucional quando vazio.' },
            },
            { name: 'problemDescription', type: 'richText', required: false, label: 'Descrição do Problema' },
            { name: 'rightsExplanation', type: 'richText', required: false, label: 'Explicação dos Direitos' },
            { name: 'benefits', type: 'richText', required: false, label: 'Benefícios da Atuação Jurídica' },
            {
              name: 'socialProof',
              type: 'array',
              label: 'Prova Social',
              admin: { description: 'Use depoimentos anonimizados, iniciais ou recortes institucionais.' },
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
              admin: { description: 'Perguntas exibidas no final da landing page.' },
              fields: [
                { name: 'question', type: 'text', required: true, label: 'Pergunta' },
                { name: 'answer', type: 'textarea', required: true, label: 'Resposta' },
              ],
            },
          ],
        },
        {
          label: 'Conversão',
          description: 'Configurações de contato, urgência e formulário da campanha.',
          fields: [
            {
              name: 'whatsappMessage',
              type: 'text',
              label: 'Mensagem WhatsApp (pré-preenchida)',
              admin: { description: 'Mensagem inicial enviada quando o visitante clica no CTA da campanha.' },
            },
            {
              name: 'urgencyText',
              type: 'text',
              label: 'Texto de Urgência (barra topo)',
              admin: { description: 'Use com cuidado. Ex: Atendimento prioritário para casos com prazo em curso.' },
            },
            { name: 'showForm', type: 'checkbox', label: 'Exibir Formulário de Captação', defaultValue: true },
            {
              name: 'targetAudience',
              type: 'textarea',
              label: 'Público-Alvo',
              admin: { description: 'Descrição interna do público para tráfego pago, segmentação ou pauta comercial.' },
            },
          ],
        },
        {
          label: 'Redes Sociais',
          description: 'Assets e copy para distribuição da campanha fora do site.',
          fields: [
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagem Feed (1080x1080)',
              admin: { description: 'Imagem quadrada para posts de feed no Instagram/Facebook.' },
            },
            {
              name: 'storyImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagem Story/Reels (1080x1920)',
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
              admin: { description: 'Upload de vídeo curto até 60s. MP4 recomendado.' },
            },
            {
              name: 'socialCaption',
              type: 'textarea',
              label: 'Legenda para Redes Sociais',
              admin: { description: 'Texto pré-escrito para copiar e colar nos posts. Máx. aproximado: 2200 caracteres.' },
            },
            {
              name: 'socialHashtags',
              type: 'text',
              hasMany: true,
              label: 'Hashtags',
              admin: { description: 'Ex: #direitodigital, #licitacoes, #direitopenal' },
            },
            {
              name: 'colorAccent',
              type: 'select',
              label: 'Cor de Destaque (cards sociais)',
              options: [
                { label: 'Aço escovado (padrão CA)', value: 'gold' },
                { label: 'Vermelho (urgência)', value: 'red' },
                { label: 'Azul (institucional)', value: 'blue' },
                { label: 'Verde (positivo)', value: 'green' },
              ],
              defaultValue: 'gold',
            },
          ],
        },
        {
          label: 'SEO',
          description: 'Informações usadas em buscadores e compartilhamentos.',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              label: 'Meta Title',
              admin: { description: 'Título curto para Google e redes sociais.' },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              label: 'Meta Description',
              admin: { description: 'Resumo objetivo da campanha, idealmente até 160 caracteres.' },
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagem OpenGraph (1200x630)',
              admin: { description: 'Imagem de preview quando o link for compartilhado no WhatsApp, Telegram ou Facebook.' },
            },
          ],
        },
      ],
    },
  ],
}

import type { GlobalConfig } from 'payload'

export const SiteConfig: GlobalConfig = {
  slug: 'site-config',
  label: 'Configurações Gerais do Site',
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero (Topo)',
          fields: [
            { name: 'heroTitle', type: 'text', label: 'Título Principal', defaultValue: 'Seu direito, nossa missão.' },
            { name: 'heroSubtitle', type: 'textarea', label: 'Subtítulo' },
            { name: 'heroButtonText', type: 'text', label: 'Texto do Botão', defaultValue: 'Fale com um Advogado' },
          ],
        },
        {
          label: 'Números em Destaque',
          fields: [
            {
              name: 'trustBarStats',
              type: 'array',
              label: 'Estatísticas (máx 4)',
              maxRows: 4,
              fields: [
                { name: 'value', type: 'number', required: true, label: 'Valor' },
                { name: 'suffix', type: 'text', label: 'Sufixo (+, %)' },
                { name: 'label', type: 'text', required: true, label: 'Rótulo' },
              ],
            },
          ],
        },
        {
          label: 'Seção Criminal',
          fields: [
            { name: 'criminalTag', type: 'text', label: 'Tag', defaultValue: 'Defesa Criminal — Atendimento Imediato' },
            { name: 'criminalTitle', type: 'text', label: 'Título', defaultValue: 'Você não está sozinho.' },
            { name: 'criminalHighlight', type: 'text', label: 'Destaque (dourado)', defaultValue: 'Nós sabemos o que fazer.' },
            { name: 'criminalDescription', type: 'textarea', label: 'Descrição' },
          ],
        },
        {
          label: 'Seção Campanhas',
          fields: [
            { name: 'campaignsTitle', type: 'text', label: 'Título', defaultValue: 'Campanhas Jurídicas' },
            { name: 'campaignsSubtitle', type: 'textarea', label: 'Subtítulo' },
          ],
        },
        {
          label: 'Seção Depoimentos',
          fields: [
            { name: 'testimonialsTitle', type: 'text', label: 'Título', defaultValue: 'O que nossos clientes dizem' },
          ],
        },
        {
          label: 'Seção Notícias',
          fields: [
            { name: 'newsTitle', type: 'text', label: 'Título', defaultValue: 'Notícias do Direito' },
            { name: 'newsSubtitle', type: 'textarea', label: 'Subtítulo' },
          ],
        },
        {
          label: 'Seção Blog',
          fields: [
            { name: 'blogTitle', type: 'text', label: 'Título', defaultValue: 'Artigos Recentes' },
            { name: 'blogSubtitle', type: 'textarea', label: 'Subtítulo' },
          ],
        },
        {
          label: 'Página Sobre',
          fields: [
            { name: 'aboutTitle', type: 'text', label: 'Título', defaultValue: 'Sobre o Escritório' },
            { name: 'aboutSubtitle', type: 'textarea', label: 'Subtítulo' },
            { name: 'aboutHistory', type: 'textarea', label: 'Texto Nossa História' },
            {
              name: 'aboutTimeline',
              type: 'array',
              label: 'Timeline',
              fields: [
                { name: 'year', type: 'text', required: true, label: 'Ano' },
                { name: 'title', type: 'text', required: true, label: 'Título' },
                { name: 'description', type: 'textarea', required: true, label: 'Descrição' },
              ],
            },
            {
              name: 'aboutValues',
              type: 'array',
              label: 'Valores',
              maxRows: 6,
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea', required: true },
                { name: 'icon', type: 'select', options: [
                  { label: 'Balança', value: 'scale' },
                  { label: 'Pessoas', value: 'users' },
                  { label: 'Troféu', value: 'award' },
                  { label: 'Escudo', value: 'shield' },
                  { label: 'Coração', value: 'heart' },
                ]},
              ],
            },
          ],
        },
        {
          label: 'Página Áreas',
          fields: [
            { name: 'practiceTitle', type: 'text', label: 'Título', defaultValue: 'Áreas de Atuação' },
            { name: 'practiceSubtitle', type: 'textarea', label: 'Subtítulo' },
          ],
        },
        {
          label: 'Contato',
          fields: [
            { name: 'contactTitle', type: 'text', label: 'Título', defaultValue: 'Fale com nossa equipe' },
            { name: 'contactSubtitle', type: 'textarea', label: 'Subtítulo' },
            { name: 'contactEmail', type: 'text', label: 'E-mail', defaultValue: 'contato@cavalcantemelo.adv.br' },
            { name: 'contactPhone', type: 'text', label: 'Telefone', defaultValue: '(84) 99124-3985' },
            { name: 'contactAddress', type: 'textarea', label: 'Endereço' },
          ],
        },
      ],
    },
  ],
}

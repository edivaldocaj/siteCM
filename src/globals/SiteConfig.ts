import type { GlobalConfig } from 'payload'

export const SiteConfig: GlobalConfig = {
  slug: 'site-config',
  label: 'Configurações Gerais (Textos)',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Início (Topo do Site)',
          fields: [
            { name: 'heroTitle', type: 'text', label: 'Título Principal', defaultValue: 'Defesa Especializada e Estratégica' },
            { name: 'heroSubtitle', type: 'textarea', label: 'Subtítulo', defaultValue: 'Atuação ágil e combativa na proteção do seu patrimônio, liberdade e direitos.' },
            { name: 'heroButtonText', type: 'text', label: 'Texto do Botão', defaultValue: 'Falar com Especialista' },
          ],
        },
        {
          label: 'Números em Destaque (Barra de Confiança)',
          fields: [
            {
              name: 'trustBarStats',
              type: 'array',
              label: 'Estatísticas',
              maxRows: 4,
              fields: [
                { name: 'value', type: 'number', required: true, label: 'Valor Numérico' },
                { name: 'suffix', type: 'text', label: 'Sufixo (+, %, etc)', defaultValue: '' },
                { name: 'label', type: 'text', required: true, label: 'Rótulo' },
              ],
            },
          ],
        },
        {
          label: 'Página: Sobre Nós',
          fields: [
            { name: 'aboutTitle', type: 'text', label: 'Título Principal', defaultValue: 'Sobre o Escritório' },
            { name: 'aboutSubtitle', type: 'textarea', label: 'Subtítulo', defaultValue: 'Advocacia estratégica e humanizada, construída sobre os pilares da ética, proximidade e busca por resultados concretos.' },
            { name: 'aboutHistory', type: 'textarea', label: 'Texto "Nossa História"', defaultValue: 'A Cavalcante & Melo Sociedade de Advogados nasceu em 2025 com a missão de oferecer advocacia de excelência em Natal/RN.' },
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
              label: 'Nossos Valores',
              maxRows: 6,
              fields: [
                { name: 'title', type: 'text', required: true, label: 'Valor' },
                { name: 'description', type: 'textarea', required: true, label: 'Descrição' },
                { name: 'icon', type: 'select', label: 'Ícone', options: [
                  { label: 'Balança (Ética)', value: 'scale' },
                  { label: 'Pessoas (Proximidade)', value: 'users' },
                  { label: 'Troféu (Resultado)', value: 'award' },
                  { label: 'Escudo (Proteção)', value: 'shield' },
                  { label: 'Coração (Acolhimento)', value: 'heart' },
                  { label: 'Estrela (Excelência)', value: 'star' },
                ]},
              ],
            },
          ],
        },
        {
          label: 'Página: Áreas de Atuação',
          fields: [
            { name: 'practiceTitle', type: 'text', label: 'Título Principal', defaultValue: 'Áreas de Atuação' },
            { name: 'practiceSubtitle', type: 'textarea', label: 'Subtítulo', defaultValue: 'Atuação estratégica em diversas áreas do Direito, com foco na defesa dos seus interesses e na busca por resultados concretos.' },
          ],
        },
        {
          label: 'Dados de Contato (Rodapé e Página de Contato)',
          fields: [
            { name: 'contactTitle', type: 'text', label: 'Título de Contato', defaultValue: 'Fale com nossa equipe' },
            { name: 'contactSubtitle', type: 'textarea', label: 'Subtítulo de Contato', defaultValue: 'Estamos prontos para analisar o seu caso e propor a melhor estratégia jurídica.' },
            { name: 'contactEmail', type: 'text', label: 'E-mail Oficial', defaultValue: 'contato@cavalcantemelo.adv.br' },
            { name: 'contactPhone', type: 'text', label: 'Telefone Principal', defaultValue: '(84) 99999-9999' },
            { name: 'contactAddress', type: 'textarea', label: 'Endereço Físico', defaultValue: 'Rua Francisco Maia Sobrinho, 1950\nLagoa Nova — Natal/RN' },
          ],
        },
      ],
    },
  ],
}

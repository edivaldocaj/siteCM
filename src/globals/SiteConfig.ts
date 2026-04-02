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
            { name: 'aboutTitle', type: 'text', label: 'Título Principal', defaultValue: 'Nossa História e Valores' },
            { name: 'aboutSubtitle', type: 'textarea', label: 'Subtítulo', defaultValue: 'Comprometimento absoluto com a excelência jurídica e a defesa intransigente dos direitos dos nossos clientes.' },
            { name: 'aboutContent', type: 'richText', label: 'Conteúdo da Página (Texto Completo)' },
          ]
        },
        {
          label: 'Página: Áreas de Atuação',
          fields: [
            { name: 'practiceTitle', type: 'text', label: 'Título Principal', defaultValue: 'Nossas Especialidades' },
            { name: 'practiceSubtitle', type: 'textarea', label: 'Subtítulo', defaultValue: 'Especialistas nas áreas mais complexas do Direito, oferecendo soluções jurídicas inovadoras e seguras.' },
          ]
        },
        {
          label: 'Dados de Contato (Rodapé e Página de Contato)',
          fields: [
            { name: 'contactTitle', type: 'text', label: 'Título de Contato', defaultValue: 'Fale com nossa equipe' },
            { name: 'contactSubtitle', type: 'textarea', label: 'Subtítulo de Contato', defaultValue: 'Estamos prontos para analisar o seu caso e propor a melhor estratégia jurídica.' },
            { name: 'contactEmail', type: 'text', label: 'E-mail Oficial', defaultValue: 'contato@cavalcantemelo.com.br' },
            { name: 'contactPhone', type: 'text', label: 'Telefone Principal', defaultValue: '(84) 99999-9999' },
            { name: 'contactAddress', type: 'textarea', label: 'Endereço Físico', defaultValue: 'Av. Prudente de Morais, 1234 - Natal/RN' },
          ]
        },
      ]
    }
  ],
}
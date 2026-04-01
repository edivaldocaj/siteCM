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
          label: 'Dados de Contato (Rodapé e Página)',
          fields: [
            { name: 'contactEmail', type: 'text', label: 'E-mail Oficial', defaultValue: 'contato@cavalcantemelo.com.br' },
            { name: 'contactPhone', type: 'text', label: 'Telefone Principal', defaultValue: '(84) 99999-9999' },
            { name: 'contactAddress', type: 'textarea', label: 'Endereço Físico', defaultValue: 'Av. Prudente de Morais, 1234 - Natal/RN' },
          ]
        },
      ]
    }
  ],
}
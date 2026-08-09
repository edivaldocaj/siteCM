import type { GlobalConfig } from 'payload'
import { adminOnly, anyone } from '../access'

export const SiteConfig: GlobalConfig = {
  slug: 'site-config',
  label: 'ConfiguraÃ§Ãµes Gerais do Site',
  access: { read: anyone, update: adminOnly },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero (Topo)',
          fields: [
            { name: 'heroTitle', type: 'text', label: 'TÃ­tulo Principal', defaultValue: 'Seu direito, nossa missÃ£o.' },
            { name: 'heroSubtitle', type: 'textarea', label: 'SubtÃ­tulo' },
            { name: 'heroButtonText', type: 'text', label: 'Texto do BotÃ£o', defaultValue: 'Fale com um Advogado' },
          ],
        },
        {
          label: 'NÃºmeros em Destaque',
          fields: [
            {
              name: 'trustBarStats',
              type: 'array',
              label: 'EstatÃ­sticas (mÃ¡x 4)',
              maxRows: 4,
              fields: [
                { name: 'value', type: 'number', required: true, label: 'Valor' },
                { name: 'suffix', type: 'text', label: 'Sufixo (+, %)' },
                { name: 'label', type: 'text', required: true, label: 'RÃ³tulo' },
              ],
            },
          ],
        },
        {
          label: 'SeÃ§Ã£o Criminal',
          fields: [
            { name: 'criminalTag', type: 'text', label: 'Tag', defaultValue: 'Defesa Criminal â€” Atendimento Imediato' },
            { name: 'criminalTitle', type: 'text', label: 'TÃ­tulo', defaultValue: 'VocÃª nÃ£o estÃ¡ sozinho.' },
            { name: 'criminalHighlight', type: 'text', label: 'Destaque (dourado)', defaultValue: 'NÃ³s sabemos o que fazer.' },
            { name: 'criminalDescription', type: 'textarea', label: 'DescriÃ§Ã£o' },
          ],
        },
        {
          label: 'SeÃ§Ã£o Campanhas',
          fields: [
            { name: 'campaignsTitle', type: 'text', label: 'TÃ­tulo', defaultValue: 'Campanhas JurÃ­dicas' },
            { name: 'campaignsSubtitle', type: 'textarea', label: 'SubtÃ­tulo' },
          ],
        },
        {
          label: 'SeÃ§Ã£o Depoimentos',
          fields: [
            { name: 'testimonialsTitle', type: 'text', label: 'TÃ­tulo', defaultValue: 'O que nossos clientes dizem' },
          ],
        },
        {
          label: 'SeÃ§Ã£o NotÃ­cias',
          fields: [
            { name: 'newsTitle', type: 'text', label: 'TÃ­tulo', defaultValue: 'NotÃ­cias do Direito' },
            { name: 'newsSubtitle', type: 'textarea', label: 'SubtÃ­tulo' },
          ],
        },
        {
          label: 'SeÃ§Ã£o Blog',
          fields: [
            { name: 'blogTitle', type: 'text', label: 'TÃ­tulo', defaultValue: 'Artigos Recentes' },
            { name: 'blogSubtitle', type: 'textarea', label: 'SubtÃ­tulo' },
          ],
        },
        {
          label: 'PÃ¡gina Sobre',
          fields: [
            { name: 'aboutTitle', type: 'text', label: 'TÃ­tulo', defaultValue: 'Sobre o EscritÃ³rio' },
            { name: 'aboutSubtitle', type: 'textarea', label: 'SubtÃ­tulo' },
            { name: 'aboutHistory', type: 'textarea', label: 'Texto Nossa HistÃ³ria' },
            {
              name: 'aboutTimeline',
              type: 'array',
              label: 'Timeline',
              fields: [
                { name: 'year', type: 'text', required: true, label: 'Ano' },
                { name: 'title', type: 'text', required: true, label: 'TÃ­tulo' },
                { name: 'description', type: 'textarea', required: true, label: 'DescriÃ§Ã£o' },
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
                  { label: 'BalanÃ§a', value: 'scale' },
                  { label: 'Pessoas', value: 'users' },
                  { label: 'TrofÃ©u', value: 'award' },
                  { label: 'Escudo', value: 'shield' },
                  { label: 'CoraÃ§Ã£o', value: 'heart' },
                ]},
              ],
            },
          ],
        },
        {
          label: 'PÃ¡gina Ãreas',
          fields: [
            { name: 'practiceTitle', type: 'text', label: 'TÃ­tulo', defaultValue: 'Ãreas de AtuaÃ§Ã£o' },
            { name: 'practiceSubtitle', type: 'textarea', label: 'SubtÃ­tulo' },
          ],
        },
        {
          label: 'Contato',
          fields: [
            { name: 'contactTitle', type: 'text', label: 'TÃ­tulo', defaultValue: 'Fale com nossa equipe' },
            { name: 'contactSubtitle', type: 'textarea', label: 'SubtÃ­tulo' },
            { name: 'contactEmail', type: 'text', label: 'E-mail', defaultValue: 'contato@cavalcantealbuquerque.com.br' },
            { name: 'contactPhone', type: 'text', label: 'Telefone', defaultValue: '(84) 99124-3985' },
            { name: 'contactAddress', type: 'textarea', label: 'EndereÃ§o' },
          ],
        },
      ],
    },
  ],
}


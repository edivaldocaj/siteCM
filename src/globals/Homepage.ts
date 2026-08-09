import type { GlobalConfig } from 'payload'
import { adminOnly, anyone } from '../access'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'PÃ¡gina Inicial (GestÃ£o)',
  access: { read: anyone, update: adminOnly },
  fields: [
    {
      name: 'aboutPartners',
      type: 'group',
      label: 'Sessao: Equipe',
      fields: [
        { name: 'sectionTitle', type: 'text', defaultValue: 'Quem conduz o seu caso', label: 'TÃ­tulo da SessÃ£o' },
        { name: 'sectionDescription', type: 'textarea', defaultValue: 'Profissionais comprometidos com a excelÃªncia, Ã©tica e resultados para nossos clientes.', label: 'SubtÃ­tulo' },
        {
          name: 'partnersList',
          type: 'array',
          label: 'Lista de Advogados',
          fields: [
            { name: 'name', type: 'text', required: true, label: 'Nome completo' },
            { name: 'role', type: 'text', required: true, label: 'Cargo' },
            { name: 'areas', type: 'text', label: 'Ãreas de AtuaÃ§Ã£o (separar por vÃ­rgula)' },
            { name: 'oab', type: 'text', label: 'InscriÃ§Ã£o OAB' },
            { name: 'bio', type: 'textarea', label: 'Biografia' },
            { name: 'photo', type: 'upload', relationTo: 'media', label: 'Foto (opcional â€” sem foto mostra iniciais)' },
          ],
        },
      ],
    },
  ],
}


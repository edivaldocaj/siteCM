import type { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Página Inicial (Gestão)',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'aboutPartners',
      type: 'group',
      label: 'Sessão: Sobre os Sócios',
      fields: [
        { name: 'sectionTitle', type: 'text', defaultValue: 'Nossos Sócios', label: 'Título da Sessão' },
        { name: 'sectionDescription', type: 'textarea', defaultValue: 'Conheça os especialistas à frente do Cavalcante & Melo.', label: 'Subtítulo da Sessão' },
        {
          name: 'partnersList',
          type: 'array',
          label: 'Lista de Advogados',
          fields: [
            { name: 'name', type: 'text', required: true, label: 'Nome Completo (ex: Dr. Edivaldo Cavalcante)' },
            { name: 'role', type: 'text', required: true, label: 'Cargo / Áreas (separar por vírgula)' },
            { name: 'oab', type: 'text', label: 'Inscrição OAB (ex: OAB/RN 12345)' },
            { name: 'bio', type: 'textarea', label: 'Biografia' },
            { name: 'photo', type: 'upload', relationTo: 'media', label: 'Foto do Advogado (opcional — se vazio, mostra iniciais)' },
          ],
        },
      ],
    },
  ],
}
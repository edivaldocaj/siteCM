import type { GlobalConfig } from 'payload'
import { adminOnly, anyone } from '../access'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Página Inicial (Gestão)',
  access: { read: anyone, update: adminOnly },
  fields: [
    {
      name: 'aboutPartners',
      type: 'group',
      label: 'Sessao: Equipe',
      fields: [
        { name: 'sectionTitle', type: 'text', defaultValue: 'Quem conduz o seu caso', label: 'Título da Sessão' },
        { name: 'sectionDescription', type: 'textarea', defaultValue: 'Profissionais comprometidos com a excelência, ética e resultados para nossos clientes.', label: 'Subtítulo' },
        {
          name: 'partnersList',
          type: 'array',
          label: 'Lista de Advogados',
          fields: [
            { name: 'name', type: 'text', required: true, label: 'Nome completo' },
            { name: 'role', type: 'text', required: true, label: 'Cargo' },
            { name: 'areas', type: 'text', label: 'Áreas de Atuação (separar por vírgula)' },
            { name: 'oab', type: 'text', label: 'Inscrição OAB' },
            { name: 'bio', type: 'textarea', label: 'Biografia' },
            { name: 'photo', type: 'upload', relationTo: 'media', label: 'Foto (opcional — sem foto mostra iniciais)' },
          ],
        },
      ],
    },
  ],
}


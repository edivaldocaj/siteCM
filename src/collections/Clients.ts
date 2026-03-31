iimport type { CollectionConfig } from 'payload'

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'cpf', 'accessToken', 'active'],
    description: 'Clientes com acesso ao portal de acompanhamento processual.',
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Nome Completo' },
    // CORREÇÃO: Descrição atualizada e validação flexível
    { name: 'cpf', type: 'text', required: true, label: 'CPF', admin: { description: 'Pode conter pontos e traços (ex: 123.456.789-00)' } },
    { name: 'email', type: 'email', label: 'E-mail' },
    { name: 'phone', type: 'text', label: 'Telefone / WhatsApp' },
    {
      name: 'processes',
      type: 'array',
      label: 'Processos',
      fields: [
        { name: 'processNumber', type: 'text', required: true, label: 'Número do Processo (CNJ)', admin: { description: 'Formato: NNNNNNN-DD.AAAA.J.TR.OOOO' } },
        { name: 'tribunal', type: 'select', label: 'Tribunal', options: [
          { label: 'TJRN', value: 'tjrn' },
          { label: 'TRT 21ª Região', value: 'trt21' },
          { label: 'TRF 5ª Região', value: 'trf5' },
          { label: 'STJ', value: 'stj' },
          { label: 'STF', value: 'stf' },
          { label: 'Outro', value: 'outro' },
        ]},
        { name: 'description', type: 'text', label: 'Descrição / Tipo de Ação' },
        { name: 'attorney', type: 'select', label: 'Advogado Responsável', options: [
          { label: 'Dr. Edivaldo Cavalcante', value: 'edivaldo' },
          { label: 'Dra. Gabrielly Melo', value: 'gabrielly' },
        ]},
      ],
    },
    { name: 'accessToken', type: 'text', required: true, unique: true, label: 'Token de Acesso', admin: { description: 'Token único para o cliente acessar o portal. Gere automaticamente ou defina manualmente.', position: 'sidebar' } },
    { name: 'active', type: 'checkbox', label: 'Acesso Ativo', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'notes', type: 'textarea', label: 'Observações Internas' },
  ],
}
import type { GlobalConfig } from 'payload'
import { adminOnly, anyone } from '../access'

export const BrandConfig: GlobalConfig = {
  slug: 'brand-config',
  label: 'Identidade Institucional',
  access: { read: anyone, update: adminOnly },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identidade',
          fields: [
            { name: 'tradeName', type: 'text', label: 'Nome fantasia', defaultValue: 'Cavalcante Albuquerque', required: true },
            { name: 'descriptor', type: 'text', label: 'Descritor', defaultValue: 'Advocacia e Consultoria', required: true },
            { name: 'legalName', type: 'text', label: 'Razao social', defaultValue: '__PENDENTE__', required: true },
            { name: 'cnpj', type: 'text', label: 'CNPJ', defaultValue: '__PENDENTE__', required: true },
            { name: 'oabRegistration', type: 'text', label: 'Registro OAB/RN da sociedade', defaultValue: '__PENDENTE__', required: true },
            { name: 'founderName', type: 'text', label: 'Titular', defaultValue: '__PENDENTE__', required: true },
            { name: 'foundedYear', type: 'text', label: 'Ano de fundacao', defaultValue: '__PENDENTE__' },
            { name: 'tagline', type: 'text', label: 'Tagline', defaultValue: 'Advocacia com estrategia e solidez.', required: true },
            { name: 'domain', type: 'text', label: 'Dominio', defaultValue: 'cavalcantealbuquerque.com.br', required: true },
            { name: 'logoLight', type: 'upload', relationTo: 'media', label: 'Logo claro' },
            { name: 'logoDark', type: 'upload', relationTo: 'media', label: 'Logo escuro' },
            { name: 'symbol', type: 'upload', relationTo: 'media', label: 'Simbolo' },
            { name: 'ogDefault', type: 'upload', relationTo: 'media', label: 'Imagem OG padrao' },
            { name: 'favicon', type: 'upload', relationTo: 'media', label: 'Favicon' },
          ],
        },
        {
          label: 'Contato',
          fields: [
            { name: 'email', type: 'text', label: 'E-mail', defaultValue: '__PENDENTE__' },
            { name: 'phone', type: 'text', label: 'Telefone', defaultValue: '__PENDENTE__' },
            { name: 'whatsapp', type: 'text', label: 'WhatsApp', defaultValue: '__PENDENTE__' },
            { name: 'whatsappDefaultMessage', type: 'textarea', label: 'Mensagem padrao do WhatsApp', defaultValue: 'Ola, gostaria de atendimento juridico.' },
            { name: 'addressStreet', type: 'text', label: 'Logradouro', defaultValue: '__PENDENTE__' },
            { name: 'addressDistrict', type: 'text', label: 'Bairro', defaultValue: '__PENDENTE__' },
            { name: 'addressCity', type: 'text', label: 'Cidade', defaultValue: 'Natal' },
            { name: 'addressState', type: 'text', label: 'Estado', defaultValue: 'RN' },
            { name: 'addressZip', type: 'text', label: 'CEP', defaultValue: '__PENDENTE__' },
            { name: 'latitude', type: 'number', label: 'Latitude' },
            { name: 'longitude', type: 'number', label: 'Longitude' },
            {
              name: 'businessHours',
              type: 'array',
              label: 'Horario de funcionamento',
              fields: [
                { name: 'day', type: 'text', label: 'Dia', required: true },
                { name: 'opensAt', type: 'text', label: 'Abre' },
                { name: 'closesAt', type: 'text', label: 'Fecha' },
              ],
            },
            { name: 'emergencyLine', type: 'text', label: 'Linha de emergencia', defaultValue: '__PENDENTE__' },
            { name: 'emergencyLabel', type: 'text', label: 'Rotulo de emergencia', defaultValue: 'Plantao criminal 24h' },
          ],
        },
        {
          label: 'Redes',
          fields: [
            { name: 'instagram', type: 'text', label: 'Instagram' },
            { name: 'linkedin', type: 'text', label: 'LinkedIn' },
            { name: 'facebook', type: 'text', label: 'Facebook' },
            { name: 'youtube', type: 'text', label: 'YouTube' },
            { name: 'googleBusiness', type: 'text', label: 'Google Business' },
          ],
        },
        {
          label: 'Juridico / LGPD',
          fields: [
            { name: 'privacyPolicy', type: 'richText', label: 'Politica de privacidade' },
            { name: 'termsOfUse', type: 'richText', label: 'Termos de uso' },
            { name: 'cookiePolicy', type: 'richText', label: 'Politica de cookies' },
            { name: 'dpoName', type: 'text', label: 'Encarregado de dados', defaultValue: '__PENDENTE__' },
            { name: 'dpoEmail', type: 'text', label: 'E-mail do encarregado', defaultValue: '__PENDENTE__' },
            {
              name: 'oabDisclaimer',
              type: 'textarea',
              label: 'Aviso OAB',
              defaultValue: 'Informacoes de carater exclusivamente informativo, sem promessa de resultado e conforme o Codigo de Etica e Disciplina da OAB.',
            },
          ],
        },
      ],
    },
  ],
}
import type { CollectionConfig } from 'payload'

export const Jurisprudence: CollectionConfig = {
  slug: 'jurisprudence',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'court', 'category', 'caseNumber', 'decisionDate'],
    description: 'Banco de precedentes (TST, STJ, TJRN) curado manualmente para uso nas minutas com IA.',
    group: 'Escritório',
    listSearchableFields: ['title', 'caseNumber', 'summary'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Título / Ementa Resumida' },
    {
      type: 'row',
      fields: [
        {
          name: 'court',
          type: 'select',
          required: true,
          label: 'Tribunal',
          options: [
            { label: 'STF', value: 'stf' },
            { label: 'STJ', value: 'stj' },
            { label: 'TST', value: 'tst' },
            { label: 'TJRN', value: 'tjrn' },
            { label: 'TRT 21ª', value: 'trt21' },
            { label: 'TRF 5ª', value: 'trf5' },
            { label: 'Outro', value: 'other' },
          ],
        },
        { name: 'caseNumber', type: 'text', label: 'Número do Processo / Recurso' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'select',
          label: 'Categoria',
          options: [
            { label: 'Consumidor / Cível', value: 'consumidor' },
            { label: 'Digital / LGPD', value: 'digital' },
            { label: 'Criminal', value: 'criminal' },
            { label: 'Imobiliário', value: 'imobiliario' },
            { label: 'Tributário', value: 'tributario' },
            { label: 'Trabalhista', value: 'trabalhista' },
            { label: 'Administrativo', value: 'administrativo' },
          ],
        },
        {
          name: 'decisionDate',
          type: 'date',
          label: 'Data da Decisão',
        },
      ],
    },
    { name: 'summary', type: 'textarea', required: true, label: 'Resumo / Ementa' },
    { name: 'fullText', type: 'textarea', label: 'Inteiro Teor (ou trecho relevante)' },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      label: 'Tags / Palavras-chave',
      admin: { description: 'Ex: negativação indevida, dano moral, repetição de indébito' },
    },
    {
      name: 'relevance',
      type: 'select',
      label: 'Relevância',
      defaultValue: 'medium',
      options: [
        { label: '⭐ Essencial (citar sempre)', value: 'essential' },
        { label: '🔵 Alta', value: 'high' },
        { label: '🟡 Média', value: 'medium' },
        { label: '⚪ Referência', value: 'reference' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}

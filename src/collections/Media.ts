import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    // RESOLVE O CAMINHO ABSOLUTO PARA A PASTA PUBLIC DO NEXT.JS
    staticDir: path.resolve(dirname, '../../public/media'),
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 512, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
    ],
  },
  admin: { useAsTitle: 'alt' },
  fields: [
    { name: 'alt', type: 'text', required: true, label: 'Texto Alternativo' },
  ],
}
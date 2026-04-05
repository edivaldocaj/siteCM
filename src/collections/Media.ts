import type { CollectionConfig } from 'payload'
import path from 'path'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: path.resolve(process.cwd(), 'public/media'),
    mimeTypes: ['image/*', 'application/pdf', 'video/mp4', 'video/webm'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 512, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
      { name: 'ogImage', width: 1200, height: 630, position: 'centre' },
      { name: 'feedSquare', width: 1080, height: 1080, position: 'centre' },
      { name: 'story', width: 1080, height: 1920, position: 'centre' },
    ],
  },
  admin: { useAsTitle: 'alt' },
  fields: [
    { name: 'alt', type: 'text', required: true, label: 'Texto Alternativo' },
  ],
}

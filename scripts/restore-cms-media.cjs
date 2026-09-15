const fs = require('node:fs')
const path = require('node:path')

const publicDir = path.resolve(process.cwd(), 'public')
const mediaDir = path.join(publicDir, 'media')
const brandDir = path.join(publicDir, 'brand')

// Arquivos já referenciados por registros do CMS inicial. A cópia só ocorre
// quando a mídia não existe — uploads feitos pelo CMS nunca são sobrescritos.
const defaults = [
  ['office-room.webp', 'office-room.webp'],
  ['office-door.webp', 'office-door.webp'],
  ['og-default.jpg', 'og-default.jpg'],
]

fs.mkdirSync(mediaDir, { recursive: true })
for (const [mediaFile, brandFile] of defaults) {
  const destination = path.join(mediaDir, mediaFile)
  const source = path.join(brandDir, brandFile)
  if (!fs.existsSync(destination) && fs.existsSync(source)) fs.copyFileSync(source, destination)
}

console.log('CMS media defaults verified')

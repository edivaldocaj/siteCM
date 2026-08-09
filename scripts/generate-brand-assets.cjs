const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const root = process.cwd()
const brandSrc = 'D:/siteCM-main/brand'
const out = path.join(root, 'public', 'brand')
const app = path.join(root, 'src', 'app')

function p(...parts) {
  return path.join(...parts)
}

async function icoFromPngs(sizes, file) {
  const images = await Promise.all(
    sizes.map(async (size) => ({
      size,
      buf: await sharp(p(out, 'symbol-mono-dark.svg')).resize(size, size).png().toBuffer(),
    })),
  )

  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)

  let offset = 6 + images.length * 16
  const dirs = []
  for (const img of images) {
    const dir = Buffer.alloc(16)
    dir.writeUInt8(img.size === 256 ? 0 : img.size, 0)
    dir.writeUInt8(img.size === 256 ? 0 : img.size, 1)
    dir.writeUInt8(0, 2)
    dir.writeUInt8(0, 3)
    dir.writeUInt16LE(1, 4)
    dir.writeUInt16LE(32, 6)
    dir.writeUInt32LE(img.buf.length, 8)
    dir.writeUInt32LE(offset, 12)
    offset += img.buf.length
    dirs.push(dir)
  }

  fs.writeFileSync(file, Buffer.concat([header, ...dirs, ...images.map((img) => img.buf)]))
}

async function main() {
  fs.mkdirSync(out, { recursive: true })

  const symbol = fs.readFileSync(p(root, '.codex-specs', 'ca-symbol.svg'), 'utf8')
  fs.writeFileSync(p(out, 'symbol.svg'), symbol)
  fs.writeFileSync(p(app, 'icon.svg'), symbol)
  fs.writeFileSync(
    p(out, 'symbol-mono-light.svg'),
    symbol
      .replace(/fill="url\(#ca-[^)]+\)"/g, 'fill="#EEF1F4"')
      .replace(/stroke="url\(#ca-edge\)"/g, 'stroke="#EEF1F4"'),
  )
  fs.writeFileSync(
    p(out, 'symbol-mono-dark.svg'),
    symbol
      .replace(/fill="url\(#ca-[^)]+\)"/g, 'fill="#011536"')
      .replace(/stroke="url\(#ca-edge\)"/g, 'stroke="#011536"'),
  )

  await sharp(p(brandSrc, 'logmarca.png')).png().toFile(p(out, 'lockup-light.png'))
  await sharp(p(brandSrc, 'logmarca.png')).webp({ quality: 86 }).toFile(p(out, 'lockup-light.webp'))
  await sharp(p(brandSrc, 'logomarca branca.png')).png().toFile(p(out, 'lockup-dark.png'))
  await sharp(p(brandSrc, 'logomarca branca.png')).webp({ quality: 86 }).toFile(p(out, 'lockup-dark.webp'))

  for (const name of ['lockup-light', 'lockup-dark']) {
    fs.writeFileSync(
      p(out, `${name}.svg`),
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2508 627" role="img" aria-label="Cavalcante Albuquerque"><title>Cavalcante Albuquerque</title><image href="/brand/${name}.png" width="2508" height="627" preserveAspectRatio="xMidYMid meet"/></svg>`,
    )
  }

  await sharp(p(brandSrc, 'logo111.png')).resize(180, 180, { fit: 'cover' }).png().toFile(p(app, 'apple-icon.png'))
  await sharp(p(brandSrc, 'logo111.png')).resize(192, 192, { fit: 'cover' }).png().toFile(p(out, 'icon-192.png'))
  await sharp(p(brandSrc, 'logo111.png')).resize(512, 512, { fit: 'cover' }).png().toFile(p(out, 'icon-512.png'))
  await sharp(p(brandSrc, 'logo111.png')).resize(512, 512, { fit: 'cover' }).png().toFile(p(out, 'icon-maskable-512.png'))
  await sharp(p(brandSrc, 'log.png')).resize(1024, 1024, { fit: 'cover' }).png().toFile(p(out, 'icon-square.png'))
  await sharp(p(brandSrc, 'logo mini.png')).resize(1024, 1024, { fit: 'cover' }).png().toFile(p(out, 'icon-round.png'))

  await sharp(p(brandSrc, 'marca.png')).resize(720, null).png().toFile(p(out, 'pattern-watermark.png'))
  await sharp(p(brandSrc, 'marca 1.png')).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 82 }).toFile(p(out, 'og-default.jpg'))
  await sharp(p(brandSrc, 'marca 2.png')).resize(1600, 900, { fit: 'cover' }).jpeg({ quality: 84 }).toFile(p(out, 'cover-contato.jpg'))
  await sharp(p(brandSrc, 'marca 2.png')).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 82 }).toFile(p(out, 'cover-contato-og.jpg'))
  await sharp(p(brandSrc, 'areas atuacao.png')).resize(1600, 900, { fit: 'cover' }).jpeg({ quality: 84 }).toFile(p(out, 'cover-areas.jpg'))
  await sharp(p(brandSrc, 'areas atuacao.png')).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 82 }).toFile(p(out, 'cover-areas-og.jpg'))

  fs.copyFileSync(p(out, 'og-default.jpg'), p(app, 'opengraph-image.jpg'))
  fs.copyFileSync(p(out, 'og-default.jpg'), p(app, 'twitter-image.jpg'))
  await icoFromPngs([16, 32, 48], p(app, 'favicon.ico'))

  const manifest = {
    name: 'Cavalcante Albuquerque',
    short_name: 'Cavalcante Albuquerque',
    description: 'Advocacia e Consultoria em Natal/RN',
    start_url: '/',
    display: 'standalone',
    background_color: '#F8F6F4',
    theme_color: '#011536',
    icons: [
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/brand/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
  fs.writeFileSync(p(root, 'public', 'manifest.webmanifest'), `${JSON.stringify(manifest, null, 2)}\n`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
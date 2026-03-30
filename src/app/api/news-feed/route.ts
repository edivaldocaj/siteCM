import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const RSS_SOURCES = [
  { url: 'https://www.conjur.com.br/rss.xml', name: 'Conjur' },
  { url: 'https://www.migalhas.com.br/rss/quentes', name: 'Migalhas' },
]

const GOOGLE_NEWS_QUERIES = [
  { query: 'direito consumidor Brasil', category: 'direito-consumidor' },
  { query: 'LGPD proteção dados', category: 'lgpd' },
  { query: 'direito penal criminal Brasil', category: 'direito-penal' },
  { query: 'direito imobiliário usucapião', category: 'direito-imobiliario' },
  { query: 'STJ STF jurisprudência', category: 'direito-tributario' },
]

function categorize(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('lgpd') || t.includes('dados') || t.includes('digital') || t.includes('cyber') || t.includes('anpd')) return 'lgpd'
  if (t.includes('consumidor') || t.includes('banco') || t.includes('negativação') || t.includes('indenização') || t.includes('juros')) return 'direito-consumidor'
  if (t.includes('penal') || t.includes('preso') || t.includes('habeas') || t.includes('crime') || t.includes('criminal')) return 'direito-penal'
  if (t.includes('imobiliário') || t.includes('usucapião') || t.includes('imóvel') || t.includes('fundiária')) return 'direito-imobiliario'
  if (t.includes('tributário') || t.includes('fiscal') || t.includes('imposto') || t.includes('tributo')) return 'direito-tributario'
  if (t.includes('licitação') || t.includes('contrato administrativo') || t.includes('tce') || t.includes('tcu')) return 'licitacoes'
  return 'geral'
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 80)
}

async function fetchRSS(url: string): Promise<any[]> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
    if (!res.ok) return []
    const text = await res.text()
    const items: any[] = []
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match
    while ((match = itemRegex.exec(text)) !== null) {
      const item = match[1]
      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]>|<title>(.*?)<\/title>/)?.[1] || item.match(/<title>(.*?)<\/title>/)?.[1] || ''
      const link = item.match(/<link>(.*?)<\/link>/)?.[1] || ''
      const desc = item.match(/<description><!\[CDATA\[(.*?)\]\]>|<description>(.*?)<\/description>/)?.[1] || ''
      if (title) items.push({ title: title.trim(), link: link.trim(), description: desc.trim().substring(0, 300) })
    }
    return items.slice(0, 5)
  } catch {
    return []
  }
}

async function fetchGoogleNews(query: string): Promise<any[]> {
  try {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
    if (!res.ok) return []
    const text = await res.text()
    const items: any[] = []
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match
    while ((match = itemRegex.exec(text)) !== null) {
      const item = match[1]
      const title = item.match(/<title>(.*?)<\/title>/)?.[1] || ''
      const link = item.match(/<link>(.*?)<\/link>/)?.[1] || ''
      const source = item.match(/<source.*?>(.*?)<\/source>/)?.[1] || 'Google News'
      if (title) items.push({ title: title.trim(), link: link.trim(), source: source.trim() })
    }
    return items.slice(0, 3)
  } catch {
    return []
  }
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const secret = process.env.NEWS_REVALIDATE_SECRET || 'cm2026admin'

  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let allArticles: any[] = []

  // Fetch RSS
  for (const source of RSS_SOURCES) {
    const items = await fetchRSS(source.url)
    allArticles.push(...items.map(item => ({
      title: item.title,
      sourceUrl: item.link,
      source: source.name,
      excerpt: item.description || item.title,
      category: categorize(item.title),
    })))
  }

  // Fetch Google News
  for (const gn of GOOGLE_NEWS_QUERIES) {
    const items = await fetchGoogleNews(gn.query)
    allArticles.push(...items.map(item => ({
      title: item.title,
      sourceUrl: item.link,
      source: item.source || 'Google News',
      excerpt: item.title,
      category: gn.category,
    })))
  }

  const fetched = allArticles.length
  let saved = 0

  try {
    const payload = await getPayload({ config: configPromise })

    for (const article of allArticles) {
      const slug = slugify(article.title)
      if (!slug) continue

      try {
        const existing = await (payload as any).find({
          collection: 'news-articles',
          where: { slug: { equals: slug } },
          limit: 1,
        })

        if (existing.docs.length === 0) {
          await (payload as any).create({
            collection: 'news-articles',
            data: {
              title: article.title.substring(0, 200),
              slug,
              excerpt: (article.excerpt || article.title).substring(0, 300),
              sourceUrl: article.sourceUrl,
              source: article.source,
              category: article.category,
              status: 'pending',
              autoImported: true,
              publishedAt: new Date().toISOString(),
            },
          })
          saved++
        }
      } catch (e) {
        // Skip duplicates or invalid entries
      }
    }

    return NextResponse.json({ success: true, fetched, saved })
  } catch (e) {
    console.error('[News Feed] Payload error:', e)
    return NextResponse.json({ success: false, error: 'CMS not available', fetched }, { status: 500 })
  }
}

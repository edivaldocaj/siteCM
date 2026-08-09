import { createHash } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { requireAdminRole } from '@/lib/admin-auth'
import { getBearerToken, getRequiredSecret, safeCompare } from '@/lib/secrets'

const RSS_SOURCES = [
  { url: 'https://www.conjur.com.br/rss.xml', name: 'Conjur' },
  { url: 'https://www.migalhas.com.br/rss/quentes', name: 'Migalhas' },
]

const GOOGLE_NEWS_QUERIES = [
  { query: 'direito consumidor Brasil', category: 'direito-consumidor' },
  { query: 'LGPD proteÃ§Ã£o dados', category: 'lgpd' },
  { query: 'direito penal criminal Brasil', category: 'direito-penal' },
  { query: 'direito imobiliÃ¡rio usucapiÃ£o', category: 'direito-imobiliario' },
  { query: 'STJ STF jurisprudÃªncia', category: 'direito-tributario' },
]

function categorize(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('lgpd') || t.includes('dados') || t.includes('digital') || t.includes('cyber') || t.includes('anpd')) return 'lgpd'
  if (t.includes('consumidor') || t.includes('banco') || t.includes('negativaÃ§Ã£o') || t.includes('indenizaÃ§Ã£o') || t.includes('juros')) return 'direito-consumidor'
  if (t.includes('penal') || t.includes('preso') || t.includes('habeas') || t.includes('crime') || t.includes('criminal')) return 'direito-penal'
  if (t.includes('imobiliÃ¡rio') || t.includes('usucapiÃ£o') || t.includes('imÃ³vel') || t.includes('fundiÃ¡ria')) return 'direito-imobiliario'
  if (t.includes('tributÃ¡rio') || t.includes('fiscal') || t.includes('imposto') || t.includes('tributo')) return 'direito-tributario'
  if (t.includes('licitaÃ§Ã£o') || t.includes('contrato administrativo') || t.includes('tce') || t.includes('tcu')) return 'licitacoes'
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

function buildSourceHash(article: { sourceUrl?: string; title: string; source?: string }) {
  const identity = [article.sourceUrl || '', article.source || '', article.title]
    .join('|')
    .trim()
    .toLowerCase()
  return createHash('sha256').update(identity).digest('hex')
}

function scoreArticle(article: { title: string; excerpt?: string; category?: string }) {
  const text = `${article.title} ${article.excerpt || ''}`.toLowerCase()
  let score = article.category && article.category !== 'geral' ? 50 : 30

  const highIntentTerms = ['stj', 'stf', 'lgpd', 'anpd', 'habeas corpus', 'indenizacao', 'consumidor', 'tributario', 'imobiliario', 'licitacao']
  for (const term of highIntentTerms) {
    if (text.includes(term)) score += 5
  }

  return Math.min(score, 100)
}

function buildAiSummary(article: { title: string; excerpt?: string; source?: string }) {
  const base = article.excerpt || article.title
  return `Rascunho para curadoria: ${base}`.substring(0, 1000)
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}



async function createAutomationRun(payload: any, task: string) {
  try {
    return await payload.create({
      collection: 'automation-runs',
      data: {
        task,
        status: 'running',
        startedAt: new Date().toISOString(),
      },
    })
  } catch {
    return null
  }
}

async function finishAutomationRun(payload: any, runId: string | number | undefined, data: Record<string, unknown>) {
  if (!runId) return
  try {
    await payload.update({
      collection: 'automation-runs',
      id: runId,
      data: {
        ...data,
        finishedAt: new Date().toISOString(),
      },
    })
  } catch {}
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
  const bearerToken = getBearerToken(req.headers)
  if (bearerToken) {
    const secret = getRequiredSecret('CRON_SECRET')
    if (!secret) {
      return NextResponse.json({ error: 'CRON_SECRET não configurado.' }, { status: 503 })
    }

    if (!safeCompare(bearerToken, secret)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  } else {
    const denied = await requireAdminRole(req, ['admin', 'editor'])
    if (denied) return denied
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

  let payload: any = null
  let run: any = null

  try {
    payload = await getPayload({ config: configPromise })
    run = await createAutomationRun(payload, 'news-feed')

    const automationConfig = await (payload as any).findGlobal({ slug: 'automation-config' }).catch(() => null)
    const retentionDays = Number(automationConfig?.newsRetentionDays || 90)

    for (const article of allArticles) {
      const slug = slugify(article.title)
      if (!slug) continue

      const sourceHash = buildSourceHash(article)
      const relevanceScore = scoreArticle(article)
      const expiresAt = addDays(new Date(), retentionDays).toISOString()

      try {
        const existing = await (payload as any).find({
          collection: 'news-articles',
          where: {
            or: [
              { slug: { equals: slug } },
              { sourceHash: { equals: sourceHash } },
            ],
          },
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
              sourceHash,
              relevanceScore,
              aiSummary: buildAiSummary(article),
              expiresAt,
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

    await finishAutomationRun(payload, run?.id, {
      status: 'success',
      itemsIn: fetched,
      itemsOut: saved,
      payload: { fetched, saved },
    })

    return NextResponse.json({ success: true, fetched, saved })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'CMS not available'
    if (payload) {
      await finishAutomationRun(payload, run?.id, {
        status: 'error',
        itemsIn: fetched,
        itemsOut: saved,
        errorMessage: message,
        payload: { fetched, saved },
      })
    }
    console.error('[News Feed] Payload error:', e)
    return NextResponse.json({ success: false, error: 'CMS not available', fetched }, { status: 500 })
  }
}




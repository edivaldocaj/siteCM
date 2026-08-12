import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { shouldSkipPayloadDuringBuild } from '@/lib/runtime-flags'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://cavalcantealbuquerque.com.br').replace(/\/$/, '')

const staticRoutes = ['/', '/sobre', '/areas-de-atuacao', '/campanhas', '/blog', '/contato', '/privacidade', '/termos-de-uso', '/politica-de-cookies']

function entry(path: string, lastModified?: string | Date): MetadataRoute.Sitemap[number] {
  return {
    url: `${siteUrl}${path}`,
    lastModified: lastModified ? new Date(lastModified) : new Date(),
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = staticRoutes.map((route) => entry(route))

  if (shouldSkipPayloadDuringBuild()) return routes

  try {
    const payload = await getPayload({ config: configPromise })
    const [postsRes, campaignsRes, areasRes] = await Promise.all([
      (payload as any).find({
        collection: 'posts',
        where: { status: { equals: 'published' } },
        limit: 1000,
        depth: 0,
        select: { slug: true, updatedAt: true, publishedAt: true },
      }).catch(() => ({ docs: [] })),
      (payload as any).find({
        collection: 'campaigns',
        where: { status: { equals: 'active' } },
        limit: 1000,
        depth: 0,
        select: { slug: true, updatedAt: true, startDate: true },
      }).catch(() => ({ docs: [] })),
      (payload as any).find({
        collection: 'practice-areas',
        limit: 1000,
        depth: 0,
        select: { slug: true, updatedAt: true },
      }).catch(() => ({ docs: [] })),
    ])

    for (const post of postsRes.docs || []) {
      if (post.slug) routes.push(entry(`/blog/${post.slug}`, post.publishedAt || post.updatedAt))
    }

    for (const campaign of campaignsRes.docs || []) {
      if (campaign.slug) routes.push(entry(`/campanhas/${campaign.slug}`, campaign.startDate || campaign.updatedAt))
    }

    for (const area of areasRes.docs || []) {
      if (area.slug) routes.push(entry(`/areas-de-atuacao/${area.slug}`, area.updatedAt))
    }
  } catch (error) {
    console.error('[sitemap] Falha ao buscar dados do Payload:', error)
  }

  return routes
}

import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAdminRole } from '@/lib/admin-auth'
import { getRequiredSecret, safeCompare } from '@/lib/secrets'

/**
 * POST /api/revalidate
 * Called by Payload CMS afterChange hooks or externally to refresh cached pages.
 * 
 * Body: { collection: string, slug?: string, secret: string }
 */
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { collection, slug, secret } = body

  const configuredSecret = getRequiredSecret('REVALIDATE_SECRET')
  if (!configuredSecret) {
    return NextResponse.json({ error: 'REVALIDATE_SECRET não configurado.' }, { status: 503 })
  }

  if (!safeCompare(secret, configuredSecret)) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  try {
    // Revalidate specific paths based on collection
    switch (collection) {
      case 'posts':
        revalidatePath('/blog')
        if (slug) revalidatePath(`/blog/${slug}`)
        revalidatePath('/') // homepage shows recent posts
        break
      case 'campaigns':
        revalidatePath('/campanhas')
        if (slug) revalidatePath(`/campanhas/${slug}`)
        revalidatePath('/') // homepage shows featured campaigns
        break
      case 'testimonials':
        revalidatePath('/') // homepage shows testimonials
        break
      case 'news-articles':
        revalidatePath('/') // homepage shows news
        break
      case 'practice-areas':
        revalidatePath('/areas-de-atuacao')
        if (slug) revalidatePath(`/areas-de-atuacao/${slug}`)
        break
      default:
        revalidatePath('/')
    }

    return NextResponse.json({ revalidated: true, collection, slug })
  } catch (error) {
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
  }
}



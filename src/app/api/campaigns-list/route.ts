import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await (payload as any).find({
      collection: 'campaigns',
      where: { status: { equals: 'active' } },
      sort: '-createdAt',
      limit: 50,
    })

    const campaigns = docs.map((c: any) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      category: c.category,
      subtitle: c.subtitle || '',
      socialCaption: c.socialCaption || '',
      socialHashtags: c.socialHashtags || [],
      colorAccent: c.colorAccent || 'gold',
      targetAudience: c.targetAudience || '',
      urgencyText: c.urgencyText || '',
      whatsappMessage: c.whatsappMessage || '',
    }))

    return NextResponse.json({ campaigns })
  } catch (e) {
    console.error('[API campaigns-list]', e)
    return NextResponse.json({ campaigns: [] })
  }
}

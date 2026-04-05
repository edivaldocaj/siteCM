import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

/* ── POST: Track a campaign event ── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { campaignSlug, eventType, utmSource, utmMedium, utmCampaign, referrer, metadata } = body

    if (!campaignSlug || !eventType) {
      return NextResponse.json({ error: 'campaignSlug e eventType obrigatórios.' }, { status: 400 })
    }

    const validEvents = ['page_view', 'whatsapp_click', 'form_start', 'form_submit', 'share', 'cta_click', 'scroll_complete']
    if (!validEvents.includes(eventType)) {
      return NextResponse.json({ error: 'eventType inválido.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    await (payload as any).create({
      collection: 'campaign-events',
      data: {
        campaignSlug,
        eventType,
        utmSource: utmSource || undefined,
        utmMedium: utmMedium || undefined,
        utmCampaign: utmCampaign || undefined,
        referrer: referrer || undefined,
        userAgent: req.headers.get('user-agent') || undefined,
        metadata: metadata || undefined,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Campaign Track] Error:', error)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

/* ── GET: Campaign analytics summary ── */
export async function GET(req: NextRequest) {
  const secret = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (secret !== process.env.NEWS_REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const { searchParams } = new URL(req.url)
    const campaignSlug = searchParams.get('campaign')

    // Get all campaigns for summary
    const campaignsRes = await (payload as any).find({
      collection: 'campaigns',
      where: { status: { equals: 'active' } },
      limit: 50,
    })

    const analytics = []

    for (const campaign of campaignsRes.docs) {
      const slug = campaign.slug
      if (campaignSlug && slug !== campaignSlug) continue

      // Count events by type
      const [views, whatsappClicks, formSubmits, shares] = await Promise.all([
        (payload as any).find({ collection: 'campaign-events', where: { campaignSlug: { equals: slug }, eventType: { equals: 'page_view' } }, limit: 0 }),
        (payload as any).find({ collection: 'campaign-events', where: { campaignSlug: { equals: slug }, eventType: { equals: 'whatsapp_click' } }, limit: 0 }),
        (payload as any).find({ collection: 'campaign-events', where: { campaignSlug: { equals: slug }, eventType: { equals: 'form_submit' } }, limit: 0 }),
        (payload as any).find({ collection: 'campaign-events', where: { campaignSlug: { equals: slug }, eventType: { equals: 'share' } }, limit: 0 }),
      ])

      // Count leads from this campaign
      const leads = await (payload as any).find({
        collection: 'leads',
        where: { campaignSlug: { equals: slug } },
        limit: 0,
      })

      const convertedLeads = await (payload as any).find({
        collection: 'leads',
        where: { campaignSlug: { equals: slug }, status: { equals: 'converted' } },
        limit: 0,
      })

      const totalViews = views.totalDocs || 0
      const totalLeads = leads.totalDocs || 0
      const conversionRate = totalViews > 0 ? ((totalLeads / totalViews) * 100).toFixed(1) : '0'

      analytics.push({
        slug,
        title: campaign.title,
        category: campaign.category,
        status: campaign.status,
        metrics: {
          views: totalViews,
          whatsappClicks: whatsappClicks.totalDocs || 0,
          formSubmits: formSubmits.totalDocs || 0,
          shares: shares.totalDocs || 0,
          totalLeads,
          convertedLeads: convertedLeads.totalDocs || 0,
          conversionRate: `${conversionRate}%`,
        },
      })
    }

    return NextResponse.json({
      campaigns: analytics,
      summary: {
        totalCampaigns: analytics.length,
        totalViews: analytics.reduce((sum, c) => sum + c.metrics.views, 0),
        totalLeads: analytics.reduce((sum, c) => sum + c.metrics.totalLeads, 0),
        totalConverted: analytics.reduce((sum, c) => sum + c.metrics.convertedLeads, 0),
      },
    })
  } catch (error) {
    console.error('[Campaign Analytics] Error:', error)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

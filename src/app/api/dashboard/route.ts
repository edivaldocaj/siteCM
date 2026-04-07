import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

/* GET: KPIs gerenciais do escritório */
export async function GET(req: NextRequest) {
  const secret = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (secret !== process.env.NEWS_REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Leads este mês
    let leadsThisMonth = 0, leadsLastMonth = 0, totalLeads = 0
    let convertedThisMonth = 0, convertedTotal = 0
    let leadsByStatus: Record<string, number> = {}
    let leadsBySource: Record<string, number> = {}
    let leadsByCampaign: Record<string, number> = {}
    let leadsByAttorney: Record<string, { total: number; converted: number }> = {
      edivaldo: { total: 0, converted: 0 },
      gabrielly: { total: 0, converted: 0 },
    }

    try {
      const allLeads = await (payload as any).find({ collection: 'leads', limit: 0 })
      totalLeads = allLeads.totalDocs

      const thisMonthLeads = await (payload as any).find({
        collection: 'leads',
        where: { createdAt: { greater_than_equal: startOfMonth.toISOString() } },
        limit: 0,
      })
      leadsThisMonth = thisMonthLeads.totalDocs

      const lastMonthLeads = await (payload as any).find({
        collection: 'leads',
        where: {
          createdAt: {
            greater_than_equal: startOfLastMonth.toISOString(),
            less_than_equal: endOfLastMonth.toISOString(),
          },
        },
        limit: 0,
      })
      leadsLastMonth = lastMonthLeads.totalDocs

      const convertedAll = await (payload as any).find({
        collection: 'leads',
        where: { status: { equals: 'converted' } },
        limit: 0,
      })
      convertedTotal = convertedAll.totalDocs

      const convertedMonth = await (payload as any).find({
        collection: 'leads',
        where: {
          status: { equals: 'converted' },
          conversionDate: { greater_than_equal: startOfMonth.toISOString() },
        },
        limit: 0,
      })
      convertedThisMonth = convertedMonth.totalDocs

      // Leads por status
      for (const st of ['new', 'contacted', 'qualified', 'proposal', 'converted', 'lost']) {
        const r = await (payload as any).find({ collection: 'leads', where: { status: { equals: st } }, limit: 0 })
        leadsByStatus[st] = r.totalDocs
      }

      // Leads por fonte
      for (const src of ['campaign-form', 'contact-form', 'whatsapp', 'referral', 'calculator', 'other']) {
        const r = await (payload as any).find({ collection: 'leads', where: { source: { equals: src } }, limit: 0 })
        if (r.totalDocs > 0) leadsBySource[src] = r.totalDocs
      }

      // Top campanhas
      const leadsWithCampaign = await (payload as any).find({
        collection: 'leads',
        where: { campaignSlug: { exists: true } },
        limit: 500,
      })
      for (const lead of leadsWithCampaign.docs) {
        if (lead.campaignSlug) {
          leadsByCampaign[lead.campaignSlug] = (leadsByCampaign[lead.campaignSlug] || 0) + 1
        }
        // Por advogado
        if (lead.assignedTo && leadsByAttorney[lead.assignedTo]) {
          leadsByAttorney[lead.assignedTo].total++
          if (lead.status === 'converted') leadsByAttorney[lead.assignedTo].converted++
        }
      }
    } catch { /* collections may not exist yet */ }

    // Clientes ativos
    let activeClients = 0
    try {
      const clients = await (payload as any).find({
        collection: 'clients',
        where: { active: { equals: true } },
        limit: 0,
      })
      activeClients = clients.totalDocs
    } catch { }

    // Campanhas ativas
    let activeCampaigns = 0
    try {
      const campaigns = await (payload as any).find({
        collection: 'campaigns',
        where: { status: { equals: 'active' } },
        limit: 0,
      })
      activeCampaigns = campaigns.totalDocs
    } catch { }

    // Prazos próximos (7 dias)
    let upcomingDeadlines = 0
    let criticalDeadlines = 0
    try {
      const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      const deadlines = await (payload as any).find({
        collection: 'deadlines',
        where: {
          deadlineDate: { greater_than_equal: now.toISOString(), less_than_equal: weekAhead.toISOString() },
          status: { in: ['pending', 'in-progress'] },
        },
        limit: 0,
      })
      upcomingDeadlines = deadlines.totalDocs

      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      const criticals = await (payload as any).find({
        collection: 'deadlines',
        where: {
          deadlineDate: { greater_than_equal: now.toISOString(), less_than_equal: tomorrow.toISOString() },
          status: { in: ['pending', 'in-progress'] },
        },
        limit: 0,
      })
      criticalDeadlines = criticals.totalDocs
    } catch { }

    // NPS médio
    let avgNps = 0
    let npsCount = 0
    try {
      const npsAll = await (payload as any).find({ collection: 'nps-responses', limit: 500 })
      if (npsAll.docs.length > 0) {
        npsCount = npsAll.docs.length
        avgNps = npsAll.docs.reduce((sum: number, n: any) => sum + (n.score || 0), 0) / npsCount
      }
    } catch { }

    const conversionRate = totalLeads > 0 ? ((convertedTotal / totalLeads) * 100).toFixed(1) : '0'
    const monthGrowth = leadsLastMonth > 0 ? (((leadsThisMonth - leadsLastMonth) / leadsLastMonth) * 100).toFixed(0) : leadsThisMonth > 0 ? '+100' : '0'

    return NextResponse.json({
      kpis: {
        leadsThisMonth,
        leadsLastMonth,
        monthGrowth: `${Number(monthGrowth) >= 0 ? '+' : ''}${monthGrowth}%`,
        totalLeads,
        convertedThisMonth,
        convertedTotal,
        conversionRate: `${conversionRate}%`,
        activeClients,
        activeCampaigns,
        upcomingDeadlines,
        criticalDeadlines,
        avgNps: avgNps.toFixed(1),
        npsCount,
      },
      breakdown: {
        leadsByStatus,
        leadsBySource,
        topCampaigns: Object.entries(leadsByCampaign)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([slug, count]) => ({ slug, count })),
        byAttorney: leadsByAttorney,
      },
    })
  } catch (error) {
    console.error('[Dashboard API] Error:', error)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

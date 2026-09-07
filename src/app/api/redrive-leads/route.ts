import { NextRequest, NextResponse } from 'next/server'
import { deliverLead } from '@/lib/integration/delivery'
import { getPayloadClient } from '@/lib/integration/payload'

export async function POST(request: NextRequest) {
  const token = request.headers.get('x-site-token') || request.nextUrl.searchParams.get('token')
  if (!process.env.SITE_TOKEN || token !== process.env.SITE_TOKEN) return NextResponse.json({ ok: false }, { status: 401 })
  const payload = await getPayloadClient()
  const records = await payload.find({
    collection: 'lead-submissions', limit: 25, overrideAccess: true,
    where: { and: [
      { status: { in: ['pendente', 'falha'] } },
      { enviadoEm: { less_than_equal: new Date(Date.now() - 5 * 60 * 1000).toISOString() } },
      { tentativas: { less_than: 6 } },
    ] },
  })
  await Promise.all(records.docs.map((record) => deliverLead(record.id)))
  return NextResponse.json({ ok: true, reenviadas: records.docs.length })
}

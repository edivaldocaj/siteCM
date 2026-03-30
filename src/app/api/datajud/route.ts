import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const DATAJUD_BASE = 'https://api-publica.datajud.cnj.jus.br'
const API_KEY = process.env.DATAJUD_API_KEY || 'cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw=='

const TRIBUNAL_ENDPOINTS: Record<string, string> = {
  tjrn: 'api_publica_tjrn',
  trt21: 'api_publica_trt21',
  trf5: 'api_publica_trf5',
  stj: 'api_publica_stj',
  stf: 'api_publica_stf',
}

async function searchProcess(processNumber: string, tribunal?: string) {
  const cleanNumber = processNumber.replace(/[.\-\s]/g, '')
  const tribunals = tribunal && TRIBUNAL_ENDPOINTS[tribunal] ? [tribunal] : ['tjrn', 'trt21', 'trf5']

  for (const trib of tribunals) {
    const endpoint = TRIBUNAL_ENDPOINTS[trib]
    if (!endpoint) continue
    try {
      const res = await fetch(`${DATAJUD_BASE}/${endpoint}/_search`, {
        method: 'POST',
        headers: { 'Authorization': `APIKey ${API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: { match: { numeroProcesso: cleanNumber } }, size: 1 }),
      })
      if (!res.ok) continue
      const data = await res.json()
      if (data.hits?.hits?.length > 0) {
        const source = data.hits.hits[0]._source
        return {
          ...source,
          tribunal: trib.toUpperCase(),
          movimentos: (source.movimentos || []).sort((a: any, b: any) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()),
        }
      }
    } catch (e) {
      console.error(`[Datajud] Error from ${trib}:`, e)
    }
  }
  return null
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token, processNumber, tribunal } = body

    if (!token) return NextResponse.json({ error: 'Token de acesso obrigatório.' }, { status: 401 })

    const payload = await getPayload({ config: configPromise })

    const clients = await (payload as any).find({
      collection: 'clients',
      where: { accessToken: { equals: token }, active: { equals: true } },
      limit: 1,
    })

    const client = clients.docs?.[0]
    if (!client) return NextResponse.json({ error: 'Token inválido ou acesso desativado.' }, { status: 401 })

    if (processNumber) {
      const clientProcesses = client.processes || []
      const hasAccess = clientProcesses.some((p: any) => p.processNumber.replace(/\D/g, '') === processNumber.replace(/\D/g, ''))
      if (!hasAccess) return NextResponse.json({ error: 'Processo não vinculado à sua conta.' }, { status: 403 })

      const processData = await searchProcess(processNumber, tribunal)
      if (!processData) return NextResponse.json({ error: 'Processo não encontrado no Datajud.' }, { status: 404 })
      return NextResponse.json({ success: true, process: processData })
    }

    const clientProcesses = client.processes || []
    const results = []
    for (const proc of clientProcesses) {
      try {
        const processData = await searchProcess(proc.processNumber, proc.tribunal)
        results.push({ processNumber: proc.processNumber, tribunal: proc.tribunal, description: proc.description, attorney: proc.attorney, datajud: processData, found: !!processData })
      } catch {
        results.push({ processNumber: proc.processNumber, tribunal: proc.tribunal, description: proc.description, attorney: proc.attorney, datajud: null, found: false })
      }
    }

    return NextResponse.json({ success: true, client: { name: client.name }, processes: results })
  } catch (error) {
    console.error('[Datajud API] Error:', error)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

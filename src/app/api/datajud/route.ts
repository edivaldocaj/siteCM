import { NextRequest, NextResponse } from 'next/server'
import { searchProcessByNumber } from '@/lib/datajud'
import { getPayloadClient } from '@/lib/payload'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token, processNumber, tribunal } = body

    if (!token) {
      return NextResponse.json({ error: 'Token de acesso obrigatório.' }, { status: 401 })
    }

    // Validar token no CMS
    const payload = await getPayloadClient()
    if (!payload) {
      return NextResponse.json({ error: 'Sistema indisponível.' }, { status: 503 })
    }

    const clients = await payload.find({
      collection: 'clients',
      where: {
        accessToken: { equals: token },
        active: { equals: true },
      },
      limit: 1,
    })

    const client = clients.docs?.[0]
    if (!client) {
      return NextResponse.json({ error: 'Token inválido ou acesso desativado.' }, { status: 401 })
    }

    // Se processNumber fornecido, busca específico
    if (processNumber) {
      // Verificar se o processo pertence ao cliente
      const clientProcesses = client.processes || []
      const hasAccess = clientProcesses.some(
        (p: any) => p.processNumber.replace(/\D/g, '') === processNumber.replace(/\D/g, '')
      )

      if (!hasAccess) {
        return NextResponse.json({ error: 'Processo não vinculado à sua conta.' }, { status: 403 })
      }

      const processData = await searchProcessByNumber(processNumber, tribunal)
      if (!processData) {
        return NextResponse.json({ error: 'Processo não encontrado no Datajud.' }, { status: 404 })
      }

      return NextResponse.json({ success: true, process: processData })
    }

    // Se não, retorna todos os processos do cliente com dados do Datajud
    const clientProcesses = client.processes || []
    const results = []

    for (const proc of clientProcesses) {
      try {
        const processData = await searchProcessByNumber(proc.processNumber, proc.tribunal)
        results.push({
          processNumber: proc.processNumber,
          tribunal: proc.tribunal,
          description: proc.description,
          attorney: proc.attorney,
          datajud: processData,
          found: !!processData,
        })
      } catch {
        results.push({
          processNumber: proc.processNumber,
          tribunal: proc.tribunal,
          description: proc.description,
          attorney: proc.attorney,
          datajud: null,
          found: false,
        })
      }
    }

    return NextResponse.json({
      success: true,
      client: { name: client.name },
      processes: results,
    })
  } catch (error) {
    console.error('[Datajud API] Error:', error)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

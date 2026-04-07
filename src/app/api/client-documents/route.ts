import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

/* GET: Listar documentos de um cliente (via token) */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Token obrigatório.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // Verificar cliente
    const clientRes = await (payload as any).find({
      collection: 'clients',
      where: { accessToken: { equals: token }, active: { equals: true } },
      limit: 1,
    })

    if (!clientRes.docs.length) {
      return NextResponse.json({ error: 'Token inválido.' }, { status: 401 })
    }

    const client = clientRes.docs[0]

    // Buscar documentos do cliente (apenas visíveis)
    const docs = await (payload as any).find({
      collection: 'client-documents',
      where: {
        client: { equals: client.id },
        visibility: { equals: 'client-visible' },
      },
      sort: '-createdAt',
      limit: 50,
    })

    return NextResponse.json({
      client: { name: client.name },
      documents: docs.docs.map((d: any) => ({
        id: d.id,
        title: d.title,
        type: d.documentType,
        processNumber: d.processNumber,
        uploadedBy: d.uploadedBy,
        fileUrl: d.file?.url || null,
        fileName: d.file?.filename || null,
        notes: d.notes,
        createdAt: d.createdAt,
      })),
    })
  } catch (error) {
    console.error('[Client Documents] Error:', error)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

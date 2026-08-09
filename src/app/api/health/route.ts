import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const requiredEnv = ['DATABASE_URL', 'PAYLOAD_SECRET', 'NEXT_PUBLIC_SITE_URL'] as const

function envStatus() {
  return requiredEnv.map((name) => ({
    name,
    configured: Boolean(process.env[name]),
  }))
}

export async function GET() {
  const startedAt = Date.now()
  const env = envStatus()
  const missingEnv = env.filter((item) => !item.configured).map((item) => item.name)

  let database: 'ok' | 'error' = 'ok'
  let payloadStatus: 'ok' | 'error' = 'ok'

  try {
    const payload = await getPayload({ config: configPromise })
    await payload.find({ collection: 'users', limit: 0, depth: 0 })
  } catch (error) {
    database = 'error'
    payloadStatus = 'error'
    console.error('[health] Payload/database unavailable:', error)
  }

  const ok = missingEnv.length === 0 && database === 'ok' && payloadStatus === 'ok'

  return NextResponse.json(
    {
      status: ok ? 'ok' : 'degraded',
      service: 'cavalcante-albuquerque-site',
      timestamp: new Date().toISOString(),
      latencyMs: Date.now() - startedAt,
      checks: {
        env,
        database,
        payload: payloadStatus,
      },
      ...(!ok ? { error: 'unavailable' } : {}),
    },
    {
      status: ok ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  )
}

export async function HEAD() {
  const response = await GET()
  return new Response(null, { status: response.status, headers: response.headers })
}

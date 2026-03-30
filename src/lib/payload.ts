// NOTA: Para server components (pages), use diretamente:
//   import { getPayload } from 'payload'
//   import configPromise from '@payload-config'
//   const payload = await getPayload({ config: configPromise })
//
// Este helper existe para contextos onde @payload-config não resolve.

import { getPayload } from 'payload'
import config from '@payload-config'

let cached: any = null

export async function getPayloadClient(): Promise<any> {
  if (cached) return cached
  try {
    cached = await getPayload({ config })
    return cached
  } catch (e) {
    console.error('[Payload] Init error:', e)
    return null
  }
}

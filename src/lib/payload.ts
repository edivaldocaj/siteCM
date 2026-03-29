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

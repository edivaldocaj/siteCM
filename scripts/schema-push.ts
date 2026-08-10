import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })
console.log('[schema:push] Schema inicial sincronizado.')
await payload.destroy?.()

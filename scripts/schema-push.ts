import { getPayload } from 'payload'
import config from '@payload-config'

try {
  const payload = await getPayload({ config })
  console.log('[schema:push] Schema inicial sincronizado.')
  await payload.destroy?.()
  process.exit(0)
} catch (error) {
  console.error('[schema:push] Falha ao sincronizar schema inicial:', error)
  process.exit(1)
}

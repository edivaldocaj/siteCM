import { sendLeadToN8n } from './n8n'
import { getPayloadClient } from './payload'

const RETRY_DELAYS_MS = [5000, 30000, 300000] as const

type LeadRecord = { id: string | number; status?: string | null; consentAceito?: boolean | null; nome?: string | null; tentativas?: number | null }
type UntypedPayload = {
  findByID: (args: { collection: string; id: string | number }) => Promise<LeadRecord>
  update: (args: { collection: string; id: string | number; data: Record<string, unknown>; overrideAccess: boolean }) => Promise<unknown>
}

export async function deliverLead(id: string | number) {
  const payload = (await getPayloadClient()) as unknown as UntypedPayload
  const record = await payload.findByID({ collection: 'lead-submissions', id })
  if (!record || record.status === 'entregue' || record.status === 'rejeitada' || !record.consentAceito || !record.nome) return
  const tentativas = (record.tentativas || 0) + 1
  const result = await sendLeadToN8n(record).catch((error: unknown) => ({
    status: 'pendente' as const, retryable: true, leadIdCrm: null,
    ultimoErro: error instanceof Error ? error.message : 'Falha ao entregar ao n8n.',
  }))
  const status = result.status === 'pendente' && tentativas >= RETRY_DELAYS_MS.length ? 'falha' : result.status
  await payload.update({ collection: 'lead-submissions', id, overrideAccess: true, data: {
    status, tentativas, leadIdCrm: result.leadIdCrm || undefined, ultimoErro: result.ultimoErro || undefined,
  } })
  if (status === 'pendente' && result.retryable) {
    setTimeout(() => { void deliverLead(id) }, RETRY_DELAYS_MS[Math.min(tentativas - 1, RETRY_DELAYS_MS.length - 1)])
  }
}

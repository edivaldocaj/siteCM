import { normalizePhone } from './phone'
import { getPayloadClient } from './payload'
import { deliverLead } from './delivery'

export type SiteLead = {
  idempotencia?: string
  nome: string
  telefone: string
  email?: string | null
  campanha?: string | null
  origem: 'landing' | 'contato'
  utm?: { source?: string | null; medium?: string | null; campaign?: string | null; content?: string | null; term?: string | null }
  referrer?: string | null
  respostas?: Array<{ pergunta: string; resposta: string }>
  consentVersao?: string
  consentIp?: string
}

export async function submitLead(data: SiteLead) {
  const payload = await getPayloadClient()
  const idempotencia = data.idempotencia || crypto.randomUUID()
  const existing = await payload.find({ collection: 'lead-submissions', limit: 1, overrideAccess: true, where: { idempotencia: { equals: idempotencia } } })
  const record = existing.docs[0] || await payload.create({
    collection: 'lead-submissions', overrideAccess: true, data: {
      idempotencia, enviadoEm: new Date().toISOString(), escritorio: 'CA',
      telefone: normalizePhone(data.telefone), nome: data.nome.trim(), email: data.email || undefined,
      campanha: data.campanha || undefined, origem: data.origem, utm: data.utm || {},
      referrer: data.referrer || undefined, respostas: data.respostas || [], consentAceito: true,
      consentVersao: data.consentVersao || 'v1-2026-08', consentEm: new Date().toISOString(),
      consentIp: data.consentIp, status: 'pendente', tentativas: 0,
    },
  })
  await deliverLead(record.id)
  const delivered = await payload.findByID({ collection: 'lead-submissions', id: record.id, overrideAccess: true })
  return { idempotencia, status: delivered.status, leadId: delivered.leadIdCrm || null }
}

const DELIVERY_TIMEOUT_MS = 15000

type LeadRecord = {
  id: string | number
  idempotencia?: string | null
  enviadoEm?: string | null
  escritorio?: 'CA' | null
  telefone?: string | null
  nome?: string | null
  email?: string | null
  campanha?: string | null
  origem?: 'landing' | 'contato' | null
  utm?: { source?: string | null; medium?: string | null; campaign?: string | null; content?: string | null; term?: string | null } | null
  referrer?: string | null
  respostas?: Array<{ pergunta?: string | null; resposta?: string | null }> | null
  consentAceito?: boolean | null
  consentVersao?: string | null
  consentEm?: string | null
  consentIp?: string | null
}

function requiredEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`Variavel ${name} nao configurada.`)
  return value
}

export async function sendLeadToN8n(record: LeadRecord) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), DELIVERY_TIMEOUT_MS)
  try {
    const response = await fetch(`${requiredEnv('N8N_BASE_URL')}/webhook/lead-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Site-Token': requiredEnv('SITE_TOKEN') },
      body: JSON.stringify({
        escritorio: record.escritorio || 'CA', idempotencia: record.idempotencia,
        enviadoEm: record.enviadoEm, telefone: record.telefone, nome: record.nome,
        email: record.email || null, campanha: record.campanha || null, origem: record.origem,
        utm: record.utm || {}, referrer: record.referrer || null,
        respostas: (record.respostas || []).map((item) => ({ pergunta: item.pergunta, resposta: item.resposta })),
        consentimento: { aceito: Boolean(record.consentAceito), versao: record.consentVersao, em: record.consentEm, ip: record.consentIp },
      }),
      signal: controller.signal,
    })
    const json = (await response.json().catch(() => null)) as { ok?: boolean; leadId?: string; leadIdCrm?: string; erro?: string } | null
    if (response.status === 422) return { status: 'rejeitada' as const, retryable: false, leadIdCrm: null, ultimoErro: json?.erro || 'Lead rejeitado pelo n8n.' }
    if (!response.ok || !json?.ok) return { status: 'pendente' as const, retryable: true, leadIdCrm: null, ultimoErro: json?.erro || `Falha na entrega ao n8n: HTTP ${response.status}.` }
    return { status: 'entregue' as const, retryable: false, leadIdCrm: json.leadId || json.leadIdCrm || null, ultimoErro: null }
  } finally {
    clearTimeout(timeout)
  }
}

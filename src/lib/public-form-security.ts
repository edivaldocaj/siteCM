export const LEAD_CONSENT_TEXT = 'Autorizo o tratamento dos meus dados para análise preliminar do caso e contato pelo escritório, conforme a Política de Privacidade.'
export const NPS_CONSENT_TEXT = 'Autorizo o registro da minha resposta de satisfação para acompanhamento interno da qualidade do atendimento.'

export const isLikelyBotSubmission = (body: Record<string, unknown>, minimumMs = 3000): boolean => {
  if (typeof body.website === 'string' && body.website.trim().length > 0) return true

  const startedAt = Number(body.formStartedAt)
  if (!Number.isFinite(startedAt)) return true

  return Date.now() - startedAt < minimumMs
}

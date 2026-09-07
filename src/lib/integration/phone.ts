export function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 10 || digits.length === 11) return `55${digits}`
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) return digits
  if (digits.length >= 10 && digits.length <= 15) return digits
  throw new Error('Telefone invalido.')
}

import { createHash, timingSafeEqual } from 'crypto'

const digest = (value: string): Buffer => createHash('sha256').update(value).digest()

export const safeCompare = (received: string | null | undefined, expected: string): boolean => {
  if (!received) return false

  return timingSafeEqual(digest(received), digest(expected))
}

export const getBearerToken = (headers: Headers): string | null => {
  const authorization = headers.get('authorization')
  if (!authorization?.startsWith('Bearer ')) return null

  return authorization.slice('Bearer '.length)
}

export const getRequiredSecret = (name: string): string | null => {
  const value = process.env[name]
  return value && value.length > 0 ? value : null
}

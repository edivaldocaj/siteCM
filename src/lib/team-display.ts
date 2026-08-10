type MaybeTeam = {
  name?: string | null
  shortName?: string | null
  short_name?: string | null
  oab?: string | null
  photo?: { url?: string | null } | null
}

const legacyPeople: Record<string, string> = {
  edivaldo: 'Dr. Edivaldo Cavalcante Albuquerque',
}

const firmName = 'Cavalcante Albuquerque'

export function getRelationshipDoc(value: unknown): MaybeTeam | null {
  if (value && typeof value === 'object') return value as MaybeTeam
  return null
}

export function resolveTeamDisplayName(
  record: Record<string, any>,
  refField: string,
  legacyField: string,
  options: { firmFallback?: string } = {},
): string {
  const team = getRelationshipDoc(record[refField])
  if (team) return team.shortName || team.short_name || team.name || options.firmFallback || firmName

  if (record.byFirm || record.by_firm) return options.firmFallback || firmName

  const legacyValue = record[legacyField]
  if (typeof legacyValue === 'string') return legacyPeople[legacyValue] || options.firmFallback || firmName

  return options.firmFallback || firmName
}

export function resolveTeamOab(record: Record<string, any>, refField: string): string | null {
  const team = getRelationshipDoc(record[refField])
  return team?.oab || null
}

export function resolveTeamPhotoUrl(record: Record<string, any>, refField: string): string | null {
  const team = getRelationshipDoc(record[refField])
  return team?.photo?.url || null
}

import { getPayload } from 'payload'
import config from '../src/payload.config'

type TeamSeed = {
  active: boolean
  formerMember: boolean
  name: string
  role: string
  shortName: string
  showOnSite: boolean
  slug: string
}

const team: TeamSeed[] = [
  {
    name: 'Dr. Edivaldo Cavalcante Albuquerque',
    shortName: 'Dr. Edivaldo',
    slug: 'edivaldo-cavalcante-albuquerque',
    role: 'Advogado Titular',
    active: true,
    showOnSite: true,
    formerMember: false,
  },
  {
    name: 'Dra. Gabrielly Melo',
    shortName: 'Dra. Gabrielly',
    slug: 'gabrielly-melo',
    role: 'Ex-integrante',
    active: false,
    showOnSite: false,
    formerMember: true,
  },
]

async function upsertTeamMember(member: TeamSeed) {
  const payload = await getPayload({ config })
  const existing = await payload.find({
    collection: 'team',
    where: { slug: { equals: member.slug } },
    limit: 1,
  })

  if (existing.docs[0]) {
    await payload.update({
      collection: 'team',
      id: existing.docs[0].id,
      data: member,
    })
    return { action: 'updated', slug: member.slug }
  }

  await payload.create({
    collection: 'team',
    data: member,
  })
  return { action: 'created', slug: member.slug }
}

async function main() {
  for (const member of team) {
    const result = await upsertTeamMember(member)
    console.log(`${result.action}: ${result.slug}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

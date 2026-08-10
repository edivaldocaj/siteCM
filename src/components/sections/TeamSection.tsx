'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type MediaRef = { url?: string | null } | null
type PracticeAreaRef = { title?: string | null; name?: string | null } | string | number | null

type TeamRecord = {
  name?: string | null
  shortName?: string | null
  role?: string | null
  areas?: string | null
  practiceAreas?: PracticeAreaRef[] | null
  oab?: string | null
  bio?: unknown
  photo?: MediaRef
}

interface TeamSectionProps {
  cmsData?: {
    sectionTitle?: string | null
    sectionDescription?: string | null
    partnersList?: TeamRecord[] | null
  } | null
  cmsTeam?: TeamRecord[] | null
}

function getInitials(name: string): string {
  const clean = name.replace(/^(Dr\.|Dra\.|Prof\.|Sr\.|Sra\.)\s*/i, '').trim()
  const parts = clean.split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return parts[0]?.[0]?.toUpperCase() || '?'
}

function richTextToPlain(value: unknown): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value !== 'object') return ''

  const texts: string[] = []
  const visit = (node: any) => {
    if (!node || typeof node !== 'object') return
    if (typeof node.text === 'string') texts.push(node.text)
    if (Array.isArray(node.children)) node.children.forEach(visit)
  }

  visit(value)
  return texts.join(' ').replace(/\s+/g, ' ').trim()
}

function getAreas(member: TeamRecord): string[] {
  if (Array.isArray(member.practiceAreas) && member.practiceAreas.length) {
    return member.practiceAreas
      .map((area) => {
        if (!area || typeof area !== 'object') return null
        return area.title || area.name || null
      })
      .filter((area): area is string => Boolean(area))
  }

  if (member.areas) {
    return member.areas.split(/[,|]/).map((area) => area.trim()).filter(Boolean)
  }

  return []
}

function normalizeMember(member: TeamRecord) {
  const name = member.name || member.shortName || ''
  return {
    name,
    role: member.role || '',
    areas: getAreas(member),
    initials: getInitials(name),
    bio: richTextToPlain(member.bio),
    oab: member.oab || '',
    photoUrl: member.photo?.url || null,
  }
}

export function TeamSection({ cmsData, cmsTeam }: TeamSectionProps) {
  const source = cmsTeam?.length ? cmsTeam : cmsData?.partnersList || []
  const members = source.map(normalizeMember).filter((member) => member.name)

  if (members.length === 0) return null

  return (
    <section className="ca-about-team" aria-labelledby="team-section-title">
      <div className="container-wide mx-auto">
        <div className="ca-section-heading ca-section-heading--split">
          <div>
            <span className="ca-eyebrow">Equipe</span>
            <h2 id="team-section-title">{cmsData?.sectionTitle || 'Quem conduz o seu caso'}</h2>
          </div>
          {cmsData?.sectionDescription && <p>{cmsData.sectionDescription}</p>}
        </div>

        <div className="ca-about-team__grid">
          {members.map((member) => (
            <article className="ca-about-team__card" key={member.name}>
              <div className="ca-about-team__portrait">
                {member.photoUrl ? (
                  <Image src={member.photoUrl} alt={member.name} width={168} height={168} />
                ) : (
                  <span>{member.initials}</span>
                )}
              </div>
              <div className="ca-about-team__body">
                <h3>{member.name}</h3>
                {member.role && <p className="ca-about-team__role">{member.role}</p>}
                {member.oab && <p className="ca-about-team__oab">{member.oab}</p>}
                {member.areas.length > 0 && (
                  <div className="ca-about-team__tags">
                    {member.areas.map((area) => (
                      <span key={area}>{area}</span>
                    ))}
                  </div>
                )}
                {member.bio && <p className="ca-about-team__bio">{member.bio}</p>}
              </div>
            </article>
          ))}
        </div>

        <Link href="/sobre" className="ca-inline-link ca-about-team__link">
          Conheça nossa história
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}

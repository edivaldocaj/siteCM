import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { AreasPageClient } from './AreasPageClient'

export const metadata = {
  title: 'Áreas de Atuação',
  description: 'Conheça as áreas de especialização do Cavalcante & Melo: Direito Digital, LGPD, Civil, Consumidor, Imobiliário, Tributário, Licitações e Penal.',
}

export const dynamic = 'force-dynamic'

async function getAreasData() {
  try {
    const payload = await getPayload({ config: configPromise })
    const [areasRes, siteConfigData] = await Promise.all([
      (payload as any).find({ collection: 'practice-areas', limit: 20, sort: 'order' }).catch(() => ({ docs: [] })),
      (payload as any).findGlobal({ slug: 'site-config' }).catch(() => null),
    ])
    return { areas: areasRes?.docs || [], siteConfig: siteConfigData }
  } catch {
    return { areas: [], siteConfig: null }
  }
}

export default async function AreasPage() {
  const data = await getAreasData()
  return <AreasPageClient areas={data.areas} siteConfig={data.siteConfig} />
}

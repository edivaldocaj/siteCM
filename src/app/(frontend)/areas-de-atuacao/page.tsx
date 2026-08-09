import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { AreasPageClient } from './AreasPageClient'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://cavalcantealbuquerque.com.br').replace(/\/$/, '')

export const metadata = {
  title: 'Areas de Atuacao',
  description: 'Conheca as areas de especializacao do Cavalcante Albuquerque: Direito Digital, LGPD, Civil, Consumidor, Imobiliario, Tributario, Licitacoes e Penal.',
  alternates: { canonical: `${siteUrl}/areas-de-atuacao` },
  openGraph: {
    title: 'Areas de Atuacao',
    description: 'Conheca as areas de especializacao do Cavalcante Albuquerque.',
    url: `${siteUrl}/areas-de-atuacao`,
    images: [{ url: `${siteUrl}/brand/cover-areas-og.jpg`, width: 1200, height: 630 }],
  },
}

export const dynamic = 'force-dynamic'

async function getAreasData() {
  try {
    const payload = await getPayload({ config: configPromise })
    const [areasRes, siteConfigData] = await Promise.all([
      (payload as any).find({ collection: 'practice-areas', limit: 20, sort: 'order', depth: 1 }).catch(() => ({ docs: [] })),
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

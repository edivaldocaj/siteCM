import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { AboutPageClient } from './AboutPageClient'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://cavalcantealbuquerque.com.br').replace(/\/$/, '')

export const metadata = {
  title: 'Sobre o Escritório',
  description: 'Conheça a história, valores e equipe do Cavalcante Albuquerque Advocacia e Consultoria.',
  alternates: { canonical: `${siteUrl}/sobre` },
  openGraph: {
    title: 'Sobre o Escritório',
    description: 'Conheça a história, valores e equipe do Cavalcante Albuquerque Advocacia e Consultoria.',
    url: `${siteUrl}/sobre`,
    images: [{ url: `${siteUrl}/brand/og-default.jpg`, width: 1200, height: 630 }],
  },
}

export const dynamic = 'force-dynamic'

async function getAboutData() {
  try {
    const payload = await getPayload({ config: configPromise })
    const [homepageData, siteConfigData] = await Promise.all([
      (payload as any).findGlobal({ slug: 'homepage' }).catch(() => null),
      (payload as any).findGlobal({ slug: 'site-config' }).catch(() => null),
    ])
    return { homepage: homepageData, siteConfig: siteConfigData }
  } catch {
    return { homepage: null, siteConfig: null }
  }
}

export default async function SobrePage() {
  const data = await getAboutData()
  return <AboutPageClient homepage={data.homepage} siteConfig={data.siteConfig} />
}

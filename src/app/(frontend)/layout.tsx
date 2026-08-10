import React from 'react'
import '../../styles/globals.css'
import { Cormorant_Garamond, IBM_Plex_Mono, Instrument_Sans } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { CookieConsent } from '@/components/ui/CookieConsent'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { shouldSkipPayloadDuringBuild } from '@/lib/runtime-flags'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})

const instrument = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-instrument',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
})


const navItems = [
  { href: '/', label: 'Início' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/areas-de-atuacao', label: 'Áreas de atuação' },
  { href: '/campanhas', label: 'Campanhas' },
  { href: '/blog', label: 'Blog' },
  { href: '/contato', label: 'Contato' },
]

async function getLayoutData() {
  if (shouldSkipPayloadDuringBuild()) {
    return { siteConfig: null, navigation: null, practiceAreas: [] }
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const [siteConfig, navigation, areasRes] = await Promise.all([
      (payload as any).findGlobal({ slug: 'site-config' }).catch(() => null),
      (payload as any).findGlobal({ slug: 'navigation' }).catch(() => null),
      (payload as any).find({ collection: 'practice-areas', limit: 8, sort: 'order', depth: 0 }).catch(() => ({ docs: [] })),
    ])

    return {
      siteConfig,
      navigation,
      practiceAreas: (areasRes?.docs || []).map((area: any) => ({
        href: `/areas-de-atuacao/${area.slug}`,
        label: area.title,
      })),
    }
  } catch (error) {
    console.error('[FrontendLayout] Falha ao buscar dados do layout:', error)
    return { siteConfig: null, navigation: null, practiceAreas: [] }
  }
}
function buildStructuredData(siteConfig: any) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://cavalcantealbuquerque.com.br').replace(/\/$/, '')
  const phone = siteConfig?.contactPhone || '(84) 99124-3985'
  const email = siteConfig?.contactEmail || 'contato@cavalcantealbuquerque.com.br'
  const address = siteConfig?.contactAddress || 'Rua Francisco Maia Sobrinho, 1950, Lagoa Nova, Natal/RN, 59062-250'

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'LegalService',
      '@id': `${siteUrl}/#legal-service`,
      name: 'Cavalcante Albuquerque Advocacia e Consultoria',
      url: siteUrl,
      image: `${siteUrl}/brand/og-default.jpg`,
      logo: `${siteUrl}/brand/lockup-dark.webp`,
      telephone: phone,
      email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: address,
        addressLocality: 'Natal',
        addressRegion: 'RN',
        postalCode: '59062-250',
        addressCountry: 'BR',
      },
      areaServed: ['Natal', 'Rio Grande do Norte', 'Brasil'],
      priceRange: '$$',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '18:00',
        },
      ],
      sameAs: [],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'Cavalcante Albuquerque',
      inLanguage: 'pt-BR',
      publisher: { '@id': `${siteUrl}/#legal-service` },
    },
  ]
}
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://cavalcantealbuquerque.com.br'),
  title: {
    default: 'Cavalcante Albuquerque | Advocacia e Consultoria - Natal/RN',
    template: '%s | Cavalcante Albuquerque',
  },
  description:
    'Advocacia e consultoria em Natal/RN nas áreas de Direito Digital, LGPD, Civil, Consumidor, Imobiliário, Tributário, Licitações e Direito Penal.',
  keywords: ['advogado natal', 'advocacia natal rn', 'advogado criminalista natal', 'lgpd advogado'],
  openGraph: { type: 'website' as const, locale: 'pt_BR', siteName: 'Cavalcante Albuquerque' },
  robots: { index: true, follow: true },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }, { url: '/favicon.ico' }],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const { siteConfig, navigation, practiceAreas } = await getLayoutData()
  const headerItems = navigation?.headerLinks?.length ? navigation.headerLinks : navItems
  const footerNavItems = headerItems.filter((item: any) => item.href !== '/')
  const structuredData = buildStructuredData(siteConfig)

  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${instrument.variable} ${plexMono.variable}`}>
      <body className="ca-app-body ca-surface-light">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Header items={headerItems} whatsappNumber={siteConfig?.contactPhone} ctaLabel={navigation?.ctaLabel} ctaHref={navigation?.ctaHref} />
        <main className="ca-main">{children}</main>
        <Footer siteConfig={siteConfig} practiceAreas={practiceAreas} navItems={footerNavItems} footerColumns={navigation?.footerColumns} legalLinks={navigation?.legalLinks} />
        <WhatsAppButton />
        <CookieConsent />
      </body>
    </html>
  )
}

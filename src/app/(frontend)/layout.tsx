import React from 'react'
import './styles.css'
import '../../styles/globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { CookieConsent } from '@/components/ui/CookieConsent'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://cavalcantemelo.adv.br'),
  title: {
    default: 'Cavalcante & Melo | Sociedade de Advogados — Natal/RN',
    template: '%s | Cavalcante & Melo Advogados',
  },
  description:
    'Escritório de advocacia em Natal/RN especializado em Direito Digital, LGPD, Civil, Consumidor, Imobiliário, Tributário, Licitações e Direito Penal.',
  keywords: ['advogado natal', 'escritório advocacia natal rn', 'advogado criminalista natal', 'lgpd advogado'],
  openGraph: { type: 'website' as const, locale: 'pt_BR', siteName: 'Cavalcante & Melo Sociedade de Advogados' },
  robots: { index: true, follow: true },
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Source+Sans+3:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LegalService',
              name: 'Cavalcante & Melo Sociedade de Advogados',
              url: process.env.NEXT_PUBLIC_SITE_URL,
              description: 'Escritório de advocacia em Natal/RN.',
              address: { '@type': 'PostalAddress', streetAddress: 'Rua Francisco Maia Sobrinho, 1950', addressLocality: 'Natal', addressRegion: 'RN', postalCode: '59062-250', addressCountry: 'BR' },
              areaServed: { '@type': 'State', name: 'Rio Grande do Norte' },
            }),
          }}
        />
      </head>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Source Sans 3', system-ui, sans-serif", color: '#152138', backgroundColor: '#faf8f5' }}>
        <Header />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
        <WhatsAppButton />
        <CookieConsent />
      </body>
    </html>
  )
}

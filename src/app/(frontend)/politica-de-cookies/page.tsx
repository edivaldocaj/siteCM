import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { LegalDocumentPage } from '@/components/legal/LegalDocumentPage'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://cavalcantealbuquerque.com.br').replace(/\/$/, '')

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Política de cookies e tecnologias similares da Cavalcante Albuquerque.',
  alternates: { canonical: `${siteUrl}/politica-de-cookies` },
  openGraph: {
    title: 'Política de Cookies',
    description: 'Política de cookies e tecnologias similares da Cavalcante Albuquerque.',
    url: `${siteUrl}/politica-de-cookies`,
    images: [{ url: `${siteUrl}/brand/og-default.jpg`, width: 1200, height: 630 }],
  },
}

export default async function PoliticaDeCookiesPage() {
  let brandConfig: any = null
  try {
    const payload = await getPayload({ config: configPromise })
    brandConfig = await (payload as any).findGlobal({ slug: 'brand-config' }).catch(() => null)
  } catch {}

  return (
    <LegalDocumentPage
      title="Política de Cookies"
      description="Informações sobre cookies, preferências e tecnologias usadas para melhorar a experiência no site."
      content={brandConfig?.cookiePolicy}
      updatedAt={brandConfig?.updatedAt}
    />
  )
}

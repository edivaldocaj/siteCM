import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { LegalDocumentPage } from '@/components/legal/LegalDocumentPage'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://cavalcantealbuquerque.com.br').replace(/\/$/, '')

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos de uso do site da Cavalcante Albuquerque.',
  alternates: { canonical: `${siteUrl}/termos-de-uso` },
  openGraph: {
    title: 'Termos de Uso',
    description: 'Termos de uso do site da Cavalcante Albuquerque.',
    url: `${siteUrl}/termos-de-uso`,
    images: [{ url: `${siteUrl}/brand/og-default.jpg`, width: 1200, height: 630 }],
  },
}

export default async function TermosDeUsoPage() {
  let brandConfig: any = null
  try {
    const payload = await getPayload({ config: configPromise })
    brandConfig = await (payload as any).findGlobal({ slug: 'brand-config' }).catch(() => null)
  } catch {}

  return (
    <LegalDocumentPage
      title="Termos de Uso"
      description="Condicoes gerais de uso do site e dos canais digitais do escritorio."
      content={brandConfig?.termsOfUse}
      updatedAt={brandConfig?.updatedAt}
    />
  )
}

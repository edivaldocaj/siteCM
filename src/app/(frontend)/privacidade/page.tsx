import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { LegalDocumentPage } from '@/components/legal/LegalDocumentPage'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://cavalcantealbuquerque.com.br').replace(/\/$/, '')

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Politica de Privacidade',
  description: 'Politica de privacidade e tratamento de dados pessoais da Cavalcante Albuquerque.',
  alternates: { canonical: `${siteUrl}/privacidade` },
  openGraph: {
    title: 'Politica de Privacidade',
    description: 'Politica de privacidade e tratamento de dados pessoais da Cavalcante Albuquerque.',
    url: `${siteUrl}/privacidade`,
    images: [{ url: `${siteUrl}/brand/og-default.jpg`, width: 1200, height: 630 }],
  },
}

export default async function PrivacidadePage() {
  let brandConfig: any = null
  try {
    const payload = await getPayload({ config: configPromise })
    brandConfig = await (payload as any).findGlobal({ slug: 'brand-config' }).catch(() => null)
  } catch {}

  return (
    <LegalDocumentPage
      title="Politica de Privacidade"
      description="Informacoes sobre tratamento de dados pessoais, direitos dos titulares e canais de contato."
      content={brandConfig?.privacyPolicy}
      updatedAt={brandConfig?.updatedAt}
    />
  )
}

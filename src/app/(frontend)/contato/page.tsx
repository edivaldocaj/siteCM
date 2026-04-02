import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ContatoPageClient } from './ContatoPageClient'

export const metadata = {
  title: 'Contato',
  description: 'Entre em contato com o Cavalcante & Melo Sociedade de Advogados. Atendimento em Natal/RN.',
}

export const dynamic = 'force-dynamic'

async function getContactData() {
  try {
    const payload = await getPayload({ config: configPromise })
    const siteConfig = await (payload as any).findGlobal({ slug: 'site-config' }).catch(() => null)
    return { siteConfig }
  } catch {
    return { siteConfig: null }
  }
}

export default async function ContatoPage() {
  const data = await getContactData()
  return <ContatoPageClient siteConfig={data.siteConfig} />
}

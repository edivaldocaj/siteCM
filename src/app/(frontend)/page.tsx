import { HeroSection } from '@/components/sections/HeroSection'
import { TrustBar } from '@/components/sections/TrustBar'
import { PracticeAreasGrid } from '@/components/sections/PracticeAreasGrid'
import { HomePremiumHighlights } from '@/components/sections/HomePremiumHighlights'
import { FeaturedCampaigns } from '@/components/sections/FeaturedCampaigns'
import { TestimonialsCarousel } from '@/components/sections/TestimonialsCarousel'
import { ContactCTA } from '@/components/sections/ContactCTA'

import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

async function getHomeData() {
  try {
    const payload = await getPayload({ config: configPromise })

    const [campaignsRes, testimonialsRes, postsRes, newsRes, practiceAreasRes, teamRes, homepageData, siteConfigData] = await Promise.all([
      (payload as any).find({ collection: 'campaigns', where: { status: { equals: 'active' }, featuredOnHomepage: { equals: true } }, limit: 4, sort: '-createdAt' }).catch(() => ({ docs: [] })),
      (payload as any).find({ collection: 'testimonials', where: { featured: { equals: true } }, limit: 6, sort: '-createdAt' }).catch(() => ({ docs: [] })),
      (payload as any).find({ collection: 'posts', where: { status: { equals: 'published' } }, limit: 4, sort: '-publishedAt', depth: 1 }).catch(() => ({ docs: [] })),
      (payload as any).find({ collection: 'news-articles', where: { status: { equals: 'published' } }, limit: 4, sort: '-publishedAt' }).catch(() => ({ docs: [] })),
      (payload as any).find({ collection: 'practice-areas', limit: 10, sort: 'order', depth: 1 }).catch(() => ({ docs: [] })),
      (payload as any).find({ collection: 'team', where: { active: { equals: true }, showOnSite: { equals: true }, formerMember: { not_equals: true } }, limit: 4, sort: 'order', depth: 1 }).catch(() => ({ docs: [] })),
      (payload as any).findGlobal({ slug: 'homepage' }).catch(() => null),
      (payload as any).findGlobal({ slug: 'site-config' }).catch(() => null),
    ])

    return {
      campaigns: campaignsRes?.docs || [],
      testimonials: testimonialsRes?.docs || [],
      posts: postsRes?.docs || [],
      news: newsRes?.docs || [],
      practiceAreas: practiceAreasRes?.docs || [],
      team: teamRes?.docs || [],
      homepage: homepageData || null,
      siteConfig: siteConfigData || null,
    }
  } catch (e) {
    console.error('[HomePage] Falha ao buscar dados do Payload:', e)
    return { campaigns: [], testimonials: [], posts: [], news: [], practiceAreas: [], team: [], homepage: null, siteConfig: null }
  }
}

export default async function HomePage() {
  const data = await getHomeData()
  const sc = data.siteConfig

  return (
    <div className="ca-home-premium">
      <HeroSection cmsData={sc} />

      <PracticeAreasGrid cmsAreas={data.practiceAreas} featuredOnly />

      <TrustBar cmsData={sc?.trustBarStats?.length ? { stats: sc.trustBarStats } : undefined} />

      <HomePremiumHighlights homepage={data.homepage} posts={data.posts} news={data.news} campaigns={data.campaigns} />

      <FeaturedCampaigns
        cmsCampaigns={data.campaigns}
        cmsData={sc ? {
          title: sc.campaignsTitle,
          subtitle: sc.campaignsSubtitle,
        } : undefined}
      />

      <TestimonialsCarousel
        cmsTestimonials={data.testimonials}
        cmsData={sc ? {
          title: sc.testimonialsTitle,
        } : undefined}
      />

      <ContactCTA
        cmsData={sc ? {
          title: sc.contactTitle,
          subtitle: sc.contactSubtitle,
          email: sc.contactEmail,
          phone: sc.contactPhone,
          address: sc.contactAddress,
        } : undefined}
      />
    </div>
  )
}

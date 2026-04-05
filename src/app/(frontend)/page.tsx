import { HeroSection } from '@/components/sections/HeroSection'
import { TrustBar } from '@/components/sections/TrustBar'
import { PracticeAreasGrid } from '@/components/sections/PracticeAreasGrid'
import { CriminalUrgency } from '@/components/sections/CriminalUrgency'
import { AboutPartners } from '@/components/sections/AboutPartners'
import { FeaturedCampaigns } from '@/components/sections/FeaturedCampaigns'
import { TestimonialsCarousel } from '@/components/sections/TestimonialsCarousel'
import { NewsSection } from '@/components/sections/NewsSection'
import { RecentPosts } from '@/components/sections/RecentPosts'
import { ContactCTA } from '@/components/sections/ContactCTA'

import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

async function getHomeData() {
  try {
    const payload = await getPayload({ config: configPromise })

    const [campaignsRes, testimonialsRes, postsRes, newsRes, practiceAreasRes, homepageData, siteConfigData] = await Promise.all([
      (payload as any).find({ collection: 'campaigns', where: { status: { equals: 'active' }, featuredOnHomepage: { equals: true } }, limit: 4, sort: '-createdAt' }).catch(() => ({ docs: [] })),
      (payload as any).find({ collection: 'testimonials', where: { featured: { equals: true } }, limit: 6, sort: '-createdAt' }).catch(() => ({ docs: [] })),
      (payload as any).find({ collection: 'posts', where: { status: { equals: 'published' } }, limit: 4, sort: '-publishedAt' }).catch(() => ({ docs: [] })),
      (payload as any).find({ collection: 'news-articles', where: { status: { equals: 'published' } }, limit: 4, sort: '-publishedAt' }).catch(() => ({ docs: [] })),
      (payload as any).find({ collection: 'practice-areas', limit: 10, sort: 'order' }).catch(() => ({ docs: [] })),
      (payload as any).findGlobal({ slug: 'homepage' }).catch(() => null),
      (payload as any).findGlobal({ slug: 'site-config' }).catch(() => null),
    ])

    return {
      campaigns: campaignsRes?.docs || [],
      testimonials: testimonialsRes?.docs || [],
      posts: postsRes?.docs || [],
      news: newsRes?.docs || [],
      practiceAreas: practiceAreasRes?.docs || [],
      homepage: homepageData || null,
      siteConfig: siteConfigData || null,
    }
  } catch (e) {
    console.error('[HomePage] Falha ao buscar dados do Payload:', e)
    return { campaigns: [], testimonials: [], posts: [], news: [], practiceAreas: [], homepage: null, siteConfig: null }
  }
}

export default async function HomePage() {
  const data = await getHomeData()
  const sc = data.siteConfig

  return (
    <>
      <HeroSection cmsData={sc} />

      <TrustBar cmsData={sc?.trustBarStats?.length ? { stats: sc.trustBarStats } : undefined} />

      <PracticeAreasGrid cmsAreas={data.practiceAreas} />

      <CriminalUrgency
        cmsData={sc ? {
          tag: sc.criminalTag,
          title: sc.criminalTitle,
          highlight: sc.criminalHighlight,
          description: sc.criminalDescription,
        } : undefined}
      />

      <AboutPartners cmsData={data.homepage?.aboutPartners} />

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

      <NewsSection
        cmsNews={data.news}
        cmsData={sc ? {
          title: sc.newsTitle,
          subtitle: sc.newsSubtitle,
        } : undefined}
      />

      <RecentPosts
        cmsPosts={data.posts}
        cmsData={sc ? {
          title: sc.blogTitle,
          subtitle: sc.blogSubtitle,
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
    </>
  )
}

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

export const revalidate = 60 // Atualiza a página a cada 60 segundos

async function getHomeData() {
  try {
    const payload = await getPayload({ config: configPromise })

    const [campaignsRes, testimonialsRes, postsRes, newsRes, homepageData] = await Promise.all([
      (payload as any).find({ collection: 'campaigns', where: { status: { equals: 'active' }, featuredOnHomepage: { equals: true } }, limit: 3, sort: '-createdAt' }).catch(() => ({ docs: [] })),
      (payload as any).find({ collection: 'testimonials', where: { featured: { equals: true } }, limit: 6, sort: '-createdAt' }).catch(() => ({ docs: [] })),
      (payload as any).find({ collection: 'posts', where: { status: { equals: 'published' } }, limit: 3, sort: '-publishedAt' }).catch(() => ({ docs: [] })),
      (payload as any).find({ collection: 'news-articles', where: { status: { equals: 'published' } }, limit: 4, sort: '-publishedAt' }).catch(() => ({ docs: [] })),
      (payload as any).findGlobal({ slug: 'homepage' }).catch(() => null)
    ])

    return {
      campaigns: campaignsRes?.docs || [],
      testimonials: testimonialsRes?.docs || [],
      posts: postsRes?.docs || [],
      news: newsRes?.docs || [],
      homepage: homepageData || null
    }
  } catch (e) {
    console.error('[HomePage] Falha ao buscar dados do Payload:', e)
    return { campaigns: [], testimonials: [], posts: [], news: [], homepage: null }
  }
}

export default async function HomePage() {
  const data = await getHomeData()

  return (
    <>
      <HeroSection />
      <TrustBar />
      <PracticeAreasGrid />
      <CriminalUrgency />
      <AboutPartners cmsData={data.homepage?.aboutPartners} />
      <FeaturedCampaigns cmsCampaigns={data.campaigns} />
      <TestimonialsCarousel cmsTestimonials={data.testimonials} />
      <NewsSection cmsNews={data.news} />
      <RecentPosts cmsPosts={data.posts} />
      <ContactCTA />
    </>
  )
}
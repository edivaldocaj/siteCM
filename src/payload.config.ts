import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { SiteConfig } from './globals/SiteConfig'
import { BrandConfig } from './globals/BrandConfig'
import { Navigation } from './globals/Navigation'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Team } from './collections/Team'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Campaigns } from './collections/Campaigns'
import { Testimonials } from './collections/Testimonials'
import { PracticeAreas } from './collections/PracticeAreas'
import { NewsArticles } from './collections/NewsArticles'
import { Clients } from './collections/Clients'
import { Leads } from './collections/Leads'
import { CampaignEvents } from './collections/CampaignEvents'
import { ClientDocuments } from './collections/ClientDocuments'
import { NpsResponses } from './collections/NpsResponses'
import { Deadlines } from './collections/Deadlines'
import { Jurisprudence } from './collections/Jurisprudence'
import { Homepage } from './globals/Homepage'
import { AutomationConfig } from './globals/AutomationConfig'
import { Faqs } from './collections/Faqs'
import { AutomationRuns } from './collections/AutomationRuns'
import { AuditLog } from './collections/AuditLog'
import { automationQueue, automationTasks } from './jobs/automationTasks'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const hasJobAccess = ({ req }: { req: { headers: Headers; user?: unknown } }) => {
  const secret = process.env.PAYLOAD_JOBS_ACCESS_SECRET || process.env.CRON_SECRET
  const bearer = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (secret && bearer === secret) return true

  const user = req.user as { role?: unknown; roles?: unknown } | undefined
  const roles = [
    ...(Array.isArray(user?.roles) ? user.roles : []),
    ...(typeof user?.role === 'string' ? [user.role] : []),
  ]

  return roles.includes('admin')
}

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      graphics: {
        Logo: '/components/admin/BrandLogo',
        Icon: '/components/admin/BrandIcon',
      },
      beforeDashboard: ['/components/admin/AdminDashboardIntro'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' | Cavalcante Albuquerque',
    },
  },
  collections: [
    Users,
    Media,
    Team,
    Pages,
    Posts,
    Campaigns,
    Testimonials,
    PracticeAreas,
    NewsArticles,
    Clients,
    Leads,
    CampaignEvents,
    ClientDocuments,
    NpsResponses,
    Deadlines,
    Jurisprudence,
    Faqs,
    AutomationRuns,
    AuditLog,
  ],
  globals: [
    Homepage,
    SiteConfig,
    BrandConfig,
    Navigation,
    AutomationConfig,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    push: process.env.PAYLOAD_DB_PUSH === 'true',
  }),
  jobs: {
    access: {
      cancel: hasJobAccess,
      queue: hasJobAccess,
      run: hasJobAccess,
    },
    addParentToTaskLog: true,
    autoRun:
      process.env.PAYLOAD_JOBS_AUTORUN === 'true'
        ? [
            {
              cron: process.env.PAYLOAD_JOBS_RUN_CRON || '* * * * *',
              limit: Number(process.env.PAYLOAD_JOBS_RUN_LIMIT || 10),
              queue: automationQueue,
            },
          ]
        : undefined,
    deleteJobOnComplete: false,
    jobsCollectionOverrides: ({ defaultJobsCollection }) => ({
      ...defaultJobsCollection,
      admin: {
        ...defaultJobsCollection.admin,
        defaultColumns: ['taskSlug', 'queue', 'processing', 'hasError', 'completedAt', 'createdAt'],
        group: 'Operação',
        hidden: false,
        useAsTitle: 'taskSlug',
      },
      labels: {
        plural: 'Jobs Payload',
        singular: 'Job Payload',
      },
    }),
    tasks: automationTasks,
  },
  sharp,
  plugins: [],
})

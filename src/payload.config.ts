import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { SiteConfig } from './globals/SiteConfig'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Forçar push do schema em qualquer ambiente (cria tabelas faltando)
// O Payload 3.x só faz push em NODE_ENV=development por padrão
if (process.env.PAYLOAD_FORCE_SCHEMA_PUSH === 'true') {
  process.env.NODE_ENV = process.env.NODE_ENV // preserve
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' | Cavalcante & Melo Admin',
    },
  },
  collections: [
    Users,
    Media,
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
  ],
  globals: [
    Homepage,
    SiteConfig,
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
    push: true,
  }),
  sharp,
  plugins: [],
})
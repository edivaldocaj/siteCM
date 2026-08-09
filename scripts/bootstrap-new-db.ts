import { getPayload } from 'payload'
import config from '../src/payload.config'

const pending = '__PENDENTE__'

function requiredEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`${name} nao configurado`)
  return value
}

async function upsertBySlug(payload: any, collection: string, slug: string, data: Record<string, unknown>) {
  const existing = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })

  if (existing.docs?.[0]) {
    await payload.update({ collection, id: existing.docs[0].id, data })
    return 'updated'
  }

  await payload.create({ collection, data: { ...data, slug } })
  return 'created'
}

async function upsertAdmin(payload: any) {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.log('skipped: admin user (defina ADMIN_EMAIL e ADMIN_PASSWORD para criar/atualizar)')
    return
  }

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    depth: 0,
  })

  const data = {
    email,
    password,
    name: process.env.ADMIN_NAME || 'Administrador',
    roles: ['admin'],
    role: 'admin',
  }

  if (existing.docs?.[0]) {
    await payload.update({ collection: 'users', id: existing.docs[0].id, data })
    console.log(`updated: admin user ${email}`)
    return
  }

  await payload.create({ collection: 'users', data })
  console.log(`created: admin user ${email}`)
}

async function seedGlobals(payload: any) {
  await payload.updateGlobal({
    slug: 'brand-config',
    data: {
      tradeName: 'Cavalcante Albuquerque',
      descriptor: 'Advocacia e Consultoria',
      legalName: pending,
      cnpj: pending,
      oabRegistration: pending,
      founderName: pending,
      foundedYear: pending,
      tagline: 'Advocacia com estrategia e solidez.',
      domain: 'cavalcantealbuquerque.com.br',
      email: process.env.PUBLIC_CONTACT_EMAIL || pending,
      phone: process.env.PUBLIC_CONTACT_PHONE || pending,
      whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || pending,
      whatsappDefaultMessage: 'Ola, gostaria de atendimento juridico.',
      addressStreet: pending,
      addressDistrict: pending,
      addressCity: 'Natal',
      addressState: 'RN',
      addressZip: pending,
      emergencyLine: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || pending,
      emergencyLabel: 'Plantao criminal 24h',
      dpoName: pending,
      dpoEmail: pending,
      oabDisclaimer: 'Informacoes de carater exclusivamente informativo, sem promessa de resultado e conforme o Codigo de Etica e Disciplina da OAB.',
    },
  })
  console.log('updated: brand-config')

  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      headerLinks: [
        { label: 'Inicio', href: '/', highlight: false },
        { label: 'Sobre', href: '/sobre', highlight: false },
        { label: 'Areas de atuacao', href: '/areas-de-atuacao', highlight: false },
        { label: 'Campanhas', href: '/campanhas', highlight: false },
        { label: 'Blog', href: '/blog', highlight: false },
        { label: 'Contato', href: '/contato', highlight: false },
      ],
      legalLinks: [
        { label: 'Politica de privacidade', href: '/privacidade' },
        { label: 'Termos de uso', href: '/termos-de-uso' },
        { label: 'Politica de cookies', href: '/politica-de-cookies' },
      ],
      ctaLabel: 'Fale com um advogado',
      ctaHref: '/contato',
    },
  })
  console.log('updated: navigation')

  await payload.updateGlobal({
    slug: 'site-config',
    data: {
      heroTitle: 'Advocacia com estrategia e solidez.',
      heroSubtitle: 'Atendimento juridico em Natal/RN com analise tecnica e acompanhamento direto.',
      heroButtonText: 'Fale com um advogado',
      contactTitle: 'Fale com nossa equipe',
      contactSubtitle: 'Envie sua demanda para uma avaliacao inicial.',
      contactEmail: process.env.PUBLIC_CONTACT_EMAIL || pending,
      contactPhone: process.env.PUBLIC_CONTACT_PHONE || pending,
      contactAddress: pending,
      practiceTitle: 'Areas de Atuacao',
      practiceSubtitle: 'Atuacao juridica organizada por contexto e necessidade do cliente.',
      campaignsTitle: 'Campanhas Juridicas',
      campaignsSubtitle: 'Iniciativas ativas para demandas recorrentes.',
      blogTitle: 'Artigos Recentes',
      blogSubtitle: 'Conteudo juridico em linguagem direta.',
      newsTitle: 'Noticias do Direito',
      newsSubtitle: 'Atualizacoes juridicas acompanhadas pela equipe.',
      testimonialsTitle: 'O que nossos clientes dizem',
    },
  })
  console.log('updated: site-config')

  await payload.updateGlobal({
    slug: 'automation-config',
    data: {
      newsEnabled: false,
      newsIntervalHours: 4,
      newsAutoPublishScore: 85,
      newsRetentionDays: 90,
      leadAutoReply: false,
      leadSlaHours: 4,
      leadEscalationEmail: pending,
      deadlineAlertsEnabled: false,
      deadlineAlertDays: [{ days: 7 }, { days: 3 }, { days: 1 }, { days: 0 }],
      deadlineAlertHour: 8,
      datajudSyncEnabled: false,
      datajudSyncHour: 7,
      npsTriggerDays: 30,
      npsAutoTestimonial: false,
      socialAutoGenerate: false,
    },
  })
  console.log('updated: automation-config')

  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      aboutPartners: {
        sectionTitle: 'Quem conduz o seu caso',
        sectionDescription: 'Atendimento juridico com responsabilidade tecnica e comunicacao direta.',
        partnersList: [
          {
            name: 'Dr. Edivaldo Cavalcante Albuquerque',
            role: 'Advogado Titular',
            areas: 'Direito Civil, Consumidor, Digital, Penal e Consultoria',
            oab: pending,
            bio: pending,
          },
        ],
      },
    },
  })
  console.log('updated: homepage')
}

async function seedTeam(payload: any) {
  const members = [
    {
      name: 'Dr. Edivaldo Cavalcante Albuquerque',
      shortName: 'Dr. Edivaldo',
      slug: 'edivaldo-cavalcante-albuquerque',
      role: 'Advogado Titular',
      oab: pending,
      active: true,
      showOnSite: true,
      formerMember: false,
      order: 1,
    },
  ]

  for (const member of members) {
    const action = await upsertBySlug(payload, 'team', member.slug, member)
    console.log(`${action}: team/${member.slug}`)
  }
}

async function seedPracticeAreas(payload: any) {
  const areas = [
    ['Direito Digital e LGPD', 'direito-digital', 'shield', 'Atuacao em protecao de dados, privacidade, plataformas digitais e conflitos envolvendo tecnologia.'],
    ['Direito Civil', 'direito-civil', 'scale', 'Atuacao em contratos, responsabilidade civil, obrigacoes e conflitos patrimoniais.'],
    ['Direito do Consumidor', 'direito-consumidor', 'shopping-bag', 'Atuacao em relacoes de consumo, bancos, servicos, cobrancas e indenizacoes.'],
    ['Direito Imobiliario', 'direito-imobiliario', 'home', 'Atuacao em contratos imobiliarios, posse, propriedade, locacao e regularizacao.'],
    ['Direito Tributario', 'direito-tributario', 'receipt', 'Consultoria e contencioso tributario para pessoas fisicas e empresas.'],
    ['Licitacoes e Contratos Administrativos', 'licitacoes', 'file-text', 'Apoio juridico em licitacoes, contratos publicos e relacoes com a administracao.'],
    ['Direito Penal', 'direito-penal', 'gavel', 'Defesa tecnica em demandas criminais e atendimento em situacoes urgentes.'],
  ] as const

  for (const [title, slug, icon, shortDescription] of areas) {
    const action = await upsertBySlug(payload, 'practice-areas', slug, {
      title,
      slug,
      icon,
      shortDescription,
      heroHeadline: shortDescription,
      byFirm: true,
      is24h: slug === 'direito-penal',
      order: areas.findIndex((area) => area[1] === slug) + 1,
      seo: {
        metaTitle: `${title} | Cavalcante Albuquerque`,
        metaDescription: shortDescription,
      },
    })
    console.log(`${action}: practice-areas/${slug}`)
  }
}

async function main() {
  requiredEnv('DATABASE_URL')
  requiredEnv('PAYLOAD_SECRET')

  const payload = await getPayload({ config })

  await upsertAdmin(payload)
  await seedGlobals(payload)
  await seedTeam(payload)
  await seedPracticeAreas(payload)

  console.log('bootstrap concluido')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

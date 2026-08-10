import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const pending = '__PENDENTE__'
const now = new Date()
const nowISO = now.toISOString()

type PayloadInstance = Awaited<ReturnType<typeof getPayload>>
type Where = Record<string, unknown>

function daysFromNow(days: number, hour = 9) {
  const date = new Date(now)
  date.setDate(date.getDate() + days)
  date.setHours(hour, 0, 0, 0)
  return date.toISOString()
}

function daysAgo(days: number, hour = 10) {
  const date = new Date(now)
  date.setDate(date.getDate() - days)
  date.setHours(hour, 0, 0, 0)
  return date.toISOString()
}

function richText(...paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        textFormat: 0,
        textStyle: '',
        children: [{ type: 'text', text, version: 1 }],
      })),
    },
  }
}

async function findOne(payload: PayloadInstance, collection: string, where: Where) {
  const result = await (payload as any).find({ collection, where, limit: 1, depth: 0 })
  return result.docs?.[0] || null
}

async function upsert(payload: PayloadInstance, collection: string, where: Where, data: Record<string, unknown>, label: string) {
  const existing = await findOne(payload, collection, where)

  if (existing) {
    const updated = await (payload as any).update({ collection, id: existing.id, data })
    console.log(`updated: ${collection}/${label}`)
    return updated
  }

  const created = await (payload as any).create({ collection, data })
  console.log(`created: ${collection}/${label}`)
  return created
}

async function upsertBySlug(payload: PayloadInstance, collection: string, slug: string, data: Record<string, unknown>) {
  return upsert(payload, collection, { slug: { equals: slug } }, { ...data, slug }, slug)
}

async function upsertByTitle(payload: PayloadInstance, collection: string, title: string, data: Record<string, unknown>) {
  return upsert(payload, collection, { title: { equals: title } }, { ...data, title }, title)
}

async function seedMedia(payload: PayloadInstance) {
  const assets = [
    ['Logo claro Cavalcante Albuquerque', 'public/brand/lockup-light.webp'],
    ['Logo escuro Cavalcante Albuquerque', 'public/brand/lockup-dark.webp'],
    ['Símbolo Cavalcante Albuquerque', 'public/brand/symbol.svg'],
    ['Imagem de capa institucional', 'public/brand/og-default.jpg'],
    ['Sala de atendimento', 'public/brand/office-room.webp'],
    ['Porta do escritório', 'public/brand/office-door.webp'],
    ['Cartão de visita frente', 'public/brand/business-card-front.webp'],
    ['Cartão de visita verso', 'public/brand/business-card-back.webp'],
    ['Apresentação institucional', 'public/brand/hero-presentation.webp'],
    ['Áreas de atuação', 'public/brand/areas-presentation.webp'],
  ] as const

  const ids: Record<string, string | number> = {}

  for (const [alt, relativePath] of assets) {
    const filePath = path.resolve(process.cwd(), relativePath)
    const existing = await findOne(payload, 'media', { alt: { equals: alt } })

    if (existing) {
      ids[alt] = existing.id
      console.log(`kept: media/${alt}`)
      continue
    }

    if (!fs.existsSync(filePath)) {
      console.log(`skipped: media/${alt} (${relativePath} não encontrado)`)
      continue
    }

    const created = await (payload as any).create({
      collection: 'media',
      data: { alt },
      filePath,
    })
    ids[alt] = created.id
    console.log(`created: media/${alt}`)
  }

  return ids
}

async function seedUsers(payload: PayloadInstance) {
  const password = process.env.DEMO_USER_PASSWORD
  if (!password) {
    console.log('skipped: demo users (defina DEMO_USER_PASSWORD para criar editor/staff/client demo)')
    return {}
  }

  const users = [
    { email: 'editor@cavalcantealbuquerque.com.br', name: 'Editor Demo', roles: ['editor'], role: 'editor' },
    { email: 'staff@cavalcantealbuquerque.com.br', name: 'Equipe Demo', roles: ['staff'], role: 'editor' },
    { email: 'cliente.demo@cavalcantealbuquerque.com.br', name: 'Cliente Demo', roles: ['client'], role: 'editor' },
  ]

  const ids: Record<string, string | number> = {}
  for (const user of users) {
    const doc = await upsert(
      payload,
      'users',
      { email: { equals: user.email } },
      { ...user, password },
      user.email,
    )
    ids[user.email] = doc.id
  }

  return ids
}

async function seedGlobals(payload: PayloadInstance, media: Record<string, string | number>) {
  await (payload as any).updateGlobal({
    slug: 'brand-config',
    data: {
      tradeName: 'Cavalcante Albuquerque',
      descriptor: 'Advocacia e Consultoria',
      legalName: pending,
      cnpj: pending,
      oabRegistration: pending,
      founderName: 'Dr. Edivaldo Cavalcante Albuquerque',
      foundedYear: pending,
      tagline: 'Advocacia com estratégia e solidez.',
      domain: 'cavalcantealbuquerque.com.br',
      logoLight: media['Logo claro Cavalcante Albuquerque'],
      logoDark: media['Logo escuro Cavalcante Albuquerque'],
      symbol: media['Símbolo Cavalcante Albuquerque'],
      ogDefault: media['Imagem de capa institucional'],
      email: process.env.PUBLIC_CONTACT_EMAIL || process.env.CONTACT_EMAIL || 'contato@cavalcantealbuquerque.com.br',
      phone: process.env.PUBLIC_CONTACT_PHONE || '(84) 99124-3985',
      whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985',
      whatsappDefaultMessage: process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || 'Olá, gostaria de atendimento jurídico.',
      addressStreet: 'Rua Francisco Maia Sobrinho, 1950',
      addressDistrict: 'Lagoa Nova',
      addressCity: 'Natal',
      addressState: 'RN',
      addressZip: '59062-250',
      latitude: -5.825,
      longitude: -35.211,
      emergencyLine: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985',
      emergencyLabel: 'Plantão criminal 24h',
      businessHours: [
        { day: 'Segunda a sexta', opensAt: '08:00', closesAt: '18:00' },
        { day: 'Urgências criminais', opensAt: '24h', closesAt: '24h' },
      ],
      instagram: 'https://www.instagram.com/cavalcantealbuquerque',
      linkedin: 'https://www.linkedin.com/company/cavalcantealbuquerque',
      googleBusiness: 'https://g.page/r/__PENDENTE__',
      privacyPolicy: richText(
        'A Cavalcante Albuquerque trata dados pessoais apenas para atendimento jurídico, triagem de contatos, cumprimento de obrigações legais e comunicação institucional.',
        'Este texto é demonstrativo e deve ser revisado antes da publicação final.',
      ),
      termsOfUse: richText(
        'O uso deste site não cria relação advogado-cliente. As informações publicadas têm caráter exclusivamente informativo.',
        'Toda orientação jurídica depende de análise individual dos documentos e fatos apresentados.',
      ),
      cookiePolicy: richText(
        'O site pode utilizar cookies essenciais, analíticos e de preferência para melhorar a experiência de navegação.',
        'O visitante pode gerenciar permissões no banner de cookies quando disponível.',
      ),
      dpoName: pending,
      dpoEmail: pending,
      oabDisclaimer: 'Informações de caráter exclusivamente informativo, sem promessa de resultado e conforme o Código de Ética e Disciplina da OAB.',
    },
  })

  await (payload as any).updateGlobal({
    slug: 'site-config',
    data: {
      heroTitle: 'Advocacia com estratégia e solidez.',
      heroSubtitle: 'Atendimento jurídico em Natal/RN com análise técnica, comunicação direta e acompanhamento cuidadoso em cada etapa do caso.',
      heroButtonText: 'Fale com um advogado',
      trustBarStats: [
        { value: 24, suffix: 'h', label: 'Plantão criminal' },
        { value: 7, suffix: '+', label: 'Áreas de atuação' },
        { value: 10, suffix: '+', label: 'Campanhas estruturadas' },
        { value: 1, suffix: ':1', label: 'Contato direto' },
      ],
      criminalTag: 'Defesa criminal - atendimento imediato',
      criminalTitle: 'Urgência exige técnica e resposta rápida.',
      criminalHighlight: 'Atuação 24h para flagrantes, audiências de custódia e medidas urgentes.',
      criminalDescription: 'Em situações criminais, cada hora importa. O atendimento inicial organiza documentos, identifica riscos e define os próximos passos com objetividade.',
      campaignsTitle: 'Campanhas jurídicas',
      campaignsSubtitle: 'Frentes de atendimento para demandas recorrentes de consumidores, empresas e famílias.',
      testimonialsTitle: 'Relatos de atendimento',
      newsTitle: 'Notícias do Direito',
      newsSubtitle: 'Atualizações jurídicas selecionadas para leitura rápida.',
      blogTitle: 'Artigos recentes',
      blogSubtitle: 'Conteúdo jurídico em linguagem direta para orientar decisões.',
      aboutTitle: 'Sobre o Escritório',
      aboutSubtitle: 'Advocacia com estratégia, técnica e presença institucional.',
      aboutHistory: 'A Cavalcante Albuquerque nasce para oferecer atendimento jurídico técnico, organizado e próximo do cliente. A estrutura combina atuação consultiva, contenciosa e resposta rápida em urgências.',
      aboutTimeline: [
        { year: 'Base técnica', title: 'Método de análise', description: 'Triagem objetiva, organização documental e definição de riscos antes de qualquer medida.' },
        { year: 'Atuação', title: 'Consultivo e contencioso', description: 'Demandas cíveis, consumeristas, digitais, imobiliárias, tributárias, administrativas e criminais.' },
        { year: 'Hoje', title: 'Cavalcante Albuquerque', description: 'Escritório estruturado para atendimento em Natal/RN e canais digitais.' },
      ],
      aboutValues: [
        { title: 'Técnica', description: 'Análise jurídica consistente antes de qualquer medida.', icon: 'scale' },
        { title: 'Clareza', description: 'Comunicação direta sobre riscos, prazos e próximos passos.', icon: 'users' },
        { title: 'Solidez', description: 'Estratégias sustentadas por documentos, precedentes e contexto do cliente.', icon: 'shield' },
        { title: 'Responsabilidade', description: 'Atuação compatível com a ética profissional e sem promessa de resultado.', icon: 'heart' },
      ],
      practiceTitle: 'Áreas de atuação',
      practiceSubtitle: 'Atuação estratégica em áreas essenciais do Direito, com leitura técnica do caso e comunicação clara desde o primeiro contato.',
      contactTitle: 'Fale com a Cavalcante Albuquerque',
      contactSubtitle: 'Descreva sua demanda para uma avaliação inicial do melhor caminho jurídico.',
      contactEmail: process.env.PUBLIC_CONTACT_EMAIL || process.env.CONTACT_EMAIL || 'contato@cavalcantealbuquerque.com.br',
      contactPhone: process.env.PUBLIC_CONTACT_PHONE || '(84) 99124-3985',
      contactAddress: 'Rua Francisco Maia Sobrinho, 1950\nLagoa Nova - Natal/RN, 59062-250',
    },
  })

  await (payload as any).updateGlobal({
    slug: 'homepage',
    data: {
      aboutPartners: {
        sectionTitle: 'Quem conduz o seu caso',
        sectionDescription: 'Atendimento jurídico com responsabilidade técnica, leitura estratégica e contato direto.',
        partnersList: [
          {
            name: 'Dr. Edivaldo Cavalcante Albuquerque',
            role: 'Advogado Titular',
            areas: 'Civil, Consumidor, Digital, Penal e Consultoria',
            oab: pending,
            bio: 'Atuação focada em estratégia jurídica, proteção de direitos e acompanhamento próximo do cliente.',
          },
          {
            name: 'Cavalcante Albuquerque',
            role: 'Equipe técnica',
            areas: 'Triagem, acompanhamento, documentação e atendimento',
            oab: pending,
            bio: 'Equipe de apoio responsável por organização documental, atualização de informações e fluxo de atendimento.',
          },
        ],
      },
    },
  })

  await (payload as any).updateGlobal({
    slug: 'navigation',
    data: {
      headerLinks: [
        { label: 'Início', href: '/', highlight: false },
        { label: 'Sobre', href: '/sobre', highlight: false },
        { label: 'Áreas de atuação', href: '/areas-de-atuacao', highlight: false },
        { label: 'Campanhas', href: '/campanhas', highlight: true },
        { label: 'Blog', href: '/blog', highlight: false },
        { label: 'Contato', href: '/contato', highlight: false },
      ],
      footerColumns: [
        {
          title: 'Institucional',
          links: [
            { label: 'Sobre', href: '/sobre' },
            { label: 'Áreas de atuação', href: '/areas-de-atuacao' },
            { label: 'Campanhas', href: '/campanhas' },
            { label: 'Blog', href: '/blog' },
          ],
        },
        {
          title: 'Serviços',
          links: [
            { label: 'Direito Digital e LGPD', href: '/areas-de-atuacao/direito-digital' },
            { label: 'Direito do Consumidor', href: '/areas-de-atuacao/direito-consumidor' },
            { label: 'Direito Penal', href: '/areas-de-atuacao/direito-penal' },
            { label: 'Licitações', href: '/areas-de-atuacao/licitacoes' },
          ],
        },
      ],
      legalLinks: [
        { label: 'Política de privacidade', href: '/privacidade' },
        { label: 'Termos de uso', href: '/termos-de-uso' },
        { label: 'Política de cookies', href: '/politica-de-cookies' },
      ],
      ctaLabel: 'Fale com um advogado',
      ctaHref: '/contato',
    },
  })

  await (payload as any).updateGlobal({
    slug: 'automation-config',
    data: {
      newsEnabled: true,
      newsIntervalHours: 6,
      newsAutoPublishScore: 90,
      newsRetentionDays: 90,
      newsSources: [
        { label: 'Conjur', url: 'https://www.conjur.com.br/rss.xml', enabled: true },
        { label: 'Migalhas', url: 'https://www.migalhas.com.br/rss/quentes', enabled: true },
        { label: 'STJ Notícias', url: 'https://www.stj.jus.br/sites/portalp/RSS', enabled: false },
      ],
      leadAutoReply: true,
      leadAutoReplyTemplate: 'Olá, recebemos sua solicitação. Nossa equipe fará a triagem inicial e retornará pelos canais informados.',
      leadSlaHours: 4,
      leadEscalationEmail: process.env.PUBLIC_CONTACT_EMAIL || pending,
      deadlineAlertsEnabled: true,
      deadlineAlertDays: [{ days: 7 }, { days: 3 }, { days: 1 }, { days: 0 }],
      deadlineAlertHour: 8,
      datajudSyncEnabled: false,
      datajudSyncHour: 7,
      npsTriggerDays: 30,
      npsAutoTestimonial: false,
      socialAutoGenerate: false,
    },
  })

  console.log('updated: all globals')
}

async function seedTeam(payload: PayloadInstance) {
  const edivaldo = await upsertBySlug(payload, 'team', 'edivaldo-cavalcante-albuquerque', {
    name: 'Dr. Edivaldo Cavalcante Albuquerque',
    shortName: 'Dr. Edivaldo',
    role: 'Advogado Titular',
    oab: pending,
    email: process.env.PUBLIC_CONTACT_EMAIL || 'contato@cavalcantealbuquerque.com.br',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985',
    bio: richText(
      'Advogado titular da Cavalcante Albuquerque, com atuação em demandas consultivas e contenciosas.',
      'Atendimento orientado por estratégia, organização documental e comunicação direta com o cliente.',
    ),
    linkedin: 'https://www.linkedin.com/in/__PENDENTE__',
    order: 1,
    active: true,
    showOnSite: true,
    formerMember: false,
  })

  const equipe = await upsertBySlug(payload, 'team', 'equipe-cavalcante-albuquerque', {
    name: 'Equipe Cavalcante Albuquerque',
    shortName: 'Equipe CA',
    role: 'Equipe de atendimento e apoio técnico',
    oab: pending,
    email: process.env.PUBLIC_CONTACT_EMAIL || 'contato@cavalcantealbuquerque.com.br',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985',
    bio: richText(
      'Equipe responsável pela triagem inicial, organização de documentos, atualização de prazos e apoio aos fluxos internos.',
      'Registro demonstrativo para composição do CMS e validação visual das áreas administrativas.',
    ),
    order: 2,
    active: true,
    showOnSite: false,
    formerMember: false,
  })

  const historico = await upsertBySlug(payload, 'team', 'gabrielly-melo-historico', {
    name: 'Dra. Gabrielly Melo',
    shortName: 'Dra. Gabrielly',
    role: 'Registro histórico',
    oab: pending,
    bio: richText('Registro mantido apenas para preservação de autoria histórica em conteúdos antigos, sem exibição pública.'),
    order: 99,
    active: false,
    showOnSite: false,
    formerMember: true,
  })

  return { edivaldoId: edivaldo.id, equipeId: equipe.id, historicoId: historico.id }
}

async function seedPracticeAreas(payload: PayloadInstance, teamId: string | number) {
  const areas = [
    ['Direito Digital e LGPD', 'direito-digital', 'shield', 'Proteção de dados, contratos digitais, incidentes de segurança e conflitos em plataformas.', ['Adequação LGPD', 'Vazamento de dados', 'Remoção de conteúdo', 'Contratos digitais']],
    ['Direito Civil', 'direito-civil', 'scale', 'Contratos, responsabilidade civil, cobranças, indenizações e conflitos patrimoniais.', ['Revisão contratual', 'Indenização', 'Cobrança', 'Obrigações']],
    ['Direito do Consumidor', 'direito-consumidor', 'shopping-bag', 'Fraudes bancárias, negativação indevida, cobranças abusivas e falhas de serviço.', ['Fraude bancária', 'Negativação indevida', 'Cobrança abusiva', 'Produto com defeito']],
    ['Direito Imobiliário', 'direito-imobiliario', 'home', 'Compra e venda, locação, posse, propriedade, regularização e conflitos condominiais.', ['Contrato imobiliário', 'Locação', 'Usucapião', 'Condomínio']],
    ['Direito Tributário', 'direito-tributario', 'receipt', 'Consultoria, defesa administrativa, execuções fiscais e planejamento tributário.', ['Execução fiscal', 'Defesa administrativa', 'Parcelamento', 'Planejamento']],
    ['Licitações e Contratos Administrativos', 'licitacoes', 'file-text', 'Apoio em editais, recursos, impugnações, contratos públicos e relações com a administração.', ['Impugnação de edital', 'Recurso administrativo', 'Contrato público', 'Sanções administrativas']],
    ['Direito Penal', 'direito-penal', 'gavel', 'Defesa técnica em investigações, flagrantes, audiências de custódia e medidas urgentes.', ['Flagrante', 'Audiência de custódia', 'Inquérito policial', 'Medidas cautelares']],
  ] as const

  const ids: Record<string, string | number> = {}

  for (const [index, area] of areas.entries()) {
    const [title, slug, icon, shortDescription, caseTypes] = area
    const doc = await upsertBySlug(payload, 'practice-areas', slug, {
      title,
      icon,
      shortDescription,
      heroHeadline: shortDescription,
      content: richText(
        `${title} exige avaliação individual do contexto, documentos disponíveis e riscos envolvidos.`,
        'O atendimento inicial organiza informações, identifica urgências e define uma estratégia proporcional à demanda.',
        'Este conteúdo é demonstrativo e pode ser substituído pela redação definitiva aprovada pelo escritório.',
      ),
      caseTypes: caseTypes.map((name) => ({ name })),
      faq: [
        { question: 'Como funciona o primeiro atendimento?', answer: 'A equipe coleta os fatos principais, documentos e prazos para indicar os próximos passos.' },
        { question: 'O atendimento pode ser online?', answer: 'Sim. O contato inicial pode ocorrer por WhatsApp, telefone ou formulário do site.' },
        { question: 'Existe garantia de resultado?', answer: 'Não. A atuação jurídica depende dos fatos, provas, normas aplicáveis e entendimento dos órgãos competentes.' },
      ],
      attorney: 'edivaldo',
      responsibleRef: teamId,
      byFirm: true,
      is24h: slug === 'direito-penal',
      order: index + 1,
      seo: { metaTitle: `${title} | Cavalcante Albuquerque`, metaDescription: shortDescription },
    })
    ids[slug] = doc.id
  }

  return ids
}

async function seedFaqs(payload: PayloadInstance, areaIds: Record<string, string | number>) {
  const faqs = [
    ['Como funciona o primeiro atendimento?', 'A triagem inicial identifica fatos, documentos, urgência e possíveis caminhos jurídicos.', 'direito-civil'],
    ['O atendimento pode ser remoto?', 'Sim. É possível iniciar por WhatsApp, telefone ou formulário, com envio digital de documentos.', 'direito-digital'],
    ['Quais documentos devo separar?', 'Contratos, comprovantes, mensagens, protocolos, decisões, notificações e documentos pessoais relacionados ao caso.', 'direito-civil'],
    ['Há promessa de resultado?', 'Não. A advocacia trabalha com análise técnica de riscos e possibilidades, sem promessa de resultado.', 'direito-civil'],
    ['Como agir em fraude bancária?', 'Registre protocolos, bloqueie cartões se necessário, preserve prints e extratos e busque orientação rapidamente.', 'direito-consumidor'],
    ['O que fazer em negativação indevida?', 'Guarde comprovantes, consultas ao cadastro e comunicações da empresa antes de qualquer negociação.', 'direito-consumidor'],
    ['Quando procurar apoio em LGPD?', 'Ao coletar dados de clientes, responder incidentes, revisar contratos ou estruturar políticas internas.', 'direito-digital'],
    ['O que informar em urgência criminal?', 'Local dos fatos, autoridade envolvida, nome da pessoa, documentos disponíveis e situação atual.', 'direito-penal'],
    ['Como funciona uma impugnação de edital?', 'A análise compara exigências do edital com legislação, jurisprudência e documentos da empresa.', 'licitacoes'],
    ['Prazos podem ser acompanhados pelo portal?', 'Sim. O portal do cliente pode centralizar documentos, resumos e prazos cadastrados pela equipe.', 'direito-civil'],
    ['A consultoria tributária substitui contador?', 'Não. A atuação jurídica complementa a contabilidade na análise normativa, riscos e defesa.', 'direito-tributario'],
    ['É possível regularizar imóvel sem escritura?', 'Depende da origem da posse, documentos, tempo, confrontantes e situação registral.', 'direito-imobiliario'],
  ]

  for (const [index, [question, answer, areaSlug]] of faqs.entries()) {
    await upsert(payload, 'faqs', { question: { equals: question } }, {
      question,
      answer: richText(answer),
      area: areaIds[areaSlug],
      order: index + 1,
      active: true,
    }, question)
  }
}

async function seedCampaigns(payload: PayloadInstance, media: Record<string, string | number>) {
  const campaigns = [
    ['Fraudes bancárias e golpes digitais', 'fraudes-bancarias', 'consumidor', 'Conteste transações não reconhecidas, empréstimos fraudulentos e falhas de segurança bancária.', 'Atendimento para bloqueio de danos e organização de provas.', 'red'],
    ['Negativação indevida', 'negativacao-indevida', 'consumidor', 'Avaliação de inscrições indevidas em cadastros restritivos e pedidos de retirada quando cabível.', 'Preserve comprovantes antes de negociar qualquer dívida.', 'blue'],
    ['Plantão criminal 24h', 'plantao-criminal-24h', 'criminal', 'Atendimento para flagrante, audiência de custódia, busca e apreensão e medidas urgentes.', 'Plantão criminal: resposta imediata por WhatsApp.', 'red'],
    ['Adequação LGPD para pequenos negócios', 'lgpd-pequenos-negocios', 'digital', 'Estruture avisos, contratos, bases legais e fluxos mínimos de proteção de dados.', 'Evite tratar dados sem política e documentação básica.', 'blue'],
    ['Contratos empresariais preventivos', 'contratos-empresariais', 'consumidor', 'Revisão e elaboração de contratos para reduzir riscos em relações comerciais.', 'Formalize obrigações antes que o conflito apareça.', 'gold'],
    ['Regularização de imóveis', 'regularizacao-imoveis', 'imobiliario', 'Análise de posse, matrícula, contratos, inventário e caminhos de regularização imobiliária.', 'Organize documentos antes de vender, comprar ou reformar.', 'green'],
    ['Execução fiscal e dívidas tributárias', 'execucao-fiscal', 'tributario', 'Defesa em cobranças fiscais, parcelamentos, garantias e análise de exigibilidade.', 'Prazos tributários exigem resposta técnica.', 'gold'],
    ['Licitações e recursos administrativos', 'recursos-licitacoes', 'tributario', 'Apoio jurídico para impugnações, recursos, diligências e contratos administrativos.', 'Atue antes da perda do prazo administrativo.', 'blue'],
    ['Cobranças abusivas e juros bancários', 'cobrancas-abusivas', 'consumidor', 'Avaliação de cobranças, tarifas, juros e contratos bancários com indícios de abuso.', 'Não assuma renegociação sem entender o contrato.', 'green'],
    ['Remoção de conteúdo e proteção de reputação', 'remocao-conteudo-reputacao', 'digital', 'Medidas para preservar provas, solicitar remoção e avaliar responsabilidade civil digital.', 'Prints e URLs completos são essenciais.', 'blue'],
  ] as const

  const ids: Record<string, string | number> = {}
  for (const [index, [title, slug, category, subtitle, urgencyText, colorAccent]] of campaigns.entries()) {
    const doc = await upsertBySlug(payload, 'campaigns', slug, {
      title,
      category,
      status: index < 8 ? 'active' : 'paused',
      heroImage: media['Imagem de capa institucional'],
      subtitle,
      problemDescription: richText(
        'Demandas urgentes costumam chegar com informação fragmentada, documentos dispersos e dúvidas sobre o melhor caminho.',
        'A campanha organiza a triagem inicial e facilita a coleta de dados relevantes para avaliação jurídica.',
      ),
      rightsExplanation: richText(
        'Cada caso exige análise individual. A avaliação considera documentos, provas, prazos, valores envolvidos e riscos de cada medida.',
        'O conteúdo é informativo e não substitui consulta jurídica personalizada.',
      ),
      benefits: richText(
        'O atendimento busca reduzir incertezas, preservar provas, orientar próximos passos e estruturar uma estratégia compatível com o contexto.',
        'Não há promessa de resultado. A condução depende dos fatos, normas aplicáveis e entendimento das autoridades competentes.',
      ),
      socialProof: [
        { text: 'Atendimento claro, cuidadoso e objetivo desde o primeiro contato.', author: 'Cliente demo', caseType: category },
        { text: 'A organização dos documentos ajudou a entender os riscos antes de decidir.', author: 'Cliente empresarial', caseType: 'Consultivo' },
      ],
      faq: [
        { question: 'A análise inicial garante resultado?', answer: 'Não. A análise indica caminhos possíveis, riscos e documentos necessários, sem promessa de resultado.' },
        { question: 'Quais documentos devo enviar?', answer: 'Envie contratos, comprovantes, mensagens, protocolos, prints e documentos relacionados ao caso.' },
        { question: 'Posso iniciar pelo WhatsApp?', answer: 'Sim. O WhatsApp pode ser usado para triagem inicial e orientação sobre documentos.' },
      ],
      whatsappMessage: `Olá! Gostaria de atendimento sobre ${title}.`,
      showForm: true,
      urgencyText,
      featuredOnHomepage: index < 4,
      startDate: daysAgo(12 - index),
      endDate: index >= 8 ? daysFromNow(20 + index) : undefined,
      coverImage: media['Cartão de visita frente'],
      storyImage: media['Apresentação institucional'],
      videoUrl: index % 2 === 0 ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : undefined,
      socialCaption: `${title}: entenda os primeiros passos e organize os documentos antes de tomar uma decisão.`,
      socialHashtags: ['#CavalcanteAlbuquerque', '#Advocacia', '#DireitoRN', `#${slug.replace(/-/g, '')}`],
      colorAccent,
      targetAudience: 'Pessoas físicas e empresas em Natal/RN com demanda jurídica relacionada ao tema da campanha.',
      metaTitle: `${title} | Cavalcante Albuquerque`,
      metaDescription: subtitle,
      ogImage: media['Imagem de capa institucional'],
    })
    ids[slug] = doc.id
  }

  return ids
}

async function seedPosts(payload: PayloadInstance, teamId: string | number, media: Record<string, string | number>) {
  const posts = [
    ['Como organizar documentos antes de falar com um advogado', 'organizar-documentos-atendimento-juridico', 'geral', '', 'Uma lista objetiva do que separar para tornar a primeira avaliação jurídica mais eficiente.'],
    ['Fraude bancária: primeiros passos para reduzir prejuízos', 'fraude-bancaria-primeiros-passos', 'direito-consumidor', 'fraudes-bancarias', 'Medidas iniciais para preservar provas, comunicar o banco e avaliar responsabilidades.'],
    ['LGPD na prática: riscos comuns em pequenos negócios', 'lgpd-riscos-pequenos-negocios', 'lgpd', 'lgpd-pequenos-negocios', 'Pontos frequentes de atenção em cadastro de clientes, contratos, WhatsApp e armazenamento de dados.'],
    ['Atendimento criminal urgente: o que informar no primeiro contato', 'atendimento-criminal-urgente-primeiro-contato', 'direito-penal', 'plantao-criminal-24h', 'Informações essenciais para orientar uma resposta rápida em situações criminais.'],
    ['Contratos empresariais: cláusulas que reduzem litígios', 'contratos-empresariais-clausulas', 'direito-civil', 'contratos-empresariais', 'Cuidados com objeto, preço, prazos, multa, foro e prova das comunicações.'],
    ['Regularização imobiliária: documentos para começar', 'regularizacao-imobiliaria-documentos', 'direito-imobiliario', 'regularizacao-imoveis', 'Matrícula, contratos, comprovantes de posse e histórico do imóvel ajudam a definir o caminho.'],
  ] as const

  for (const [index, [title, slug, category, linkedCampaign, excerpt]] of posts.entries()) {
    await upsertBySlug(payload, 'posts', slug, {
      title,
      excerpt,
      featuredImage: index % 2 === 0 ? media['Sala de atendimento'] : media['Porta do escritório'],
      content: richText(
        excerpt,
        'Este artigo demonstrativo valida o layout do blog e pode ser usado como base editorial inicial.',
        'A orientação jurídica depende da análise concreta dos documentos, fatos e prazos envolvidos.',
      ),
      category,
      author: 'edivaldo',
      authorRef: teamId,
      byFirm: false,
      tags: ['demo', category, linkedCampaign || 'institucional'],
      readTime: 4 + index,
      publishedAt: daysAgo(index + 1, 8),
      status: 'published',
      linkedCampaign,
      seo: { metaTitle: `${title} | Cavalcante Albuquerque`, metaDescription: excerpt },
    })
  }
}

async function seedNews(payload: PayloadInstance) {
  const news = [
    ['STJ reforça importância da prova documental em relações de consumo', 'stj-prova-documental-consumo', 'direito-consumidor', 'Demonstração editorial', 'fraudes-bancarias'],
    ['ANPD publica orientações sobre segurança e tratamento de dados', 'anpd-orientacoes-seguranca-dados', 'lgpd', 'Demonstração editorial', 'lgpd-pequenos-negocios'],
    ['Prazos processuais exigem acompanhamento preventivo', 'prazos-processuais-acompanhamento-preventivo', 'geral', 'Demonstração editorial', ''],
    ['Audiência de custódia: informação rápida faz diferença', 'audiencia-custodia-informacao-rapida', 'direito-penal', 'Demonstração editorial', 'plantao-criminal-24h'],
    ['Contratos digitais exigem atenção a prova e aceite', 'contratos-digitais-prova-aceite', 'direito-digital', 'Demonstração editorial', 'remocao-conteudo-reputacao'],
    ['Editais públicos: prazos curtos pedem análise imediata', 'editais-publicos-prazos-curtos', 'licitacoes', 'Demonstração editorial', 'recursos-licitacoes'],
  ] as const

  for (const [index, [title, slug, category, source, linkedCampaign]] of news.entries()) {
    await upsertBySlug(payload, 'news-articles', slug, {
      title,
      excerpt: 'Nota demonstrativa para validar a seção de notícias e o comportamento visual da homepage.',
      content: richText('Resumo editorial de demonstração para homologação visual do site.', 'Substituir por notícia real antes da publicação definitiva.'),
      sourceUrl: 'https://cavalcantealbuquerque.com.br',
      source,
      imageUrl: '/brand/og-default.jpg',
      sourceHash: `demo-${slug}`,
      relevanceScore: 86 - index,
      aiSummary: 'Conteúdo demonstrativo para composição visual e curadoria editorial.',
      editorialNotes: 'Registro seedado para popular o CMS em ambiente inicial.',
      expiresAt: daysFromNow(90),
      category,
      status: index < 5 ? 'published' : 'pending',
      autoImported: false,
      publishedAt: daysAgo(index + 1, 12),
      linkedCampaign,
    })
  }
}

async function seedTestimonials(payload: PayloadInstance) {
  const testimonials = [
    ['Cliente empresarial', 'Consultoria', 'A comunicação foi objetiva e o encaminhamento do caso trouxe segurança para decidir os próximos passos.'],
    ['Cliente consumidor', 'Consumidor', 'Recebi orientação clara sobre documentos, prazos e alternativas antes de qualquer medida.'],
    ['Cliente pessoa física', 'Civil', 'O atendimento foi cuidadoso e organizado, com explicação simples sobre riscos e possibilidades.'],
    ['Cliente de urgência', 'Penal', 'A equipe indicou rapidamente quais informações eram essenciais para o primeiro atendimento.'],
    ['Cliente imobiliário', 'Imobiliário', 'A análise documental ajudou a entender pendências e riscos antes de avançar na negociação.'],
  ] as const

  for (const [authorName, caseType, text] of testimonials) {
    await upsert(payload, 'testimonials', { authorName: { equals: authorName } }, {
      authorName,
      text,
      caseType,
      rating: 5,
      featured: true,
      approved: true,
    }, authorName)
  }
}

async function seedPages(payload: PayloadInstance) {
  const pages = [
    ['Política de Privacidade', 'politica-de-privacidade', 'Texto demonstrativo de política de privacidade para validação visual.'],
    ['Termos de Uso', 'termos-de-uso', 'Texto demonstrativo de termos de uso para validação visual.'],
    ['Política de Cookies', 'politica-de-cookies', 'Texto demonstrativo de política de cookies para validação visual.'],
    ['Perguntas Frequentes', 'faq', 'Central de perguntas frequentes sobre atendimento, documentos e primeiros passos.'],
    ['Obrigado pelo contato', 'obrigado', 'Página de confirmação para formulários enviados pelo site.'],
    ['Portal do Cliente', 'portal-do-cliente', 'Página demonstrativa de acesso e orientações do portal do cliente.'],
  ] as const

  for (const [title, slug, description] of pages) {
    await upsertBySlug(payload, 'pages', slug, {
      title,
      content: richText(description, 'Substituir este conteúdo pela versão jurídica definitiva antes da publicação final.'),
      seo: { metaTitle: `${title} | Cavalcante Albuquerque`, metaDescription: description },
      status: 'published',
    })
  }
}

async function seedClients(payload: PayloadInstance, teamId: string | number) {
  const clients = [
    ['Mariana F. Lima', '111.222.333-44', 'mariana.demo@example.com', '(84) 98888-1001', 'CA-DEMO-CLIENTE-001', '0001234-56.2026.8.20.5001', 'tjrn', 'Ação indenizatória consumerista'],
    ['Rafael M. Torres', '222.333.444-55', 'rafael.demo@example.com', '(84) 98888-1002', 'CA-DEMO-CLIENTE-002', '0002234-56.2026.8.20.5001', 'tjrn', 'Regularização contratual'],
    ['Empresa Alfa Ltda.', '333.444.555-66', 'juridico.alfa@example.com', '(84) 98888-1003', 'CA-DEMO-CLIENTE-003', '0003234-56.2026.4.05.8400', 'trf5', 'Execução fiscal'],
    ['João P. Azevedo', '444.555.666-77', 'joao.demo@example.com', '(84) 98888-1004', 'CA-DEMO-CLIENTE-004', '0004234-56.2026.8.20.0001', 'tjrn', 'Inventário e imóvel'],
    ['Clara S. Medeiros', '555.666.777-88', 'clara.demo@example.com', '(84) 98888-1005', 'CA-DEMO-CLIENTE-005', '0005234-56.2026.8.20.0001', 'tjrn', 'Defesa em cobrança'],
  ] as const

  const ids: Record<string, string | number> = {}
  for (const [name, cpf, email, phone, accessToken, processNumber, tribunal, description] of clients) {
    const doc = await upsert(payload, 'clients', { accessToken: { equals: accessToken } }, {
      name,
      cpf,
      email,
      phone,
      processes: [
        {
          processNumber,
          tribunal,
          description,
          attorney: 'edivaldo',
          attorneyRef: teamId,
          lawyerSummary: 'Resumo demonstrativo do caso para validação do portal do cliente. Atualizar com informações reais apenas após conferência.',
        },
      ],
      accessToken,
      active: true,
      notes: 'Cliente demonstrativo criado pelo seed completo do CMS.',
    }, accessToken)
    ids[accessToken] = doc.id
  }

  return ids
}

async function seedClientDocuments(payload: PayloadInstance, clientIds: Record<string, string | number>, media: Record<string, string | number>) {
  const file = media['Imagem de capa institucional'] || media['Apresentação institucional']
  if (!file) {
    console.log('skipped: client documents (nenhum media disponível para arquivo obrigatório)')
    return
  }

  const docs = [
    ['Procuração demonstrativa', 'power-of-attorney', 'CA-DEMO-CLIENTE-001', '0001234-56.2026.8.20.5001'],
    ['Contrato e comprovantes', 'contract', 'CA-DEMO-CLIENTE-002', '0002234-56.2026.8.20.5001'],
    ['Despacho inicial', 'decision', 'CA-DEMO-CLIENTE-003', '0003234-56.2026.4.05.8400'],
    ['Comprovantes do imóvel', 'receipt', 'CA-DEMO-CLIENTE-004', '0004234-56.2026.8.20.0001'],
    ['Documentos pessoais', 'personal-doc', 'CA-DEMO-CLIENTE-005', '0005234-56.2026.8.20.0001'],
  ] as const

  for (const [title, documentType, token, processNumber] of docs) {
    await upsertByTitle(payload, 'client-documents', title, {
      documentType,
      client: clientIds[token],
      clientName: token,
      processNumber,
      file,
      uploadedBy: 'attorney',
      visibility: 'client-visible',
      notes: 'Documento demonstrativo para popular o portal do cliente.',
    })
  }
}

async function seedLeads(payload: PayloadInstance, teamId: string | number, clientIds: Record<string, string | number>) {
  const leads = [
    ['Ana Paula Demo', '(84) 99910-1001', 'ana.lead@example.com', 'contact-form', '', 'new', 'medium', 'Direito do consumidor'],
    ['Bruno Cliente Demo', '(84) 99910-1002', 'bruno.lead@example.com', 'campaign-form', 'fraudes-bancarias', 'contacted', 'high', 'Fraude bancária'],
    ['Carla Empresa Demo', '(84) 99910-1003', 'carla.lead@example.com', 'campaign-form', 'lgpd-pequenos-negocios', 'qualified', 'medium', 'LGPD empresa'],
    ['Diego Urgente Demo', '(84) 99910-1004', 'diego.lead@example.com', 'whatsapp', 'plantao-criminal-24h', 'new', 'urgent', 'Urgência criminal'],
    ['Elisa Imóvel Demo', '(84) 99910-1005', 'elisa.lead@example.com', 'campaign-form', 'regularizacao-imoveis', 'proposal', 'medium', 'Regularização de imóvel'],
    ['Felipe Tributário Demo', '(84) 99910-1006', 'felipe.lead@example.com', 'calculator', 'execucao-fiscal', 'contacted', 'high', 'Execução fiscal'],
    ['Gabriela Licitação Demo', '(84) 99910-1007', 'gabriela.lead@example.com', 'campaign-form', 'recursos-licitacoes', 'qualified', 'high', 'Recurso administrativo'],
    ['Henrique Civil Demo', '(84) 99910-1008', 'henrique.lead@example.com', 'referral', 'contratos-empresariais', 'converted', 'medium', 'Contrato empresarial'],
    ['Isabela Digital Demo', '(84) 99910-1009', 'isabela.lead@example.com', 'campaign-form', 'remocao-conteudo-reputacao', 'new', 'medium', 'Remoção de conteúdo'],
    ['Juliana Banco Demo', '(84) 99910-1010', 'juliana.lead@example.com', 'campaign-form', 'cobrancas-abusivas', 'lost', 'low', 'Cobrança bancária'],
  ] as const

  const firstClientId = clientIds['CA-DEMO-CLIENTE-001']
  for (const [index, [name, phone, email, source, campaignSlug, status, urgency, subject]] of leads.entries()) {
    await upsert(payload, 'leads', { phone: { equals: phone } }, {
      name,
      phone,
      email,
      source,
      campaignSlug,
      utmSource: index % 2 === 0 ? 'instagram' : 'google',
      utmMedium: index % 2 === 0 ? 'social' : 'cpc',
      utmCampaign: campaignSlug || 'institucional',
      referrerUrl: 'https://cavalcantealbuquerque.com.br',
      consentText: 'Autorizo o tratamento dos dados enviados para fins de atendimento jurídico.',
      consentedAt: daysAgo(index),
      ip: `192.0.2.${10 + index}`,
      userAgent: 'Seed Demo Browser',
      qualificationAnswers: [
        { question: 'Qual a situação?', answer: subject },
        { question: 'Existe prazo?', answer: urgency === 'urgent' || urgency === 'high' ? 'Sim' : 'Não informado' },
      ],
      caseDescription: `Lead demonstrativo sobre ${subject}.`,
      estimatedValue: 5000 + index * 4500,
      urgency,
      status,
      assignedTo: 'edivaldo',
      assignedToRef: teamId,
      byFirm: false,
      lostReason: status === 'lost' ? 'no-response' : undefined,
      notes: [{ text: 'Registro demonstrativo criado pelo seed completo.', author: 'system', date: daysAgo(index) }],
      nextFollowUp: status === 'lost' ? undefined : daysFromNow(index + 1, 14),
      convertedToClient: status === 'converted' ? firstClientId : undefined,
      conversionDate: status === 'converted' ? daysAgo(1) : undefined,
      contractValue: status === 'converted' ? 7500 : undefined,
    }, phone)
  }
}

async function seedCampaignEvents(payload: PayloadInstance) {
  const campaignSlugs = ['fraudes-bancarias', 'plantao-criminal-24h', 'lgpd-pequenos-negocios', 'regularizacao-imoveis', 'recursos-licitacoes']
  const events = ['page_view', 'whatsapp_click', 'form_start', 'form_submit', 'share', 'cta_click'] as const

  for (const [campaignIndex, campaignSlug] of campaignSlugs.entries()) {
    for (const [eventIndex, eventType] of events.entries()) {
      const key = `${campaignSlug}-${eventType}`
      await upsert(payload, 'campaign-events', {
        and: [
          { campaignSlug: { equals: campaignSlug } },
          { eventType: { equals: eventType } },
          { utmContent: { equals: key } },
        ],
      }, {
        campaignSlug,
        eventType,
        utmSource: eventIndex % 2 === 0 ? 'instagram' : 'google',
        utmMedium: eventIndex % 2 === 0 ? 'social' : 'cpc',
        utmCampaign: campaignSlug,
        utmContent: key,
        referrer: 'https://cavalcantealbuquerque.com.br/campanhas',
        userAgent: 'Seed Demo Browser',
        metadata: { seed: true, sampleIndex: campaignIndex * 10 + eventIndex, secondsOnPage: 30 + eventIndex * 12 },
      }, key)
    }
  }
}

async function seedDeadlines(payload: PayloadInstance, clientIds: Record<string, string | number>, teamId: string | number) {
  const deadlines = [
    ['Apresentar contestação', 'CA-DEMO-CLIENTE-001', '0001234-56.2026.8.20.5001', 7, 'contestation', 'critical'],
    ['Analisar decisão interlocutória', 'CA-DEMO-CLIENTE-002', '0002234-56.2026.8.20.5001', 3, 'manifestation', 'attention'],
    ['Protocolar recurso administrativo', 'CA-DEMO-CLIENTE-003', '0003234-56.2026.4.05.8400', 12, 'appeal', 'normal'],
    ['Audiência de conciliação', 'CA-DEMO-CLIENTE-004', '0004234-56.2026.8.20.0001', 18, 'hearing', 'attention'],
    ['Juntar comprovantes complementares', 'CA-DEMO-CLIENTE-005', '0005234-56.2026.8.20.0001', 1, 'other', 'critical'],
    ['Revisar minuta de acordo', 'CA-DEMO-CLIENTE-001', '0001234-56.2026.8.20.5001', 25, 'manifestation', 'normal'],
  ] as const

  for (const [title, token, processNumber, days, deadlineType, priority] of deadlines) {
    await upsertByTitle(payload, 'deadlines', title, {
      client: clientIds[token],
      clientName: token,
      processNumber,
      deadlineDate: daysFromNow(days, 11),
      deadlineType,
      attorney: 'edivaldo',
      attorneyRef: teamId,
      status: days <= 1 ? 'in-progress' : 'pending',
      priority,
      notes: 'Prazo demonstrativo criado para validar alertas e painel interno.',
      alertSent7d: days < 7,
      alertSent3d: days < 3,
      alertSent1d: false,
    })
  }
}

async function seedJurisprudence(payload: PayloadInstance) {
  const items = [
    ['Dano moral por negativação indevida exige prova mínima do apontamento', 'tjrn', '0000001-00.2025.8.20.0000', 'consumidor', 'Precedente demonstrativo sobre inscrição indevida e análise do contexto probatório.', ['negativação', 'dano moral']],
    ['Fraude bancária e dever de segurança em canais digitais', 'stj', 'REsp Demo 000001', 'consumidor', 'Precedente demonstrativo sobre responsabilidade por falha na segurança de operação bancária.', ['fraude bancária', 'segurança']],
    ['Tratamento de dados pessoais exige base legal e transparência', 'other', 'Processo Demo LGPD', 'digital', 'Entendimento demonstrativo para minutas envolvendo privacidade e proteção de dados.', ['lgpd', 'dados pessoais']],
    ['Audiência de custódia e fundamentação de cautelares', 'stf', 'HC Demo 000001', 'criminal', 'Precedente demonstrativo sobre necessidade de fundamentação concreta em medidas cautelares.', ['custódia', 'cautelares']],
    ['Contrato imobiliário e boa-fé objetiva', 'stj', 'REsp Demo 000002', 'imobiliario', 'Precedente demonstrativo sobre deveres anexos em contratos imobiliários.', ['imobiliário', 'boa-fé']],
    ['Execução fiscal e análise de prescrição intercorrente', 'trf5', '0000002-00.2025.4.05.0000', 'tributario', 'Precedente demonstrativo para análise de prazos em cobrança fiscal.', ['execução fiscal', 'prescrição']],
    ['Edital de licitação deve respeitar competitividade', 'other', 'Acórdão Demo 000001', 'administrativo', 'Precedente demonstrativo sobre cláusulas restritivas e impugnação de edital.', ['licitação', 'edital']],
    ['Cobrança abusiva e repetição de indébito', 'tjrn', '0000003-00.2025.8.20.0000', 'consumidor', 'Precedente demonstrativo para pedidos de revisão e restituição de valores.', ['cobrança', 'repetição de indébito']],
  ] as const

  for (const [index, [title, court, caseNumber, category, summary, tags]] of items.entries()) {
    await upsertByTitle(payload, 'jurisprudence', title, {
      court,
      caseNumber,
      category,
      decisionDate: daysAgo(30 + index * 12),
      summary,
      fullText: `${summary} Texto demonstrativo para alimentar o gerador de minutas. Conferir precedentes reais antes de uso em peça.`,
      tags,
      relevance: index < 3 ? 'essential' : index < 6 ? 'high' : 'medium',
    })
  }
}

async function seedNps(payload: PayloadInstance, clientIds: Record<string, string | number>, teamId: string | number) {
  const responses = [
    ['Mariana F. Lima', 'CA-DEMO-CLIENTE-001', 10, 'Atendimento claro e cuidadoso.', 'testimonial-approved'],
    ['Rafael M. Torres', 'CA-DEMO-CLIENTE-002', 9, 'A organização dos documentos ajudou bastante.', 'reviewed'],
    ['Empresa Alfa Ltda.', 'CA-DEMO-CLIENTE-003', 8, 'Processo de comunicação objetivo.', 'reviewed'],
    ['João P. Azevedo', 'CA-DEMO-CLIENTE-004', 10, 'Explicação simples e acompanhamento próximo.', 'testimonial-approved'],
    ['Clara S. Medeiros', 'CA-DEMO-CLIENTE-005', 7, 'Gostaria de mais atualizações automáticas.', 'pending'],
  ] as const

  for (const [clientName, token, score, feedback, status] of responses) {
    await upsert(payload, 'nps-responses', {
      and: [
        { clientName: { equals: clientName } },
        { processNumber: { equals: token } },
      ],
    }, {
      client: clientIds[token],
      clientName,
      score,
      processNumber: token,
      attorney: 'edivaldo',
      attorneyRef: teamId,
      feedback,
      consentText: 'Autorizo o uso do feedback para melhoria interna e, se aprovado, publicação sem dados sensíveis.',
      consentedAt: daysAgo(2),
      ip: '192.0.2.80',
      userAgent: 'Seed Demo Browser',
      status,
      testimonialText: score >= 9 ? feedback : undefined,
      testimonialApproved: status === 'testimonial-approved',
    }, `${clientName}-${token}`)
  }
}

async function seedAutomationRuns(payload: PayloadInstance) {
  const runs = [
    ['news-feed', 'success', 28, 6, 'Busca de notícias demonstrativa concluída.'],
    ['deadline-alerts', 'success', 6, 4, 'Alertas de prazos processados.'],
    ['datajud-sync', 'pending', 0, 0, 'Sincronização aguardando credenciais.'],
    ['nps-trigger', 'success', 5, 5, 'Convites NPS criados.'],
    ['social-assets', 'error', 10, 0, 'Geração automática desativada no ambiente demo.'],
  ] as const

  for (const [task, status, itemsIn, itemsOut, message] of runs) {
    await upsert(payload, 'automation-runs', {
      and: [
        { task: { equals: task } },
        { status: { equals: status } },
      ],
    }, {
      task,
      status,
      startedAt: daysAgo(itemsIn || 1),
      finishedAt: status === 'pending' ? undefined : daysAgo(itemsOut || 1),
      itemsIn,
      itemsOut,
      errorMessage: status === 'error' ? message : undefined,
      payload: { seed: true, message },
    }, `${task}-${status}`)
  }
}

async function seedAuditLogs(payload: PayloadInstance, userIds: Record<string, string | number>) {
  const user = userIds['editor@cavalcantealbuquerque.com.br']
  const logs = [
    ['seed:globals', 'globals', 'site-config'],
    ['seed:campaigns', 'campaigns', 'fraudes-bancarias'],
    ['seed:posts', 'posts', 'organizar-documentos-atendimento-juridico'],
    ['seed:clients', 'clients', 'CA-DEMO-CLIENTE-001'],
    ['seed:automation', 'automation-runs', 'news-feed'],
  ] as const

  for (const [action, collectionSlug, documentId] of logs) {
    await upsert(payload, 'audit-log', {
      and: [
        { action: { equals: action } },
        { documentId: { equals: documentId } },
      ],
    }, {
      action,
      collectionSlug,
      documentId,
      user,
      before: null,
      after: { seeded: true, at: nowISO },
      metadata: { source: 'scripts/seed-demo-content.ts' },
    }, `${action}-${documentId}`)
  }
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL não configurado')
  if (!process.env.PAYLOAD_SECRET) throw new Error('PAYLOAD_SECRET não configurado')

  const payload = await getPayload({ config })

  const media = await seedMedia(payload)
  const userIds = await seedUsers(payload)
  await seedGlobals(payload, media)
  const team = await seedTeam(payload)
  const areaIds = await seedPracticeAreas(payload, team.edivaldoId)
  await seedFaqs(payload, areaIds)
  await seedCampaigns(payload, media)
  await seedPosts(payload, team.edivaldoId, media)
  await seedNews(payload)
  await seedTestimonials(payload)
  await seedPages(payload)
  const clientIds = await seedClients(payload, team.edivaldoId)
  await seedClientDocuments(payload, clientIds, media)
  await seedLeads(payload, team.edivaldoId, clientIds)
  await seedCampaignEvents(payload)
  await seedDeadlines(payload, clientIds, team.edivaldoId)
  await seedJurisprudence(payload)
  await seedNps(payload, clientIds, team.edivaldoId)
  await seedAutomationRuns(payload)
  await seedAuditLogs(payload, userIds)

  await payload.destroy?.()
  console.log('seed demo completo concluído')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

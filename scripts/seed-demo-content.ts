import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const pending = '__PENDENTE__'
const now = new Date().toISOString()

type PayloadInstance = Awaited<ReturnType<typeof getPayload>>

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

async function upsertBySlug(payload: PayloadInstance, collection: string, slug: string, data: Record<string, unknown>) {
  const existing = await (payload as any).find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })

  if (existing.docs?.[0]) {
    await (payload as any).update({ collection, id: existing.docs[0].id, data: { ...data, slug } })
    console.log(`updated: ${collection}/${slug}`)
    return existing.docs[0].id
  }

  const created = await (payload as any).create({ collection, data: { ...data, slug } })
  console.log(`created: ${collection}/${slug}`)
  return created.id
}

async function upsertTestimonial(payload: PayloadInstance, authorName: string, data: Record<string, unknown>) {
  const existing = await (payload as any).find({
    collection: 'testimonials',
    where: { authorName: { equals: authorName } },
    limit: 1,
    depth: 0,
  })

  if (existing.docs?.[0]) {
    await (payload as any).update({ collection: 'testimonials', id: existing.docs[0].id, data })
    console.log(`updated: testimonials/${authorName}`)
    return
  }

  await (payload as any).create({ collection: 'testimonials', data: { ...data, authorName } })
  console.log(`created: testimonials/${authorName}`)
}

async function getTeamId(payload: PayloadInstance) {
  const team = await (payload as any).find({
    collection: 'team',
    where: { slug: { equals: 'edivaldo-cavalcante-albuquerque' } },
    limit: 1,
    depth: 0,
  })
  return team.docs?.[0]?.id || null
}

async function seedGlobals(payload: PayloadInstance) {
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
      email: process.env.PUBLIC_CONTACT_EMAIL || process.env.CONTACT_EMAIL || 'contato@cavalcantealbuquerque.com.br',
      phone: process.env.PUBLIC_CONTACT_PHONE || '(84) 99124-3985',
      whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985',
      whatsappDefaultMessage: process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || 'Olá, gostaria de atendimento jurídico.',
      addressStreet: 'Rua Francisco Maia Sobrinho, 1950',
      addressDistrict: 'Lagoa Nova',
      addressCity: 'Natal',
      addressState: 'RN',
      addressZip: '59062-250',
      emergencyLine: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985',
      emergencyLabel: 'Plantão criminal 24h',
      businessHours: [
        { day: 'Segunda a sexta', opensAt: '08:00', closesAt: '18:00' },
        { day: 'Urgências criminais', opensAt: '24h', closesAt: '24h' },
      ],
      dpoName: pending,
      dpoEmail: pending,
      oabDisclaimer: 'Conteúdo informativo, sem promessa de resultado e conforme o Código de Ética e Disciplina da OAB.',
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
        { value: 100, suffix: '%', label: 'Atendimento técnico' },
        { value: 1, suffix: ':1', label: 'Contato direto' },
      ],
      criminalTag: 'Defesa criminal - atendimento imediato',
      criminalTitle: 'Urgência exige técnica e resposta rápida.',
      criminalHighlight: 'Atuação 24h para flagrantes, audiências de custódia e medidas urgentes.',
      criminalDescription: 'Em situações criminais, cada hora importa. O atendimento inicial organiza documentos, identifica riscos e define os próximos passos com objetividade.',
      practiceTitle: 'Áreas de atuação',
      practiceSubtitle: 'Atuação organizada por contexto, urgência e estratégia processual.',
      campaignsTitle: 'Campanhas jurídicas',
      campaignsSubtitle: 'Frentes de atendimento para demandas recorrentes de consumidores, empresas e famílias.',
      testimonialsTitle: 'Relatos de atendimento',
      newsTitle: 'Notícias do Direito',
      newsSubtitle: 'Atualizações jurídicas selecionadas para leitura rápida.',
      blogTitle: 'Artigos recentes',
      blogSubtitle: 'Conteúdo jurídico em linguagem direta para orientar decisões.',
      contactTitle: 'Fale com a Cavalcante Albuquerque',
      contactSubtitle: 'Descreva sua demanda para uma avaliação inicial do melhor caminho jurídico.',
      contactEmail: process.env.PUBLIC_CONTACT_EMAIL || process.env.CONTACT_EMAIL || 'contato@cavalcantealbuquerque.com.br',
      contactPhone: process.env.PUBLIC_CONTACT_PHONE || '(84) 99124-3985',
      contactAddress: 'Rua Francisco Maia Sobrinho, 1950\nLagoa Nova - Natal/RN, 59062-250',
      aboutTitle: 'Sobre a Cavalcante Albuquerque',
      aboutSubtitle: 'Advocacia e consultoria com foco em estratégia, solidez e comunicação direta.',
      aboutHistory: 'A Cavalcante Albuquerque nasce para oferecer atendimento jurídico técnico, organizado e próximo do cliente. A estrutura combina atuação consultiva, contenciosa e resposta rápida em urgências.',
      aboutTimeline: [
        { year: 'Formação', title: 'Base técnica', description: 'Experiência construída em demandas cíveis, consumidor, digital, criminal e consultoria.' },
        { year: 'Atuação', title: 'Método de acompanhamento', description: 'Cada caso recebe análise de risco, organização documental e comunicação objetiva.' },
        { year: 'Hoje', title: 'Cavalcante Albuquerque', description: 'Escritório estruturado para atendimento estratégico em Natal/RN e canais digitais.' },
      ],
      aboutValues: [
        { title: 'Técnica', description: 'Análise jurídica consistente antes de qualquer medida.', icon: 'scale' },
        { title: 'Clareza', description: 'Comunicação direta sobre riscos, prazos e próximos passos.', icon: 'users' },
        { title: 'Solidez', description: 'Estratégias sustentadas por documentos, precedentes e contexto do cliente.', icon: 'shield' },
      ],
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

  console.log('updated: globals demo')
}

async function seedTeam(payload: PayloadInstance) {
  await upsertBySlug(payload, 'team', 'edivaldo-cavalcante-albuquerque', {
    name: 'Dr. Edivaldo Cavalcante Albuquerque',
    shortName: 'Dr. Edivaldo',
    role: 'Advogado Titular',
    oab: pending,
    bio: richText('Advogado titular da Cavalcante Albuquerque, com atuação em demandas consultivas e contenciosas.', 'Atendimento orientado por estratégia, organização documental e comunicação direta com o cliente.'),
    order: 1,
    active: true,
    showOnSite: true,
    formerMember: false,
  })
}

async function seedPracticeAreas(payload: PayloadInstance) {
  const areas = [
    {
      title: 'Direito Digital e LGPD', slug: 'direito-digital', icon: 'shield', order: 1,
      shortDescription: 'Proteção de dados, contratos digitais, incidentes de segurança e conflitos em plataformas.',
      caseTypes: ['Adequação LGPD', 'Vazamento de dados', 'Remoção de conteúdo', 'Contratos digitais'],
    },
    {
      title: 'Direito Civil', slug: 'direito-civil', icon: 'scale', order: 2,
      shortDescription: 'Contratos, responsabilidade civil, cobranças, indenizações e conflitos patrimoniais.',
      caseTypes: ['Revisão contratual', 'Indenização', 'Cobrança', 'Obrigações'],
    },
    {
      title: 'Direito do Consumidor', slug: 'direito-consumidor', icon: 'shopping-bag', order: 3,
      shortDescription: 'Fraudes bancárias, negativação indevida, cobranças abusivas e falhas de serviço.',
      caseTypes: ['Fraude bancária', 'Negativação indevida', 'Cobrança abusiva', 'Produto com defeito'],
    },
    {
      title: 'Direito Imobiliário', slug: 'direito-imobiliario', icon: 'home', order: 4,
      shortDescription: 'Compra e venda, locação, posse, propriedade, regularização e conflitos condominiais.',
      caseTypes: ['Contrato imobiliário', 'Locação', 'Usucapião', 'Condomínio'],
    },
    {
      title: 'Direito Tributário', slug: 'direito-tributario', icon: 'receipt', order: 5,
      shortDescription: 'Consultoria, defesa administrativa, execuções fiscais e planejamento tributário.',
      caseTypes: ['Execução fiscal', 'Defesa administrativa', 'Parcelamento', 'Planejamento'],
    },
    {
      title: 'Licitações e Contratos Administrativos', slug: 'licitacoes', icon: 'file-text', order: 6,
      shortDescription: 'Apoio em editais, recursos, impugnações, contratos públicos e relações com a administração.',
      caseTypes: ['Impugnação de edital', 'Recurso administrativo', 'Contrato público', 'Sanções administrativas'],
    },
    {
      title: 'Direito Penal', slug: 'direito-penal', icon: 'gavel', order: 7,
      shortDescription: 'Defesa técnica em investigações, flagrantes, audiências de custódia e medidas urgentes.',
      caseTypes: ['Flagrante', 'Audiência de custódia', 'Inquérito policial', 'Medidas cautelares'], is24h: true,
    },
  ]

  for (const area of areas) {
    await upsertBySlug(payload, 'practice-areas', area.slug, {
      title: area.title,
      icon: area.icon,
      shortDescription: area.shortDescription,
      heroHeadline: area.shortDescription,
      content: richText(
        `${area.title} exige avaliação individual do contexto, documentos disponíveis e riscos envolvidos.`,
        'Este conteúdo de demonstração serve para validar o layout e deve ser substituído pela redação final aprovada pelo escritório.',
      ),
      caseTypes: area.caseTypes.map((name) => ({ name })),
      faq: [
        { question: 'Como funciona o primeiro atendimento?', answer: 'A equipe coleta os fatos principais, documentos e prazos para indicar os próximos passos.' },
        { question: 'O atendimento pode ser online?', answer: 'Sim. O contato inicial pode ocorrer por WhatsApp, telefone ou formulário do site.' },
      ],
      attorney: 'edivaldo',
      byFirm: true,
      is24h: Boolean(area.is24h),
      order: area.order,
      seo: { metaTitle: `${area.title} | Cavalcante Albuquerque`, metaDescription: area.shortDescription },
    })
  }
}

async function seedCampaigns(payload: PayloadInstance) {
  const campaigns = [
    {
      title: 'Fraudes bancárias e golpes digitais', slug: 'fraudes-bancarias', category: 'consumidor', colorAccent: 'gold',
      subtitle: 'Contestação de transações não reconhecidas, empréstimos fraudulentos e falhas de segurança bancária.',
      urgencyText: 'Atendimento para bloqueio de danos e organização de provas.',
      whatsappMessage: 'Olá! Preciso de orientação sobre fraude bancária ou golpe digital.',
    },
    {
      title: 'Negativação indevida', slug: 'negativacao-indevida', category: 'consumidor', colorAccent: 'blue',
      subtitle: 'Avaliação de inscrições indevidas em SPC/Serasa e pedidos de retirada com indenização quando cabível.',
      urgencyText: 'Verifique documentos e prazos antes de negociar a dívida.',
      whatsappMessage: 'Olá! Meu nome foi negativado e quero avaliar meu caso.',
    },
    {
      title: 'Plantão criminal 24h', slug: 'plantao-criminal-24h', category: 'criminal', colorAccent: 'red',
      subtitle: 'Atendimento para flagrante, audiência de custódia, busca e apreensão e medidas urgentes.',
      urgencyText: 'Plantão criminal: resposta imediata por WhatsApp.',
      whatsappMessage: 'Olá! Preciso de atendimento criminal urgente.',
    },
  ]

  for (const campaign of campaigns) {
    await upsertBySlug(payload, 'campaigns', campaign.slug, {
      ...campaign,
      status: 'active',
      featuredOnHomepage: true,
      showForm: true,
      startDate: now,
      problemDescription: richText('Muitas demandas chegam ao cliente com informação fragmentada e prazos curtos.', 'A campanha organiza o atendimento inicial e facilita a coleta de informações essenciais.'),
      rightsExplanation: richText('Cada caso exige análise individual. A avaliação inicial verifica documentos, provas, prazos e riscos jurídicos.'),
      benefits: richText('A atuação busca reduzir incerteza, preservar provas e definir uma estratégia compatível com o contexto do cliente.'),
      socialProof: [
        { text: 'Atendimento claro e cuidadoso desde o primeiro contato.', author: 'Cliente A.', caseType: campaign.category },
      ],
      faq: [
        { question: 'A análise inicial garante resultado?', answer: 'Não. A análise indica caminhos possíveis, riscos e documentos necessários, sem promessa de resultado.' },
        { question: 'Quais documentos devo enviar?', answer: 'Envie contratos, comprovantes, mensagens, protocolos, prints e documentos pessoais relacionados ao caso.' },
      ],
      socialCaption: `${campaign.title}: entenda seus direitos e organize os documentos antes de tomar uma decisão.`,
      socialHashtags: ['#CavalcanteAlbuquerque', '#Advocacia', '#DireitoRN'],
      targetAudience: 'Pessoas físicas e empresas em Natal/RN com demanda jurídica relacionada ao tema da campanha.',
      seo: { metaTitle: `${campaign.title} | Cavalcante Albuquerque`, metaDescription: campaign.subtitle },
    })
  }
}

async function seedPosts(payload: PayloadInstance, teamId: number | null) {
  const posts = [
    { title: 'Como organizar documentos antes de falar com um advogado', slug: 'organizar-documentos-atendimento-juridico', category: 'geral', linkedCampaign: '', excerpt: 'Uma lista objetiva do que separar para tornar a primeira avaliação jurídica mais eficiente.' },
    { title: 'Fraude bancária: primeiros passos para reduzir prejuizos', slug: 'fraude-bancaria-primeiros-passos', category: 'direito-consumidor', linkedCampaign: 'fraudes-bancarias', excerpt: 'Medidas iniciais para preservar provas, comunicar o banco e avaliar responsabilidades.' },
    { title: 'LGPD na prática: riscos comuns em pequenos negócios', slug: 'lgpd-riscos-pequenos-negocios', category: 'lgpd', linkedCampaign: '', excerpt: 'Pontos frequentes de atenção em cadastro de clientes, contratos, WhatsApp e armazenamento de dados.' },
    { title: 'Atendimento criminal urgente: o que informar no primeiro contato', slug: 'atendimento-criminal-urgente-primeiro-contato', category: 'direito-penal', linkedCampaign: 'plantao-criminal-24h', excerpt: 'Informações essenciais para orientar uma resposta rápida em situações criminais.' },
  ]

  for (const [index, post] of posts.entries()) {
    await upsertBySlug(payload, 'posts', post.slug, {
      ...post,
      content: richText(post.excerpt, 'Este artigo demonstrativo ajuda a validar o layout do blog e deve ser revisado antes de uso definitivo.', 'A orientação jurídica depende da análise concreta dos documentos e fatos.'),
      author: 'edivaldo',
      authorRef: teamId || undefined,
      byFirm: false,
      tags: ['demo', post.category],
      readTime: 4 + index,
      publishedAt: new Date(Date.now() - index * 86400000).toISOString(),
      status: 'published',
      seo: { metaTitle: `${post.title} | Cavalcante Albuquerque`, metaDescription: post.excerpt },
    })
  }
}

async function seedNews(payload: PayloadInstance) {
  const news = [
    { title: 'STJ reforça importância da prova documental em relações de consumo', slug: 'stj-prova-documental-consumo', category: 'direito-consumidor', source: 'Demonstração editorial', linkedCampaign: 'fraudes-bancarias' },
    { title: 'ANPD publica orientações sobre segurança e tratamento de dados', slug: 'anpd-orientacoes-seguranca-dados', category: 'lgpd', source: 'Demonstração editorial', linkedCampaign: '' },
    { title: 'Prazos processuais exigem acompanhamento preventivo', slug: 'prazos-processuais-acompanhamento-preventivo', category: 'geral', source: 'Demonstração editorial', linkedCampaign: '' },
    { title: 'Audiência de custódia: informação rápida faz diferença', slug: 'audiencia-custodia-informacao-rapida', category: 'direito-penal', source: 'Demonstração editorial', linkedCampaign: 'plantao-criminal-24h' },
  ]

  for (const [index, item] of news.entries()) {
    await upsertBySlug(payload, 'news-articles', item.slug, {
      ...item,
      excerpt: 'Nota demonstrativa para validar a seção de notícias e o comportamento visual da homepage.',
      content: richText('Resumo editorial de demonstração para homologação visual do site.'),
      sourceUrl: 'https://cavalcantealbuquerque.com.br',
      sourceHash: `demo-${item.slug}`,
      relevanceScore: 80 - index,
      aiSummary: 'Conteúdo demonstrativo para composição visual.',
      editorialNotes: 'Substituir por notícia real antes da publicação definitiva.',
      autoImported: false,
      status: 'published',
      publishedAt: new Date(Date.now() - (index + 1) * 43200000).toISOString(),
    })
  }
}

async function seedTestimonials(payload: PayloadInstance) {
  const testimonials = [
    { authorName: 'Cliente empresarial', caseType: 'Consultoria', text: 'A comunicação foi objetiva e o encaminhamento do caso trouxe segurança para decidir os próximos passos.' },
    { authorName: 'Cliente consumidor', caseType: 'Consumidor', text: 'Recebi orientação clara sobre documentos, prazos e alternativas antes de qualquer medida.' },
    { authorName: 'Cliente pessoa física', caseType: 'Civil', text: 'O atendimento foi cuidadoso e organizado, com explicação simples sobre riscos e possibilidades.' },
  ]

  for (const item of testimonials) {
    await upsertTestimonial(payload, item.authorName, {
      text: item.text,
      caseType: item.caseType,
      rating: 5,
      featured: true,
      approved: true,
    })
  }
}

async function seedPages(payload: PayloadInstance) {
  const pages = [
    { title: 'Política de Privacidade', slug: 'politica-de-privacidade', description: 'Texto demonstrativo de política de privacidade para validação visual.' },
    { title: 'Termos de Uso', slug: 'termos-de-uso', description: 'Texto demonstrativo de termos de uso para validação visual.' },
    { title: 'Política de Cookies', slug: 'politica-de-cookies', description: 'Texto demonstrativo de política de cookies para validação visual.' },
  ]

  for (const page of pages) {
    await upsertBySlug(payload, 'pages', page.slug, {
      title: page.title,
      content: richText(page.description, 'Substituir este conteúdo pela versão jurídica definitiva antes da publicação final.'),
      status: 'published',
      seo: { metaTitle: `${page.title} | Cavalcante Albuquerque`, metaDescription: page.description },
    })
  }
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL não configurado')
  if (!process.env.PAYLOAD_SECRET) throw new Error('PAYLOAD_SECRET não configurado')

  const payload = await getPayload({ config })
  const teamId = await getTeamId(payload)

  await seedGlobals(payload)
  await seedTeam(payload)
  const seededTeamId = teamId || await getTeamId(payload)
  await seedPracticeAreas(payload)
  await seedCampaigns(payload)
  await seedPosts(payload, seededTeamId)
  await seedNews(payload)
  await seedTestimonials(payload)
  await seedPages(payload)

  await payload.destroy?.()
  console.log('seed demo concluido')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

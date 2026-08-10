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
      tagline: 'Advocacia com estrategia e solidez.',
      domain: 'cavalcantealbuquerque.com.br',
      email: process.env.PUBLIC_CONTACT_EMAIL || process.env.CONTACT_EMAIL || 'contato@cavalcantealbuquerque.com.br',
      phone: process.env.PUBLIC_CONTACT_PHONE || '(84) 99124-3985',
      whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985',
      whatsappDefaultMessage: process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || 'Ola, gostaria de atendimento juridico.',
      addressStreet: 'Rua Francisco Maia Sobrinho, 1950',
      addressDistrict: 'Lagoa Nova',
      addressCity: 'Natal',
      addressState: 'RN',
      addressZip: '59062-250',
      emergencyLine: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985',
      emergencyLabel: 'Plantao criminal 24h',
      businessHours: [
        { day: 'Segunda a sexta', opensAt: '08:00', closesAt: '18:00' },
        { day: 'Urgencias criminais', opensAt: '24h', closesAt: '24h' },
      ],
      dpoName: pending,
      dpoEmail: pending,
      oabDisclaimer: 'Conteudo informativo, sem promessa de resultado e conforme o Codigo de Etica e Disciplina da OAB.',
    },
  })

  await (payload as any).updateGlobal({
    slug: 'site-config',
    data: {
      heroTitle: 'Advocacia com estrategia e solidez.',
      heroSubtitle: 'Atendimento juridico em Natal/RN com analise tecnica, comunicacao direta e acompanhamento cuidadoso em cada etapa do caso.',
      heroButtonText: 'Fale com um advogado',
      trustBarStats: [
        { value: 24, suffix: 'h', label: 'Plantao criminal' },
        { value: 7, suffix: '+', label: 'Areas de atuacao' },
        { value: 100, suffix: '%', label: 'Atendimento tecnico' },
        { value: 1, suffix: ':1', label: 'Contato direto' },
      ],
      criminalTag: 'Defesa criminal - atendimento imediato',
      criminalTitle: 'Urgencia exige tecnica e resposta rapida.',
      criminalHighlight: 'Atuacao 24h para flagrantes, audiencias de custodia e medidas urgentes.',
      criminalDescription: 'Em situacoes criminais, cada hora importa. O atendimento inicial organiza documentos, identifica riscos e define os proximos passos com objetividade.',
      practiceTitle: 'Areas de atuacao',
      practiceSubtitle: 'Atuacao organizada por contexto, urgencia e estrategia processual.',
      campaignsTitle: 'Campanhas juridicas',
      campaignsSubtitle: 'Frentes de atendimento para demandas recorrentes de consumidores, empresas e familias.',
      testimonialsTitle: 'Relatos de atendimento',
      newsTitle: 'Noticias do Direito',
      newsSubtitle: 'Atualizacoes juridicas selecionadas para leitura rapida.',
      blogTitle: 'Artigos recentes',
      blogSubtitle: 'Conteudo juridico em linguagem direta para orientar decisoes.',
      contactTitle: 'Fale com a Cavalcante Albuquerque',
      contactSubtitle: 'Descreva sua demanda para uma avaliacao inicial do melhor caminho juridico.',
      contactEmail: process.env.PUBLIC_CONTACT_EMAIL || process.env.CONTACT_EMAIL || 'contato@cavalcantealbuquerque.com.br',
      contactPhone: process.env.PUBLIC_CONTACT_PHONE || '(84) 99124-3985',
      contactAddress: 'Rua Francisco Maia Sobrinho, 1950\nLagoa Nova - Natal/RN, 59062-250',
      aboutTitle: 'Sobre a Cavalcante Albuquerque',
      aboutSubtitle: 'Advocacia e consultoria com foco em estrategia, solidez e comunicacao direta.',
      aboutHistory: 'A Cavalcante Albuquerque nasce para oferecer atendimento juridico tecnico, organizado e proximo do cliente. A estrutura combina atuacao consultiva, contenciosa e resposta rapida em urgencias.',
      aboutTimeline: [
        { year: 'Formacao', title: 'Base tecnica', description: 'Experiencia construida em demandas civeis, consumidor, digital, criminal e consultoria.' },
        { year: 'Atuacao', title: 'Metodo de acompanhamento', description: 'Cada caso recebe analise de risco, organizacao documental e comunicacao objetiva.' },
        { year: 'Hoje', title: 'Cavalcante Albuquerque', description: 'Escritorio estruturado para atendimento estrategico em Natal/RN e canais digitais.' },
      ],
      aboutValues: [
        { title: 'Tecnica', description: 'Analise juridica consistente antes de qualquer medida.', icon: 'scale' },
        { title: 'Clareza', description: 'Comunicacao direta sobre riscos, prazos e proximos passos.', icon: 'users' },
        { title: 'Solidez', description: 'Estrategias sustentadas por documentos, precedentes e contexto do cliente.', icon: 'shield' },
      ],
    },
  })

  await (payload as any).updateGlobal({
    slug: 'homepage',
    data: {
      aboutPartners: {
        sectionTitle: 'Quem conduz o seu caso',
        sectionDescription: 'Atendimento juridico com responsabilidade tecnica, leitura estrategica e contato direto.',
        partnersList: [
          {
            name: 'Dr. Edivaldo Cavalcante Albuquerque',
            role: 'Advogado Titular',
            areas: 'Civil, Consumidor, Digital, Penal e Consultoria',
            oab: pending,
            bio: 'Atuacao focada em estrategia juridica, protecao de direitos e acompanhamento proximo do cliente.',
          },
        ],
      },
    },
  })

  await (payload as any).updateGlobal({
    slug: 'navigation',
    data: {
      headerLinks: [
        { label: 'Inicio', href: '/', highlight: false },
        { label: 'Sobre', href: '/sobre', highlight: false },
        { label: 'Areas de atuacao', href: '/areas-de-atuacao', highlight: false },
        { label: 'Campanhas', href: '/campanhas', highlight: true },
        { label: 'Blog', href: '/blog', highlight: false },
        { label: 'Contato', href: '/contato', highlight: false },
      ],
      footerColumns: [
        {
          title: 'Institucional',
          links: [
            { label: 'Sobre', href: '/sobre' },
            { label: 'Areas de atuacao', href: '/areas-de-atuacao' },
            { label: 'Campanhas', href: '/campanhas' },
            { label: 'Blog', href: '/blog' },
          ],
        },
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

  console.log('updated: globals demo')
}

async function seedTeam(payload: PayloadInstance) {
  await upsertBySlug(payload, 'team', 'edivaldo-cavalcante-albuquerque', {
    name: 'Dr. Edivaldo Cavalcante Albuquerque',
    shortName: 'Dr. Edivaldo',
    role: 'Advogado Titular',
    oab: pending,
    bio: richText('Advogado titular da Cavalcante Albuquerque, com atuacao em demandas consultivas e contenciosas.', 'Atendimento orientado por estrategia, organizacao documental e comunicacao direta com o cliente.'),
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
      shortDescription: 'Protecao de dados, contratos digitais, incidentes de seguranca e conflitos em plataformas.',
      caseTypes: ['Adequacao LGPD', 'Vazamento de dados', 'Remocao de conteudo', 'Contratos digitais'],
    },
    {
      title: 'Direito Civil', slug: 'direito-civil', icon: 'scale', order: 2,
      shortDescription: 'Contratos, responsabilidade civil, cobrancas, indenizacoes e conflitos patrimoniais.',
      caseTypes: ['Revisao contratual', 'Indenizacao', 'Cobranca', 'Obrigacoes'],
    },
    {
      title: 'Direito do Consumidor', slug: 'direito-consumidor', icon: 'shopping-bag', order: 3,
      shortDescription: 'Fraudes bancarias, negativacao indevida, cobrancas abusivas e falhas de servico.',
      caseTypes: ['Fraude bancaria', 'Negativacao indevida', 'Cobran?a abusiva', 'Produto com defeito'],
    },
    {
      title: 'Direito Imobiliario', slug: 'direito-imobiliario', icon: 'home', order: 4,
      shortDescription: 'Compra e venda, locacao, posse, propriedade, regularizacao e conflitos condominiais.',
      caseTypes: ['Contrato imobiliario', 'Locacao', 'Usucapiao', 'Condominio'],
    },
    {
      title: 'Direito Tributario', slug: 'direito-tributario', icon: 'receipt', order: 5,
      shortDescription: 'Consultoria, defesa administrativa, execucoes fiscais e planejamento tributario.',
      caseTypes: ['Execucao fiscal', 'Defesa administrativa', 'Parcelamento', 'Planejamento'],
    },
    {
      title: 'Licitacoes e Contratos Administrativos', slug: 'licitacoes', icon: 'file-text', order: 6,
      shortDescription: 'Apoio em editais, recursos, impugnacoes, contratos publicos e relacoes com a administracao.',
      caseTypes: ['Impugnacao de edital', 'Recurso administrativo', 'Contrato publico', 'Sancoes administrativas'],
    },
    {
      title: 'Direito Penal', slug: 'direito-penal', icon: 'gavel', order: 7,
      shortDescription: 'Defesa tecnica em investigacoes, flagrantes, audiencias de custodia e medidas urgentes.',
      caseTypes: ['Flagrante', 'Audiencia de custodia', 'Inquerito policial', 'Medidas cautelares'], is24h: true,
    },
  ]

  for (const area of areas) {
    await upsertBySlug(payload, 'practice-areas', area.slug, {
      title: area.title,
      icon: area.icon,
      shortDescription: area.shortDescription,
      heroHeadline: area.shortDescription,
      content: richText(
        `${area.title} exige avaliacao individual do contexto, documentos disponiveis e riscos envolvidos.`,
        'Este conteudo de demonstracao serve para validar o layout e deve ser substituido pela redacao final aprovada pelo escritorio.',
      ),
      caseTypes: area.caseTypes.map((name) => ({ name })),
      faq: [
        { question: 'Como funciona o primeiro atendimento?', answer: 'A equipe coleta os fatos principais, documentos e prazos para indicar os proximos passos.' },
        { question: 'O atendimento pode ser online?', answer: 'Sim. O contato inicial pode ocorrer por WhatsApp, telefone ou formulario do site.' },
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
      title: 'Fraudes bancarias e golpes digitais', slug: 'fraudes-bancarias', category: 'consumidor', colorAccent: 'gold',
      subtitle: 'Contestacao de transacoes nao reconhecidas, emprestimos fraudulentos e falhas de seguranca bancaria.',
      urgencyText: 'Atendimento para bloqueio de danos e organizacao de provas.',
      whatsappMessage: 'Ola! Preciso de orientacao sobre fraude bancaria ou golpe digital.',
    },
    {
      title: 'Negativacao indevida', slug: 'negativacao-indevida', category: 'consumidor', colorAccent: 'blue',
      subtitle: 'Avaliacao de inscricoes indevidas em SPC/Serasa e pedidos de retirada com indenizacao quando cabivel.',
      urgencyText: 'Verifique documentos e prazos antes de negociar a divida.',
      whatsappMessage: 'Ola! Meu nome foi negativado e quero avaliar meu caso.',
    },
    {
      title: 'Plantao criminal 24h', slug: 'plantao-criminal-24h', category: 'criminal', colorAccent: 'red',
      subtitle: 'Atendimento para flagrante, audiencia de custodia, busca e apreensao e medidas urgentes.',
      urgencyText: 'Plantao criminal: resposta imediata por WhatsApp.',
      whatsappMessage: 'Ola! Preciso de atendimento criminal urgente.',
    },
  ]

  for (const campaign of campaigns) {
    await upsertBySlug(payload, 'campaigns', campaign.slug, {
      ...campaign,
      status: 'active',
      featuredOnHomepage: true,
      showForm: true,
      startDate: now,
      problemDescription: richText('Muitas demandas chegam ao cliente com informacao fragmentada e prazos curtos.', 'A campanha organiza o atendimento inicial e facilita a coleta de informacoes essenciais.'),
      rightsExplanation: richText('Cada caso exige analise individual. A avaliacao inicial verifica documentos, provas, prazos e riscos juridicos.'),
      benefits: richText('A atuacao busca reduzir incerteza, preservar provas e definir uma estrategia compativel com o contexto do cliente.'),
      socialProof: [
        { text: 'Atendimento claro e cuidadoso desde o primeiro contato.', author: 'Cliente A.', caseType: campaign.category },
      ],
      faq: [
        { question: 'A analise inicial garante resultado?', answer: 'Nao. A analise indica caminhos possiveis, riscos e documentos necessarios, sem promessa de resultado.' },
        { question: 'Quais documentos devo enviar?', answer: 'Envie contratos, comprovantes, mensagens, protocolos, prints e documentos pessoais relacionados ao caso.' },
      ],
      socialCaption: `${campaign.title}: entenda seus direitos e organize os documentos antes de tomar uma decisao.`,
      socialHashtags: ['#CavalcanteAlbuquerque', '#Advocacia', '#DireitoRN'],
      targetAudience: 'Pessoas fisicas e empresas em Natal/RN com demanda juridica relacionada ao tema da campanha.',
      seo: { metaTitle: `${campaign.title} | Cavalcante Albuquerque`, metaDescription: campaign.subtitle },
    })
  }
}

async function seedPosts(payload: PayloadInstance, teamId: number | null) {
  const posts = [
    { title: 'Como organizar documentos antes de falar com um advogado', slug: 'organizar-documentos-atendimento-juridico', category: 'geral', linkedCampaign: '', excerpt: 'Uma lista objetiva do que separar para tornar a primeira avaliacao juridica mais eficiente.' },
    { title: 'Fraude bancaria: primeiros passos para reduzir prejuizos', slug: 'fraude-bancaria-primeiros-passos', category: 'direito-consumidor', linkedCampaign: 'fraudes-bancarias', excerpt: 'Medidas iniciais para preservar provas, comunicar o banco e avaliar responsabilidades.' },
    { title: 'LGPD na pratica: riscos comuns em pequenos negocios', slug: 'lgpd-riscos-pequenos-negocios', category: 'lgpd', linkedCampaign: '', excerpt: 'Pontos frequentes de atencao em cadastro de clientes, contratos, WhatsApp e armazenamento de dados.' },
    { title: 'Atendimento criminal urgente: o que informar no primeiro contato', slug: 'atendimento-criminal-urgente-primeiro-contato', category: 'direito-penal', linkedCampaign: 'plantao-criminal-24h', excerpt: 'Informacoes essenciais para orientar uma resposta rapida em situacoes criminais.' },
  ]

  for (const [index, post] of posts.entries()) {
    await upsertBySlug(payload, 'posts', post.slug, {
      ...post,
      content: richText(post.excerpt, 'Este artigo demonstrativo ajuda a validar o layout do blog e deve ser revisado antes de uso definitivo.', 'A orientacao juridica depende da analise concreta dos documentos e fatos.'),
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
    { title: 'STJ reforca importancia da prova documental em relacoes de consumo', slug: 'stj-prova-documental-consumo', category: 'direito-consumidor', source: 'Demonstracao editorial', linkedCampaign: 'fraudes-bancarias' },
    { title: 'ANPD publica orientacoes sobre seguranca e tratamento de dados', slug: 'anpd-orientacoes-seguranca-dados', category: 'lgpd', source: 'Demonstracao editorial', linkedCampaign: '' },
    { title: 'Prazos processuais exigem acompanhamento preventivo', slug: 'prazos-processuais-acompanhamento-preventivo', category: 'geral', source: 'Demonstracao editorial', linkedCampaign: '' },
    { title: 'Audiencia de custodia: informacao rapida faz diferenca', slug: 'audiencia-custodia-informacao-rapida', category: 'direito-penal', source: 'Demonstracao editorial', linkedCampaign: 'plantao-criminal-24h' },
  ]

  for (const [index, item] of news.entries()) {
    await upsertBySlug(payload, 'news-articles', item.slug, {
      ...item,
      excerpt: 'Nota demonstrativa para validar a secao de noticias e o comportamento visual da homepage.',
      content: richText('Resumo editorial de demonstracao para homologacao visual do site.'),
      sourceUrl: 'https://cavalcantealbuquerque.com.br',
      sourceHash: `demo-${item.slug}`,
      relevanceScore: 80 - index,
      aiSummary: 'Conteudo demonstrativo para composicao visual.',
      editorialNotes: 'Substituir por noticia real antes da publicacao definitiva.',
      autoImported: false,
      status: 'published',
      publishedAt: new Date(Date.now() - (index + 1) * 43200000).toISOString(),
    })
  }
}

async function seedTestimonials(payload: PayloadInstance) {
  const testimonials = [
    { authorName: 'Cliente empresarial', caseType: 'Consultoria', text: 'A comunicacao foi objetiva e o encaminhamento do caso trouxe seguranca para decidir os proximos passos.' },
    { authorName: 'Cliente consumidor', caseType: 'Consumidor', text: 'Recebi orientacao clara sobre documentos, prazos e alternativas antes de qualquer medida.' },
    { authorName: 'Cliente pessoa fisica', caseType: 'Civil', text: 'O atendimento foi cuidadoso e organizado, com explicacao simples sobre riscos e possibilidades.' },
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
    { title: 'Politica de Privacidade', slug: 'politica-de-privacidade', description: 'Texto demonstrativo de politica de privacidade para validacao visual.' },
    { title: 'Termos de Uso', slug: 'termos-de-uso', description: 'Texto demonstrativo de termos de uso para validacao visual.' },
    { title: 'Politica de Cookies', slug: 'politica-de-cookies', description: 'Texto demonstrativo de politica de cookies para validacao visual.' },
  ]

  for (const page of pages) {
    await upsertBySlug(payload, 'pages', page.slug, {
      title: page.title,
      content: richText(page.description, 'Substituir este conteudo pela versao juridica definitiva antes da publicacao final.'),
      status: 'published',
      seo: { metaTitle: `${page.title} | Cavalcante Albuquerque`, metaDescription: page.description },
    })
  }
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL nao configurado')
  if (!process.env.PAYLOAD_SECRET) throw new Error('PAYLOAD_SECRET nao configurado')

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

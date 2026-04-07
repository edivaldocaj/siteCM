import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const categoryTemplates: Record<string, string> = {
  consumidor: `Você é um advogado especializado em Direito do Consumidor atuando no RN. Gere uma MINUTA de petição inicial com base nos dados fornecidos. Use os precedentes jurisprudenciais fornecidos. Estruture com: Qualificação das partes, Dos fatos, Do direito (com fundamentação legal: CDC, CC, jurisprudência), Dos danos (material e moral se aplicável), Dos pedidos, Do valor da causa.`,
  digital: `Você é um advogado especializado em Direito Digital e LGPD. Gere uma MINUTA de petição inicial para ação envolvendo dados pessoais, privacidade ou tecnologia. Fundamente na LGPD (Lei 13.709/2018), Marco Civil da Internet (Lei 12.965/2014), CDC quando aplicável, e jurisprudência fornecida.`,
  criminal: `Você é um advogado criminalista. Gere uma MINUTA da peça processual adequada (defesa prévia, resposta à acusação, ou habeas corpus) com base nos dados. Use CPP, CP e jurisprudência fornecida. ATENÇÃO: esta é apenas uma minuta para revisão obrigatória pelo advogado.`,
  imobiliario: `Você é um advogado especializado em Direito Imobiliário. Gere uma MINUTA de petição inicial para questão imobiliária. Fundamente no CC/2002, Lei de Incorporações (4.591/64), CDC quando aplicável, e jurisprudência fornecida.`,
  tributario: `Você é um advogado tributarista. Gere uma MINUTA de peça processual tributária (ação anulatória, mandado de segurança, embargos à execução) com base nos dados. Fundamente no CTN, CF/88, legislação específica e jurisprudência fornecida.`,
}

/* POST: Gerar minuta de petição com IA */
export async function POST(req: NextRequest) {
  const secret = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (secret !== process.env.NEWS_REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { leadId, category, additionalContext } = body

    if (!leadId || !category) {
      return NextResponse.json({ error: 'leadId e category obrigatórios.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // Buscar lead
    const lead = await (payload as any).findByID({ collection: 'leads', id: leadId })
    if (!lead) {
      return NextResponse.json({ error: 'Lead não encontrado.' }, { status: 404 })
    }

    // Buscar jurisprudência relevante
    let jurisprudenceContext = ''
    try {
      const juris = await (payload as any).find({
        collection: 'jurisprudence',
        where: { category: { equals: category } },
        sort: '-relevance',
        limit: 5,
      })
      if (juris.docs.length > 0) {
        jurisprudenceContext = '\n\nPRECEDENTES JURISPRUDENCIAIS (usar obrigatoriamente):\n' +
          juris.docs.map((j: any) =>
            `- ${j.court}: ${j.caseNumber || ''} — ${j.title}\n  Ementa: ${j.summary}`
          ).join('\n\n')
      }
    } catch { /* collection may not exist */ }

    // Montar prompt
    const systemPrompt = categoryTemplates[category] || categoryTemplates.consumidor
    const qualAnswers = lead.qualificationAnswers?.length
      ? lead.qualificationAnswers.map((qa: any) => `${qa.question}: ${qa.answer}`).join('\n')
      : 'Não informado'

    const userPrompt = `
DADOS DO CASO:
- Nome: ${lead.name}
- Telefone: ${lead.phone}
- E-mail: ${lead.email || 'Não informado'}
- CPF: ${lead.cpf || 'Não informado'}
- Campanha de origem: ${lead.campaignSlug || 'Não informado'}
- Descrição do caso: ${lead.caseDescription || 'Não informado'}
- Valor estimado: ${lead.estimatedValue ? `R$ ${Number(lead.estimatedValue).toLocaleString('pt-BR')}` : 'Não informado'}
- Urgência: ${lead.urgency || 'Não informado'}

RESPOSTAS DE QUALIFICAÇÃO:
${qualAnswers}

${additionalContext ? `CONTEXTO ADICIONAL DO ADVOGADO:\n${additionalContext}` : ''}
${jurisprudenceContext}

IMPORTANTE:
1. Use APENAS os precedentes fornecidos acima. NÃO invente jurisprudência.
2. Esta é uma MINUTA que requer revisão obrigatória pelo advogado.
3. Use comarca de Natal/RN como foro, salvo se indicado diferente.
4. Inclua aviso claro: "MINUTA — REVISÃO OBRIGATÓRIA ANTES DE PROTOCOLAR."
`

    // Chamar Claude API
    const anthropicKey = process.env.ANTHROPIC_API_KEY
    if (!anthropicKey) {
      return NextResponse.json({
        error: 'ANTHROPIC_API_KEY não configurada. Configure a variável de ambiente para usar o gerador de petições.',
      }, { status: 503 })
    }

    const aiResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    const aiData = await aiResponse.json()
    const petition = aiData.content?.[0]?.text || 'Erro ao gerar minuta.'

    // Registrar no lead
    await (payload as any).update({
      collection: 'leads',
      id: leadId,
      data: {
        notes: [
          ...(lead.notes || []),
          {
            text: `Minuta de petição gerada via IA (categoria: ${category}). Revisão obrigatória.`,
            author: 'system',
            date: new Date().toISOString(),
          },
        ],
      },
    })

    return NextResponse.json({
      success: true,
      petition,
      category,
      jurisprudenceUsed: jurisprudenceContext ? true : false,
      disclaimer: 'MINUTA GERADA POR IA — REVISÃO OBRIGATÓRIA ANTES DE USO.',
    })
  } catch (error) {
    console.error('[Petition Generator] Error:', error)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

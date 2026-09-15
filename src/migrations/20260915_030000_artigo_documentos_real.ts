import { sql, type MigrateUpArgs } from '@payloadcms/db-postgres'

const articleContent = {
  root: {
    type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
    children: [
      'Uma primeira conversa jurídica costuma ser mais proveitosa quando os fatos e os documentos principais estão organizados. Isso não significa que seja necessário ter tudo em mãos: a finalidade é permitir uma compreensão inicial mais clara do caso.',
      'Comece reunindo documentos de identificação e os registros diretamente ligados à situação: contratos, propostas, comprovantes, notificações, decisões, boletins de ocorrência, recibos ou conversas relevantes.',
      'Em seguida, monte uma linha do tempo simples. Anote o que aconteceu, em quais datas, quem participou e quais providências já foram tomadas. Prazos legais ou contratuais merecem atenção especial.',
      'Quando houver mensagens, e-mails, arquivos digitais ou publicações, preserve os materiais no formato original sempre que possível. Capturas de tela devem mostrar data, contexto e identificação da conversa ou página.',
      'Também ajuda listar dúvidas e objetivos práticos: por exemplo, compreender uma cobrança, responder a uma notificação, avaliar um contrato ou buscar orientação diante de um conflito. A primeira conversa serve para definir os próximos passos adequados.',
      'Cada situação exige análise individual de fatos, documentos e prazos. Este conteúdo é informativo e não substitui orientação jurídica personalizada.',
    ].map((text) => ({
      type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '',
      children: [{ type: 'text', text, version: 1 }],
    })),
  },
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "posts"
    SET
      "excerpt" = 'Documentos, fatos e datas que ajudam a tornar a primeira conversa jurídica mais clara e objetiva.',
      "content" = ${JSON.stringify(articleContent)}::jsonb,
      "read_time" = 5,
      "updated_at" = now()
    WHERE "slug" = 'organizar-documentos-atendimento-juridico';
  `)
}

export async function down(): Promise<void> {
  throw new Error('O conteúdo editorial foi publicado deliberadamente; restaure-o pelo CMS se necessário.')
}

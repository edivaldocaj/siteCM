import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CalendarDays } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Solicitar horário',
  description: 'Envie sua preferência de horário para atendimento com o Cavalcante Albuquerque Advocacia e Consultoria.',
}

async function horariosLivres() {
  try {
    const response = await fetch('https://n8n.cavalcantealbuquerque.com.br/webhook/disponibilidade-ca', { next: { revalidate: 300 } })
    const data = await response.json()
    return Array.isArray(data.horarios) ? data.horarios.slice(0, 9) : []
  } catch { return [] }
}

export default async function AgendarPage() {
  const horarios = await horariosLivres()
  return (
    <>
      <section className="ca-page-hero ca-page-hero--contact">
        <div className="container-wide mx-auto ca-page-hero__inner">
          <span className="ca-eyebrow ca-eyebrow--dark">Atendimento</span>
          <h1>Solicite um horário</h1>
          <p>Conte brevemente o assunto e a sua preferência de dia ou período. A equipe confirma o atendimento somente após verificar a disponibilidade.</p>
        </div>
      </section>

      <section className="ca-story">
        <div className="container-wide mx-auto ca-story__inner">
          <div className="ca-story__copy">
            <span className="ca-eyebrow">Disponibilidade inicial</span>
            <h2>Horários livres para solicitação</h2>
            <p>Escolha uma preferência no formulário. A equipe confirma qualquer atendimento antes da reserva.</p>
          </div>
          <div className="ca-story__timeline" aria-label="Horários livres">
            {horarios.map((horario: { inicio: string }) => <article key={horario.inicio}><strong>{new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }).format(new Date(horario.inicio))}</strong><p>Disponibilidade sujeita à confirmação humana.</p></article>)}
          </div>
        </div>
      </section>

      <section className="ca-story">
        <div className="container-wide mx-auto ca-story__inner">
          <div className="ca-story__copy">
            <CalendarDays className="ca-areas-list__icon" aria-hidden="true" />
            <span className="ca-eyebrow">Como funciona</span>
            <h2>Um pedido claro, sem promessa de disponibilidade</h2>
            <p>O pedido inicia a triagem do atendimento. Horário, formato e profissional responsável são confirmados em contato posterior.</p>
            <Link href="/contato#formulario-agendamento" className="btn-primary">
              Enviar pedido de horário <ArrowRight size={16} />
            </Link>
          </div>

          <div className="ca-story__timeline" aria-label="Etapas do agendamento">
            <article>
              <span>01</span>
              <h3>Envie sua preferência</h3>
              <p>Use o formulário de contato e informe o assunto, dias ou períodos que funcionam para você e um telefone para retorno.</p>
            </article>
            <article>
              <span>02</span>
              <h3>A equipe avalia a solicitação</h3>
              <p>O atendimento inicial organiza as informações e verifica a agenda adequada ao caso.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Você recebe a confirmação</h3>
              <p>O horário só está reservado depois da confirmação expressa enviada pelo escritório.</p>
            </article>
          </div>
        </div>
      </section>
    </>
  )
}

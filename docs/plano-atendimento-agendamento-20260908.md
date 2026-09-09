# Atendimento e agendamento automatizados

## Ordem de implantação

1. Recepção durável: cada lead com consentimento gera uma única tarefa de atendimento. Um reconciliador determinístico recupera tarefas perdidas após reinício.
2. Contexto: o agente recebe campanha, nome, respostas e relato já informados. Pergunta apenas o próximo dado útil; município/UF só é solicitado quando necessário para competência ou modalidade presencial.
3. Agenda: disponibilidade, reserva temporária, confirmação, remarcação e cancelamento são operações determinísticas. A confirmação só é enviada após releitura do compromisso no EspoCRM e no Google Calendar.
4. Site: `/agendar` e CTAs de campanha consultam o mesmo serviço de disponibilidade. Não existe uma segunda fonte de verdade para reuniões.
5. Piloto: flags independentes por escritório e recurso; modo sombra; ativação progressiva; pausa imediata.

## Estados mínimos

`pending`, `claimed`, `sent`, `unknown`, `failed`, `skipped` para atendimento; `requested`, `holding`, `confirmed`, `reschedule_pending`, `cancelled`, `failed` para agenda. Timeout vira `unknown` e aguarda reconciliação; não há reenvio cego.

## Critérios de aceite

- Formulário repetido, reinício e entrada simultânea pelo WhatsApp produzem no máximo uma recepção.
- O agente não repete nome, campanha ou respostas já disponíveis.
- Lead sem cidade pode receber acolhimento e orientação inicial.
- Slot vencido ou ocupado nunca é confirmado; duas reservas concorrentes confirmam no máximo uma.
- Falha do Google ou CRM não produz confirmação falsa nem reunião duplicada.
- Remarcação preserva o vínculo do lead; cancelamento aparece nos dois sistemas.
- Opt-out, pausa, revisão jurídica e transferência humana são rechecados imediatamente antes de qualquer mensagem.

## Economia e segurança

O LLM escolhe linguagem e próxima pergunta. Código controla elegibilidade, credenciais, disponibilidade, autorização, idempotência e auditoria. A recepção imediata usa eventos; a busca periódica cobre apenas perdas e exceções, sem reler todos os leads antigos. Dados jurídicos não são enviados ao título ou descrição do Google Calendar.

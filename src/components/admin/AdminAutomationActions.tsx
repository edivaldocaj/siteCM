'use client'

import { useState } from 'react'

type TaskSlug = 'send-deadline-alerts' | 'sync-news-feed'

const actions: Array<{ label: string; task: TaskSlug }> = [
  { label: 'Rodar noticias', task: 'sync-news-feed' },
  { label: 'Rodar prazos', task: 'send-deadline-alerts' },
]

export default function AdminAutomationActions() {
  const [activeTask, setActiveTask] = useState<TaskSlug | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function runTask(task: TaskSlug) {
    setActiveTask(task)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/automation-jobs', {
        body: JSON.stringify({ runNow: true, task }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      const text = await response.text()
      let data: { directFallback?: boolean; error?: string; queueError?: string; queued?: boolean; runError?: string } = {}

      if (text) {
        try {
          data = JSON.parse(text)
        } catch {
          data = { error: text.slice(0, 240) }
        }
      }

      if (!response.ok) {
        setError(data.error || 'Nao foi possivel executar o job.')
        return
      }

      if (data.runError) {
        setMessage(`Job enfileirado. Execucao imediata pendente: ${data.runError}`)
        return
      }

      if (data.directFallback) {
        const detail = data.queueError ? ` Detalhe da fila: ${data.queueError}` : ''
        setMessage(
          `Automacao executada diretamente. A fila nativa nao aceitou o job neste deploy; as migrations automaticas devem corrigir isso quando o deploy novo concluir.${detail}`,
        )
        return
      }

      if (data.queueError) {
        setError(`Fila nativa indisponivel: ${data.queueError}`)
        return
      }

      setMessage(data.queued ? 'Job enfileirado e executado pela fila nativa do Payload.' : 'Solicitacao concluida.')
    } catch {
      setError('Nao foi possivel chamar /api/automation-jobs. Verifique se o deploy atual ja inclui essa rota.')
    } finally {
      setActiveTask(null)
    }
  }

  return (
    <div className="ca-admin-dashboard__job-actions">
      <div>
        {actions.map((action) => (
          <button key={action.task} disabled={Boolean(activeTask)} onClick={() => runTask(action.task)} type="button">
            {activeTask === action.task ? 'Executando...' : action.label}
          </button>
        ))}
      </div>
      {message && <p className="ca-admin-dashboard__job-message ca-admin-dashboard__job-message--success">{message}</p>}
      {error && <p className="ca-admin-dashboard__job-message ca-admin-dashboard__job-message--error">{error}</p>}
    </div>
  )
}

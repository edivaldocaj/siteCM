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
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Nao foi possivel executar o job.')
        return
      }

      setMessage('Job enfileirado e executado pela fila nativa do Payload.')
    } catch {
      setError('Falha de conexao ao executar o job.')
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

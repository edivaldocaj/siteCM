'use client'

import { useState } from 'react'

type TaskSlug = 'send-deadline-alerts' | 'sync-news-feed'
type ActionSlug = 'run-queue' | TaskSlug
type AutomationJobsResponse = {
  directFallback?: boolean
  error?: string
  queueError?: string
  queueProcessed?: boolean
  queued?: boolean
  runError?: string
  runResult?: unknown
}

const actions: Array<{ action?: 'run-queue'; label: string; task?: TaskSlug }> = [
  { label: 'Rodar noticias', task: 'sync-news-feed' },
  { label: 'Rodar prazos', task: 'send-deadline-alerts' },
  { action: 'run-queue', label: 'Processar fila' },
]

function findMetric(value: unknown, keys: string[]): number | null {
  if (!value || typeof value !== 'object') return null

  for (const key of keys) {
    if (key in value) {
      const numberValue = Number((value as Record<string, unknown>)[key])
      if (Number.isFinite(numberValue)) return numberValue
    }
  }

  for (const nested of Object.values(value as Record<string, unknown>)) {
    const result = findMetric(nested, keys)
    if (result !== null) return result
  }

  return null
}

function summarizeRunResult(task: TaskSlug, runResult: unknown) {
  if (task === 'sync-news-feed') {
    const fetched = findMetric(runResult, ['fetched'])
    const saved = findMetric(runResult, ['saved'])
    if (fetched !== null || saved !== null) {
      return ` ${saved ?? 0} noticia(s) nova(s) de ${fetched ?? 0} item(ns) lido(s).`
    }
  }

  const alertsSent = findMetric(runResult, ['alertsSent'])
  if (alertsSent !== null) return ` ${alertsSent} alerta(s) enviado(s).`

  return ''
}

export default function AdminAutomationActions() {
  const [activeAction, setActiveAction] = useState<ActionSlug | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function runAction(action: { action?: 'run-queue'; label: string; task?: TaskSlug }) {
    const actionKey = action.action || action.task
    if (!actionKey) return

    setActiveAction(actionKey)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/automation-jobs', {
        body: JSON.stringify(action.action ? { action: action.action } : { runNow: true, task: action.task }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      const text = await response.text()
      let data: AutomationJobsResponse = {}

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

      if (data.queueProcessed) {
        if (data.runError) {
          setError(`Fila processada com pendencia: ${data.runError}`)
          return
        }

        setMessage('Fila nativa processada pelo Payload.')
        return
      }

      if (data.runError) {
        setMessage(`Job enfileirado. Execucao imediata pendente: ${data.runError}`)
        return
      }

      if (data.directFallback) {
        const detail = data.queueError ? ` Detalhe da fila: ${data.queueError}` : ''
        setMessage(
          `Automacao executada diretamente.${summarizeRunResult(action.task || 'sync-news-feed', data.runResult)} A fila nativa recusou o job mesmo apos o reparo automatico do schema.${detail}`,
        )
        return
      }

      if (data.queueError) {
        setError(`Fila nativa indisponivel: ${data.queueError}`)
        return
      }

      setMessage(
        data.queued
          ? `Job enfileirado e executado pela fila nativa do Payload.${summarizeRunResult(action.task || 'sync-news-feed', data.runResult)}`
          : `Solicitacao concluida.${summarizeRunResult(action.task || 'sync-news-feed', data.runResult)}`,
      )
    } catch {
      setError('Nao foi possivel chamar /api/automation-jobs. Verifique se o deploy atual ja inclui essa rota.')
    } finally {
      setActiveAction(null)
    }
  }

  return (
    <div className="ca-admin-dashboard__job-actions">
      <div>
        {actions.map((action) => (
          <button key={action.action || action.task} disabled={Boolean(activeAction)} onClick={() => runAction(action)} type="button">
            {activeAction === (action.action || action.task) ? 'Executando...' : action.label}
          </button>
        ))}
      </div>
      {message && <p className="ca-admin-dashboard__job-message ca-admin-dashboard__job-message--success">{message}</p>}
      {error && <p className="ca-admin-dashboard__job-message ca-admin-dashboard__job-message--error">{error}</p>}
    </div>
  )
}

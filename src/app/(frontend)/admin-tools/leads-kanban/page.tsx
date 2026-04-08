'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, RefreshCw, Phone, Mail, Calendar, Star, Loader2, ChevronDown, ChevronUp, User, MessageCircle, ExternalLink, Filter } from 'lucide-react'
import Link from 'next/link'
import { useAdminAuth } from '@/components/admin/AdminAuthContext'

interface Lead {
  id: string
  name: string
  phone: string
  email: string
  status: string
  score: number
  source: string
  campaignSlug: string
  urgency: string
  assignedTo: string
  caseDescription: string
  estimatedValue: number
  createdAt: string
  nextFollowUp: string
  notes: Array<{ text: string; author: string; date: string }>
}

const columns = [
  { key: 'new', label: 'Novo', emoji: '🟡', color: '#eab308' },
  { key: 'contacted', label: 'Contatado', emoji: '📞', color: '#3b82f6' },
  { key: 'qualified', label: 'Qualificado', emoji: '✅', color: '#8b5cf6' },
  { key: 'proposal', label: 'Proposta', emoji: '📋', color: '#c4a96a' },
  { key: 'converted', label: 'Convertido', emoji: '🎉', color: '#25D366' },
  { key: 'lost', label: 'Perdido', emoji: '❌', color: '#dc2626' },
]

const urgencyColors: Record<string, string> = {
  low: '#25D366', medium: '#c4a96a', high: '#ea580c', urgent: '#dc2626',
}
const urgencyLabels: Record<string, string> = {
  low: 'Baixa', medium: 'Média', high: 'Alta', urgent: 'Urgente',
}
const sourceLabels: Record<string, string> = {
  'campaign-form': 'Campanha', 'contact-form': 'Contato', whatsapp: 'WhatsApp', referral: 'Indicação', calculator: 'Calculadora', other: 'Outro',
}

function LeadCard({ lead, onStatusChange }: { lead: Lead; onStatusChange: (id: string, newStatus: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [changingStatus, setChangingStatus] = useState(false)

  const scoreColor = lead.score >= 60 ? '#25D366' : lead.score >= 30 ? '#c4a96a' : '#b8bfc8'
  const whatsappUrl = `https://wa.me/55${lead.phone.replace(/\D/g, '')}`
  const timeSince = getTimeSince(lead.createdAt)

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '10px',
      padding: '14px',
      marginBottom: '10px',
      borderLeft: `3px solid ${urgencyColors[lead.urgency] || '#c4a96a'}`,
      cursor: 'pointer',
      transition: 'all 0.2s',
    }}>
      {/* Header */}
      <div onClick={() => setExpanded(!expanded)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontWeight: 600, fontSize: '14px', color: '#f1eae2' }}>{lead.name}</span>
            <span style={{
              background: `${scoreColor}20`, color: scoreColor,
              fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px',
            }}>{lead.score}</span>
          </div>
          <div style={{ fontSize: '12px', color: '#b8bfc8', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {lead.campaignSlug && <span style={{ color: '#c4a96a' }}>{lead.campaignSlug}</span>}
            <span>{sourceLabels[lead.source] || lead.source}</span>
            <span>• {timeSince}</span>
          </div>
        </div>
        {expanded ? <ChevronUp style={{ width: '16px', color: '#666' }} /> : <ChevronDown style={{ width: '16px', color: '#666' }} />}
      </div>

      {/* Expanded */}
      {expanded && (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Contact buttons */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <a href={whatsappUrl} target="_blank" rel="noopener" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.2)', borderRadius: '6px', color: '#25D366', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
              <MessageCircle style={{ width: '14px' }} /> WhatsApp
            </a>
            {lead.email && (
              <a href={`mailto:${lead.email}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '6px', color: '#3b82f6', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
                <Mail style={{ width: '14px' }} /> E-mail
              </a>
            )}
          </div>

          {/* Details */}
          <div style={{ fontSize: '12px', color: '#b8bfc8' }}>
            <p><strong style={{ color: '#999' }}>Tel:</strong> {lead.phone}</p>
            {lead.email && <p><strong style={{ color: '#999' }}>Email:</strong> {lead.email}</p>}
            {lead.estimatedValue > 0 && <p><strong style={{ color: '#999' }}>Valor:</strong> R$ {Number(lead.estimatedValue).toLocaleString('pt-BR')}</p>}
            <p><strong style={{ color: '#999' }}>Urgência:</strong> <span style={{ color: urgencyColors[lead.urgency] }}>{urgencyLabels[lead.urgency] || lead.urgency}</span></p>
            {lead.assignedTo && <p><strong style={{ color: '#999' }}>Responsável:</strong> {lead.assignedTo === 'edivaldo' ? 'Dr. Edivaldo' : 'Dra. Gabrielly'}</p>}
            {lead.caseDescription && <p style={{ marginTop: '8px', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', lineHeight: 1.5 }}>{lead.caseDescription}</p>}
          </div>

          {/* Status change */}
          <div style={{ marginTop: '12px' }}>
            <p style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Mover para:</p>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {columns.filter(c => c.key !== lead.status).map(col => (
                <button key={col.key}
                  onClick={(e) => { e.stopPropagation(); onStatusChange(lead.id, col.key) }}
                  style={{
                    padding: '4px 10px', background: `${col.color}15`, border: `1px solid ${col.color}30`,
                    borderRadius: '4px', color: col.color, fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                  }}>
                  {col.emoji} {col.label}
                </button>
              ))}
            </div>
          </div>

          {/* CMS link */}
          <div style={{ marginTop: '12px', textAlign: 'right' }}>
            <a href={`/admin/collections/leads/${lead.id}`} target="_blank" rel="noopener" style={{ color: '#c4a96a', fontSize: '12px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Abrir no CMS <ExternalLink style={{ width: '12px' }} />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

function getTimeSince(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return 'agora'
  if (hours < 24) return `${hours}h atrás`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d atrás`
  return `${Math.floor(days / 7)}sem atrás`
}

export default function LeadsKanbanPage() {
  const { token } = useAdminAuth()
  const [loading, setLoading] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [error, setError] = useState('')
  const [filterAttorney, setFilterAttorney] = useState<string>('')
  const [filterCampaign, setFilterCampaign] = useState<string>('')

  async function fetchLeads() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/leads', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Erro'); return }
      setLeads(json.leads || [])
    } catch {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLeads() }, [])

  async function changeStatus(leadId: string, newStatus: string) {
    try {
      // Atualizar localmente imediatamente (otimistic update)
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l))

      // Persistir no backend
      await fetch(`/api/leads`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      })
    } catch {
      // Reverter se falhar
      fetchLeads()
    }
  }

  const filteredLeads = leads.filter(l => {
    if (filterAttorney && l.assignedTo !== filterAttorney) return false
    if (filterCampaign && l.campaignSlug !== filterCampaign) return false
    return true
  })

  const campaigns = [...new Set(leads.map(l => l.campaignSlug).filter(Boolean))]


  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1eae2', fontFamily: "'Source Sans 3', sans-serif" }}>
      {/* Header */}
      <div style={{ background: '#152138', padding: '16px 24px', borderBottom: '1px solid rgba(196,169,106,0.15)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/admin-tools" style={{ color: '#b8bfc8', textDecoration: 'none' }}><ArrowLeft style={{ width: '20px' }} /></Link>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', margin: 0 }}>Pipeline de <span style={{ color: '#c4a96a' }}>Leads</span></h1>
              <p style={{ color: '#b8bfc8', fontSize: '12px' }}>{filteredLeads.length} leads • {leads.filter(l => l.status === 'new').length} novos</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Filtros */}
            <select value={filterAttorney} onChange={e => setFilterAttorney(e.target.value)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px 12px', color: '#b8bfc8', fontSize: '12px' }}>
              <option value="">Todos advogados</option>
              <option value="edivaldo">Dr. Edivaldo</option>
              <option value="gabrielly">Dra. Gabrielly</option>
            </select>
            {campaigns.length > 0 && (
              <select value={filterCampaign} onChange={e => setFilterCampaign(e.target.value)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px 12px', color: '#b8bfc8', fontSize: '12px' }}>
                <option value="">Todas campanhas</option>
                {campaigns.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
            <button onClick={fetchLeads} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px 12px', color: '#b8bfc8', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <RefreshCw style={{ width: '12px' }} /> Atualizar
            </button>
            <Link href="/admin-tools/dashboard" style={{ background: '#c4a96a', color: '#152138', borderRadius: '6px', padding: '6px 16px', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
              Dashboard →
            </Link>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div style={{ padding: '24px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: '16px', minWidth: '1200px', maxWidth: '1600px', margin: '0 auto' }}>
          {columns.map(col => {
            const colLeads = filteredLeads.filter(l => l.status === col.key).sort((a, b) => b.score - a.score)
            return (
              <div key={col.key} style={{ flex: 1, minWidth: '230px' }}>
                {/* Column header */}
                <div style={{
                  background: `${col.color}12`, border: `1px solid ${col.color}25`,
                  borderRadius: '10px 10px 0 0', padding: '12px 16px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: col.color }}>
                    {col.emoji} {col.label}
                  </span>
                  <span style={{
                    background: `${col.color}20`, color: col.color,
                    fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px',
                  }}>
                    {colLeads.length}
                  </span>
                </div>
                {/* Cards */}
                <div style={{
                  background: 'rgba(255,255,255,0.015)',
                  borderRadius: '0 0 10px 10px',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderTop: 'none',
                  padding: '10px',
                  minHeight: '200px',
                  maxHeight: 'calc(100vh - 200px)',
                  overflowY: 'auto',
                }}>
                  {colLeads.map(lead => (
                    <LeadCard key={lead.id} lead={lead} onStatusChange={changeStatus} />
                  ))}
                  {colLeads.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '32px 16px', color: '#444', fontSize: '13px' }}>
                      Nenhum lead
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

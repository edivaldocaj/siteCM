'use client'

import { useState, useEffect } from 'react'
import { Clock, Users, AlertTriangle } from 'lucide-react'

interface CampaignCountdownProps {
  endDate: string | null
  campaignSlug: string
  accentColor: string
  helpedCount?: number
}

function calculateTimeLeft(endDate: string) {
  const diff = new Date(endDate).getTime() - Date.now()
  if (diff <= 0) return null

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export function CampaignCountdown({ endDate, campaignSlug, accentColor, helpedCount }: CampaignCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof calculateTimeLeft>>(null)
  const [leadCount, setLeadCount] = useState(helpedCount || 0)

  useEffect(() => {
    if (!endDate) return
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endDate))
    }, 1000)
    setTimeLeft(calculateTimeLeft(endDate))
    return () => clearInterval(timer)
  }, [endDate])

  // Buscar contagem real de leads da campanha
  useEffect(() => {
    if (helpedCount) return
    async function fetchCount() {
      try {
        const res = await fetch(`/api/campaign-track?campaign=${campaignSlug}`, {
          headers: { Authorization: `Bearer public-count` },
        })
        if (res.ok) {
          const data = await res.json()
          const campaign = data.campaigns?.find((c: any) => c.slug === campaignSlug)
          if (campaign?.metrics?.totalLeads) {
            setLeadCount(campaign.metrics.totalLeads)
          }
        }
      } catch { /* silent */ }
    }
    fetchCount()
  }, [campaignSlug, helpedCount])

  if (!endDate && !leadCount) return null

  const expired = endDate && !timeLeft

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(21,33,56,0.95) 0%, rgba(21,33,56,0.85) 100%)',
      backdropFilter: 'blur(8px)',
      border: `1px solid ${accentColor}33`,
      borderRadius: '12px',
      padding: '24px',
      margin: '24px 0',
    }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', justifyContent: 'center' }}>
        {/* Countdown */}
        {endDate && timeLeft && !expired && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', marginBottom: '12px' }}>
              <Clock style={{ width: '16px', height: '16px', color: accentColor }} />
              <span style={{ color: accentColor, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
                Prazo limite
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {[
                { value: timeLeft.days, label: 'dias' },
                { value: timeLeft.hours, label: 'horas' },
                { value: timeLeft.minutes, label: 'min' },
                { value: timeLeft.seconds, label: 'seg' },
              ].map(({ value, label }) => (
                <div key={label} style={{
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  minWidth: '56px',
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '24px',
                    fontWeight: 700,
                    color: '#f1eae2',
                    lineHeight: 1,
                  }}>
                    {String(value).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: '10px', color: '#b8bfc8', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
            {timeLeft.days <= 3 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                justifyContent: 'center',
                marginTop: '8px',
                color: '#dc2626',
                fontSize: '12px',
                fontWeight: 600,
              }}>
                <AlertTriangle style={{ width: '14px', height: '14px' }} />
                {timeLeft.days === 0 ? 'Último dia!' : `Faltam apenas ${timeLeft.days} dias!`}
              </div>
            )}
          </div>
        )}

        {/* Expired badge */}
        {expired && (
          <div style={{
            background: 'rgba(220,38,38,0.1)',
            border: '1px solid rgba(220,38,38,0.3)',
            borderRadius: '8px',
            padding: '12px 20px',
            color: '#dc2626',
            fontSize: '13px',
            fontWeight: 600,
            textAlign: 'center',
          }}>
            ⚠️ Prazo encerrado — Entre em contato para verificar possibilidades
          </div>
        )}

        {/* Separator */}
        {endDate && timeLeft && leadCount > 0 && (
          <div style={{ width: '1px', height: '48px', background: 'rgba(255,255,255,0.1)' }} />
        )}

        {/* Social proof counter */}
        {leadCount > 0 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', marginBottom: '8px' }}>
              <Users style={{ width: '16px', height: '16px', color: '#25D366' }} />
              <span style={{ color: '#25D366', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
                Já atendemos
              </span>
            </div>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '36px',
              fontWeight: 700,
              color: '#f1eae2',
              lineHeight: 1,
            }}>
              {leadCount}+
            </div>
            <div style={{ fontSize: '12px', color: '#b8bfc8', marginTop: '4px' }}>
              pessoas com este problema
            </div>
          </div>
        )}
      </div>

      {/* Limited time benefit badge */}
      {endDate && timeLeft && !expired && timeLeft.days <= 14 && (
        <div style={{
          marginTop: '16px',
          textAlign: 'center',
          background: `${accentColor}15`,
          border: `1px solid ${accentColor}30`,
          borderRadius: '6px',
          padding: '10px 16px',
        }}>
          <span style={{ color: accentColor, fontSize: '13px', fontWeight: 600 }}>
            🎁 Análise gratuita até {new Date(endDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
          </span>
        </div>
      )}
    </div>
  )
}

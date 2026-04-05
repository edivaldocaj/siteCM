'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Lock, Download, ChevronDown, Copy, Check, ArrowLeft, Image, Smartphone, RefreshCw } from 'lucide-react'

/* ── Templates ── */
const TEMPLATES: Record<string, { label: string; desc: string; bg: string; accent: string; text: string; subtext: string; tagBg: string; tagText: string; ctaBg: string; ctaText: string }> = {
  editorial: { label: 'Editorial', desc: 'Sóbrio institucional', bg: 'linear-gradient(145deg, #152138, #1c2d4a, #0e1628)', accent: '#c4a96a', text: '#f1eae2', subtext: 'rgba(184,191,200,0.7)', tagBg: 'rgba(196,169,106,0.15)', tagText: '#c4a96a', ctaBg: '#c4a96a', ctaText: '#152138' },
  urgency: { label: 'Urgência', desc: 'Vermelho impactante', bg: 'linear-gradient(145deg, #1a0505, #3b0a0a, #1a0505)', accent: '#ef4444', text: '#fef2f2', subtext: 'rgba(254,242,242,0.7)', tagBg: 'rgba(239,68,68,0.2)', tagText: '#fca5a5', ctaBg: '#ef4444', ctaText: '#fff' },
  educativo: { label: 'Educativo', desc: 'Azul confiável', bg: 'linear-gradient(145deg, #0c1929, #152138, #1e3a5f)', accent: '#60a5fa', text: '#e0f2fe', subtext: 'rgba(186,230,253,0.7)', tagBg: 'rgba(96,165,250,0.15)', tagText: '#93c5fd', ctaBg: '#60a5fa', ctaText: '#0c1929' },
  clean: { label: 'Clean', desc: 'Fundo claro elegante', bg: 'linear-gradient(145deg, #faf8f5, #f1eae2, #faf8f5)', accent: '#152138', text: '#152138', subtext: 'rgba(21,33,56,0.6)', tagBg: 'rgba(21,33,56,0.08)', tagText: '#152138', ctaBg: '#152138', ctaText: '#f1eae2' },
}

const CATEGORIES: Record<string, string> = {
  consumidor: 'Consumidor / Cível',
  digital: 'Digital / LGPD',
  criminal: 'Criminal',
  imobiliario: 'Imobiliário',
  tributario: 'Tributário',
}

const FORMATS = {
  feed: { w: 1080, h: 1080, label: 'Feed (1080×1080)', icon: Image },
  story: { w: 1080, h: 1920, label: 'Story (1080×1920)', icon: Smartphone },
}

type Campaign = {
  id: number; title: string; slug: string; category: string;
  subtitle: string; socialCaption: string; socialHashtags: string[];
  colorAccent: string; targetAudience: string; urgencyText: string;
}

export default function CardGeneratorPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [title, setTitle] = useState('Fraudes Bancárias')
  const [subtitle, setSubtitle] = useState('Cobranças abusivas? Você pode ter direito a restituição em dobro.')
  const [category, setCategory] = useState('consumidor')
  const [cta, setCta] = useState('Verifique seu caso gratuitamente')
  const [template, setTemplate] = useState('editorial')
  const [format, setFormat] = useState<'feed' | 'story'>('feed')
  const [exporting, setExporting] = useState(false)
  const [captionCopied, setCaptionCopied] = useState(false)
  const [currentCaption, setCurrentCaption] = useState('')
  const [currentHashtags, setCurrentHashtags] = useState<string[]>([])
  const canvasRef = useRef<HTMLDivElement>(null)

  const t = TEMPLATES[template]
  const fmt = FORMATS[format]

  // Carregar campanhas do CMS
  async function loadCampaigns() {
    try {
      const res = await fetch('/api/campaigns-list')
      const data = await res.json()
      setCampaigns(data.campaigns || [])
    } catch { /* silently fail */ }
  }

  useEffect(() => {
    if (authenticated) loadCampaigns()
  }, [authenticated])

  // Selecionar campanha
  function selectCampaign(id: number) {
    const c = campaigns.find(x => x.id === id)
    if (!c) return
    setSelectedId(id)
    setTitle(c.title)
    setSubtitle(c.subtitle)
    setCategory(c.category)
    setCurrentCaption(c.socialCaption)
    setCurrentHashtags(c.socialHashtags || [])
    // Escolher template baseado na cor
    if (c.colorAccent === 'red') setTemplate('urgency')
    else if (c.colorAccent === 'blue') setTemplate('educativo')
    else setTemplate('editorial')
  }

  // Exportar PNG
  async function exportPNG() {
    setExporting(true)
    try {
      const el = canvasRef.current
      if (!el) return
      // Usar canvas API diretamente
      const canvas = document.createElement('canvas')
      canvas.width = fmt.w
      canvas.height = fmt.h
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Desenhar fundo
      ctx.fillStyle = '#152138'
      ctx.fillRect(0, 0, fmt.w, fmt.h)

      // Usar html2canvas como fallback via screenshot do DOM
      const html2canvas = (await import('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.esm.js')).default
      const rendered = await html2canvas(el, { width: fmt.w, height: fmt.h, scale: 1, useCORS: true, backgroundColor: null })
      const link = document.createElement('a')
      link.download = `cm-${title.toLowerCase().replace(/\s+/g, '-')}-${format}.png`
      link.href = rendered.toDataURL('image/png')
      link.click()
    } catch {
      alert('Erro ao exportar. Tente tirar um screenshot manualmente.')
    }
    setExporting(false)
  }

  // Copiar legenda
  async function copyCaption() {
    const text = currentCaption + (currentHashtags.length > 0 ? '\n\n' + currentHashtags.join(' ') : '')
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const input = document.createElement('textarea')
      input.value = text
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }
    setCaptionCopied(true)
    setTimeout(() => setCaptionCopied(false), 2500)
  }

  /* ── LOGIN ── */
  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#152138' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '48px', maxWidth: '400px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Lock style={{ width: '48px', height: '48px', color: '#c4a96a', margin: '0 auto 16px' }} />
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#f1eae2', marginBottom: '8px' }}>Gerador de Cards</h1>
            <p style={{ color: '#b8bfc8', fontSize: '14px' }}>Acesso restrito</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setAuthenticated(true) }}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Secret key" required
              style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#f1eae2', fontSize: '14px', marginBottom: '16px', outline: 'none', boxSizing: 'border-box' }} />
            <button type="submit" style={{ width: '100%', padding: '12px', background: '#c4a96a', color: '#152138', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Acessar
            </button>
          </form>
        </div>
      </div>
    )
  }

  /* ── INTERFACE PRINCIPAL ── */
  return (
    <div style={{ minHeight: '100vh', background: '#152138', color: '#f1eae2', fontFamily: "'Source Sans 3', sans-serif" }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <a href="/admin-tools" style={{ color: '#b8bfc8', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ArrowLeft style={{ width: '14px', height: '14px' }} /> Admin Tools
              </a>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', margin: 0 }}>Gerador de Cards para Redes Sociais</h1>
            <p style={{ color: '#b8bfc8', fontSize: '14px', marginTop: '4px' }}>Selecione uma campanha do CMS ou crie um card personalizado.</p>
          </div>
          <button onClick={loadCampaigns} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#b8bfc8', fontSize: '12px', cursor: 'pointer' }}>
            <RefreshCw style={{ width: '14px', height: '14px' }} /> Atualizar campanhas
          </button>
        </div>

        {/* Seletor de campanhas do CMS */}
        {campaigns.length > 0 && (
          <div style={{ marginBottom: '32px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '20px' }}>
            <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#c4a96a', marginBottom: '12px', marginTop: 0 }}>Campanhas do CMS ({campaigns.length})</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {campaigns.map(c => (
                <button key={c.id} onClick={() => selectCampaign(c.id)}
                  style={{
                    padding: '8px 16px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer',
                    background: selectedId === c.id ? 'rgba(196,169,106,0.2)' : 'rgba(255,255,255,0.05)',
                    border: selectedId === c.id ? '1px solid #c4a96a' : '1px solid rgba(255,255,255,0.08)',
                    color: selectedId === c.id ? '#c4a96a' : '#b8bfc8',
                    transition: 'all 0.2s',
                  }}>
                  {c.title}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>

          {/* ── CONTROLES ── */}
          <div style={{ flex: '1 1 340px', minWidth: '300px' }}>

            {/* Formato */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(184,191,200,0.5)', marginBottom: '8px', fontWeight: 600 }}>Formato</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(Object.entries(FORMATS) as [string, typeof FORMATS.feed][]).map(([key, val]) => (
                  <button key={key} onClick={() => setFormat(key as 'feed' | 'story')}
                    style={{
                      flex: 1, padding: '12px', borderRadius: '6px', cursor: 'pointer', textAlign: 'center',
                      border: format === key ? '2px solid #c4a96a' : '2px solid rgba(255,255,255,0.08)',
                      background: format === key ? 'rgba(196,169,106,0.1)' : 'rgba(255,255,255,0.03)',
                      color: format === key ? '#c4a96a' : '#b8bfc8', transition: 'all 0.2s',
                    }}>
                    <val.icon style={{ width: '20px', height: '20px', margin: '0 auto 4px', display: 'block' }} />
                    <div style={{ fontSize: '12px', fontWeight: 600 }}>{val.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Template */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(184,191,200,0.5)', marginBottom: '8px', fontWeight: 600 }}>Template</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {Object.entries(TEMPLATES).map(([key, val]) => (
                  <button key={key} onClick={() => setTemplate(key)}
                    style={{
                      padding: '12px', borderRadius: '6px', cursor: 'pointer', textAlign: 'center',
                      border: template === key ? `2px solid ${val.accent}` : '2px solid rgba(255,255,255,0.08)',
                      background: template === key ? val.tagBg : 'rgba(255,255,255,0.03)',
                      color: template === key ? val.accent : '#b8bfc8', transition: 'all 0.2s',
                    }}>
                    <div style={{ fontSize: '13px', fontWeight: 700 }}>{val.label}</div>
                    <div style={{ fontSize: '10px', opacity: 0.6, marginTop: '2px' }}>{val.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Categoria */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(184,191,200,0.5)', marginBottom: '8px', fontWeight: 600 }}>Categoria</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.12)', fontSize: '14px', background: 'rgba(255,255,255,0.05)', color: '#f1eae2', boxSizing: 'border-box' }}>
                {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>

            {/* Título */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(184,191,200,0.5)', marginBottom: '8px', fontWeight: 600 }}>Título</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.12)', fontSize: '16px', fontWeight: 600, color: '#f1eae2', background: 'rgba(255,255,255,0.05)', boxSizing: 'border-box' }} />
            </div>

            {/* Subtítulo */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(184,191,200,0.5)', marginBottom: '8px', fontWeight: 600 }}>Subtítulo</label>
              <textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} rows={3}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.12)', fontSize: '14px', color: '#f1eae2', background: 'rgba(255,255,255,0.05)', resize: 'none', boxSizing: 'border-box' }} />
            </div>

            {/* CTA */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(184,191,200,0.5)', marginBottom: '8px', fontWeight: 600 }}>CTA</label>
              <input value={cta} onChange={(e) => setCta(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.12)', fontSize: '14px', color: '#f1eae2', background: 'rgba(255,255,255,0.05)', boxSizing: 'border-box' }} />
            </div>

            {/* Botão exportar */}
            <button onClick={exportPNG} disabled={exporting}
              style={{
                width: '100%', padding: '16px', borderRadius: '4px', border: 'none',
                background: exporting ? 'rgba(196,169,106,0.3)' : '#c4a96a',
                color: '#152138', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.08em', cursor: exporting ? 'wait' : 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}>
              <Download style={{ width: '16px', height: '16px' }} />
              {exporting ? 'Gerando...' : `Baixar PNG ${fmt.label}`}
            </button>

            {/* Copiar legenda */}
            {currentCaption && (
              <div style={{ marginTop: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#c4a96a', margin: 0 }}>Legenda para Instagram</h3>
                  <button onClick={copyCaption}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px',
                      borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                      background: captionCopied ? 'rgba(37,211,102,0.15)' : 'rgba(255,255,255,0.05)',
                      border: captionCopied ? '1px solid #25D366' : '1px solid rgba(255,255,255,0.1)',
                      color: captionCopied ? '#25D366' : '#b8bfc8', textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>
                    {captionCopied ? <Check style={{ width: '12px', height: '12px' }} /> : <Copy style={{ width: '12px', height: '12px' }} />}
                    {captionCopied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
                <p style={{ color: '#b8bfc8', fontSize: '13px', lineHeight: 1.6, whiteSpace: 'pre-line', margin: 0 }}>
                  {currentCaption}
                </p>
                {currentHashtags.length > 0 && (
                  <p style={{ color: '#c4a96a', fontSize: '12px', marginTop: '12px' }}>
                    {currentHashtags.join(' ')}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ── PREVIEW ── */}
          <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: format === 'story' ? 360 : 540 }}>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(184,191,200,0.5)', marginBottom: '10px', fontWeight: 600, textAlign: 'center' }}>
                Preview
              </label>

              <div style={{
                width: '100%',
                aspectRatio: `${fmt.w}/${fmt.h}`,
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
              }}>
                <div
                  ref={canvasRef}
                  style={{
                    width: fmt.w,
                    height: fmt.h,
                    transform: `scale(${format === 'story' ? 0.333 : 0.5})`,
                    transformOrigin: 'top left',
                    position: 'absolute',
                    top: 0, left: 0,
                    background: t.bg,
                    overflow: 'hidden',
                  }}
                >
                  {/* Pattern */}
                  <div style={{
                    position: 'absolute', inset: 0, opacity: 0.04,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px',
                  }} />

                  {/* CM watermark */}
                  <div style={{ position: 'absolute', bottom: format === 'story' ? -40 : -80, right: -40, opacity: 0.04 }}>
                    <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: format === 'story' ? 400 : 500, fontWeight: 'bold', color: t.accent }}>&nbsp;CM</span>
                  </div>

                  {/* Top line */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: t.accent }} />

                  {/* Content */}
                  <div style={{
                    position: 'relative', zIndex: 10,
                    padding: format === 'story' ? '80px 56px' : '80px 72px',
                    height: '100%',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    boxSizing: 'border-box',
                  }}>
                    {/* Tag */}
                    <div>
                      <span style={{
                        display: 'inline-block', padding: '10px 20px',
                        background: t.tagBg, color: t.tagText,
                        fontSize: 18, fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: '0.15em', borderRadius: 3,
                        fontFamily: "'Source Sans 3', sans-serif",
                      }}>
                        {CATEGORIES[category] || category}
                      </span>
                    </div>

                    {/* Title + Subtitle */}
                    <div>
                      <h2 style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: title.length > 30 ? (format === 'story' ? 56 : 64) : (format === 'story' ? 68 : 80),
                        fontWeight: 700, color: t.text, lineHeight: 1.1,
                        marginBottom: 28, letterSpacing: '-0.02em',
                      }}>
                        {title}
                      </h2>
                      <p style={{
                        color: t.subtext, fontSize: format === 'story' ? 24 : 28,
                        lineHeight: 1.5, fontFamily: "'Source Sans 3', sans-serif",
                        fontWeight: 300, maxWidth: 800,
                      }}>
                        {subtitle}
                      </p>
                    </div>

                    {/* Bottom */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: format === 'story' ? 'center' : 'flex-end', flexDirection: format === 'story' ? 'column' : 'row', gap: format === 'story' ? '24px' : '0' }}>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 12,
                        padding: '18px 32px', background: t.ctaBg, color: t.ctaText,
                        borderRadius: 4, fontSize: 18, fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                        fontFamily: "'Source Sans 3', sans-serif",
                      }}>
                        {cta}
                      </div>

                      <div style={{ textAlign: format === 'story' ? 'center' : 'right' }}>
                        <div style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: 22, fontWeight: 700, color: t.accent,
                          letterSpacing: '0.05em',
                        }}>
                          CAVALCANTE & MELO
                        </div>
                        <div style={{
                          color: t.subtext, fontSize: 14,
                          fontFamily: "'Source Sans 3', sans-serif",
                          letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4,
                        }}>
                          Sociedade de Advogados
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

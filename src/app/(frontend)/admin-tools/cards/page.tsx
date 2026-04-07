'use client'

import { useState, useEffect, useRef } from 'react'
import { Lock, Download, Copy, Check, ArrowLeft, Image, Smartphone, RefreshCw } from 'lucide-react'

const TEMPLATES: Record<string, { label: string; desc: string; bgStart: string; bgEnd: string; accent: string; text: string; subtext: string; tagBg: string; tagText: string; ctaBg: string; ctaText: string }> = {
  editorial: { label: 'Editorial', desc: 'Sóbrio institucional', bgStart: '#152138', bgEnd: '#1c2d4a', accent: '#c4a96a', text: '#f1eae2', subtext: '#8b919a', tagBg: 'rgba(196,169,106,0.2)', tagText: '#c4a96a', ctaBg: '#c4a96a', ctaText: '#152138' },
  urgency: { label: 'Urgência', desc: 'Vermelho impactante', bgStart: '#1a0505', bgEnd: '#3b0a0a', accent: '#ef4444', text: '#fef2f2', subtext: '#d4a0a0', tagBg: 'rgba(239,68,68,0.25)', tagText: '#fca5a5', ctaBg: '#ef4444', ctaText: '#ffffff' },
  educativo: { label: 'Educativo', desc: 'Azul confiável', bgStart: '#0c1929', bgEnd: '#1e3a5f', accent: '#60a5fa', text: '#e0f2fe', subtext: '#7ba4c4', tagBg: 'rgba(96,165,250,0.2)', tagText: '#93c5fd', ctaBg: '#60a5fa', ctaText: '#0c1929' },
  clean: { label: 'Clean', desc: 'Fundo claro elegante', bgStart: '#faf8f5', bgEnd: '#f1eae2', accent: '#152138', text: '#152138', subtext: '#6b7280', tagBg: 'rgba(21,33,56,0.1)', tagText: '#152138', ctaBg: '#152138', ctaText: '#f1eae2' },
}

const CATEGORIES: Record<string, string> = { consumidor: 'Consumidor / Cível', digital: 'Digital / LGPD', criminal: 'Criminal', imobiliario: 'Imobiliário', tributario: 'Tributário' }

const FORMATS = {
  feed: { w: 1080, h: 1080, label: 'Feed (1080×1080)', icon: Image },
  story: { w: 1080, h: 1920, label: 'Story (1080×1920)', icon: Smartphone },
}

type Campaign = { id: number; title: string; slug: string; category: string; subtitle: string; socialCaption: string; socialHashtags: string[]; colorAccent: string }

/* ── Canvas text wrapping helper ── */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const test = current ? `${current} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  return lines
}

/* ── Draw card on Canvas ── */
async function drawCard(
  canvas: HTMLCanvasElement,
  opts: { w: number; h: number; title: string; subtitle: string; category: string; cta: string; template: string }
) {
  const { w, h, title, subtitle, category, cta, template: tplKey } = opts
  const t = TEMPLATES[tplKey] || TEMPLATES.editorial
  const isStory = h > w
  const ctx = canvas.getContext('2d')!
  canvas.width = w
  canvas.height = h

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, w * 0.5, h)
  grad.addColorStop(0, t.bgStart)
  grad.addColorStop(1, t.bgEnd)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  // Diamond pattern (subtle)
  ctx.strokeStyle = t.accent
  ctx.globalAlpha = 0.04
  ctx.lineWidth = 0.5
  for (let x = 0; x < w; x += 60) {
    for (let y = 0; y < h; y += 60) {
      ctx.beginPath()
      ctx.moveTo(x + 30, y)
      ctx.lineTo(x + 60, y + 30)
      ctx.lineTo(x + 30, y + 60)
      ctx.lineTo(x, y + 30)
      ctx.closePath()
      ctx.stroke()
    }
  }
  ctx.globalAlpha = 1

  // Top accent line
  ctx.fillStyle = t.accent
  ctx.fillRect(0, 0, w, 6)

  // CM watermark
  ctx.globalAlpha = 0.04
  ctx.fillStyle = t.accent
  ctx.font = `bold ${isStory ? 400 : 500}px Georgia`
  ctx.textAlign = 'right'
  ctx.fillText('CM', w + 20, h - (isStory ? 40 : 80))
  ctx.globalAlpha = 1

  const px = isStory ? 56 : 72
  const contentW = w - px * 2

  // Category tag
  const catLabel = (CATEGORIES[category] || category).toUpperCase()
  ctx.font = `bold 18px sans-serif`
  const catMetrics = ctx.measureText(catLabel)
  const catW = catMetrics.width + 40
  const catH = 38
  const catY = isStory ? 80 : 80

  // Tag background (rounded rect)
  ctx.fillStyle = t.tagBg
  ctx.beginPath()
  ctx.roundRect(px, catY, catW, catH, 3)
  ctx.fill()

  // Tag text
  ctx.fillStyle = t.tagText
  ctx.font = `bold 18px sans-serif`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(catLabel, px + 20, catY + catH / 2)

  // Title — large, wrapped
  const titleSize = title.length > 30 ? (isStory ? 56 : 64) : (isStory ? 68 : 80)
  ctx.font = `bold ${titleSize}px Georgia`
  ctx.fillStyle = t.text
  ctx.textBaseline = 'top'
  const titleLines = wrapText(ctx, title, contentW)
  const titleY = isStory ? h * 0.35 : h * 0.32
  titleLines.forEach((line, i) => {
    ctx.fillText(line, px, titleY + i * (titleSize * 1.15))
  })

  // Subtitle — below title
  const subY = titleY + titleLines.length * (titleSize * 1.15) + 28
  const subSize = isStory ? 24 : 28
  ctx.font = `300 ${subSize}px sans-serif`
  ctx.fillStyle = t.subtext
  const subLines = wrapText(ctx, subtitle, contentW)
  subLines.forEach((line, i) => {
    ctx.fillText(line, px, subY + i * (subSize * 1.5))
  })

  // CTA button
  const ctaY = h - (isStory ? 220 : 150)
  ctx.font = `bold 18px sans-serif`
  const ctaMetrics = ctx.measureText(cta.toUpperCase())
  const ctaW = ctaMetrics.width + 64
  const ctaH = 54

  ctx.fillStyle = t.ctaBg
  ctx.beginPath()
  ctx.roundRect(px, ctaY, ctaW, ctaH, 4)
  ctx.fill()

  ctx.fillStyle = t.ctaText
  ctx.textBaseline = 'middle'
  ctx.fillText(cta.toUpperCase(), px + 32, ctaY + ctaH / 2)

  // Brand footer
  const footY = h - (isStory ? 120 : 60)
  ctx.textAlign = isStory ? 'center' : 'right'
  ctx.font = `bold 22px Georgia`
  ctx.fillStyle = t.accent
  ctx.textBaseline = 'bottom'
  ctx.fillText('CAVALCANTE & MELO', isStory ? w / 2 : w - px, footY)

  ctx.font = `400 14px sans-serif`
  ctx.fillStyle = t.subtext
  ctx.fillText('SOCIEDADE DE ADVOGADOS', isStory ? w / 2 : w - px, footY + 22)

  ctx.textAlign = 'left'
}

export default function CardGeneratorPage() {
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
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)

  const t = TEMPLATES[template]
  const fmt = FORMATS[format]

  async function loadCampaigns() {
    try {
      const res = await fetch('/api/campaigns-list')
      const data = await res.json()
      setCampaigns(data.campaigns || [])
    } catch { }
  }

  useEffect(() => { loadCampaigns() }, [])

  // Redraw preview whenever inputs change
  useEffect(() => {
    if (!previewCanvasRef.current) return
    drawCard(previewCanvasRef.current, { w: fmt.w, h: fmt.h, title, subtitle, category, cta, template })
  }, [title, subtitle, category, cta, template, format])

  function selectCampaign(id: number) {
    const c = campaigns.find(x => x.id === id)
    if (!c) return
    setSelectedId(id)
    setTitle(c.title)
    setSubtitle(c.subtitle)
    setCategory(c.category)
    setCurrentCaption(c.socialCaption)
    setCurrentHashtags(c.socialHashtags || [])
    if (c.colorAccent === 'red') setTemplate('urgency')
    else if (c.colorAccent === 'blue') setTemplate('educativo')
    else setTemplate('editorial')
  }

  async function exportPNG() {
    setExporting(true)
    try {
      const canvas = document.createElement('canvas')
      await drawCard(canvas, { w: fmt.w, h: fmt.h, title, subtitle, category, cta, template })
      const link = document.createElement('a')
      link.download = `cm-${title.toLowerCase().replace(/\s+/g, '-')}-${format}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch {
      alert('Erro ao exportar.')
    }
    setExporting(false)
  }

  async function copyCaption() {
    const text = currentCaption + (currentHashtags.length > 0 ? '\n\n' + currentHashtags.join(' ') : '')
    try { await navigator.clipboard.writeText(text) } catch {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta)
    }
    setCaptionCopied(true)
    setTimeout(() => setCaptionCopied(false), 2500)
  }

  const previewScale = format === 'story' ? 0.28 : 0.45

  return (
    <div style={{ minHeight: '100vh', background: '#152138', color: '#f1eae2', fontFamily: "'Source Sans 3', sans-serif" }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <a href="/admin-tools" style={{ color: '#b8bfc8', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
              <ArrowLeft style={{ width: '14px', height: '14px' }} /> Admin Tools
            </a>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', margin: 0 }}>Gerador de Cards para Redes Sociais</h1>
            <p style={{ color: '#b8bfc8', fontSize: '14px', marginTop: '4px' }}>Agora com Canvas nativo — texto renderizado pixel a pixel.</p>
          </div>
          <button onClick={loadCampaigns} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#b8bfc8', fontSize: '12px', cursor: 'pointer' }}>
            <RefreshCw style={{ width: '14px', height: '14px' }} /> Atualizar campanhas
          </button>
        </div>

        {/* Campaign selector */}
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
                    color: selectedId === c.id ? '#c4a96a' : '#b8bfc8', transition: 'all 0.2s',
                  }}>
                  {c.title}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>

          {/* Controls */}
          <div style={{ flex: '1 1 340px', minWidth: '300px' }}>

            {/* Format */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(184,191,200,0.5)', marginBottom: '8px', fontWeight: 600 }}>Formato</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(Object.entries(FORMATS) as [string, typeof FORMATS.feed][]).map(([key, val]) => (
                  <button key={key} onClick={() => setFormat(key as 'feed' | 'story')}
                    style={{
                      flex: 1, padding: '12px', borderRadius: '6px', cursor: 'pointer', textAlign: 'center',
                      border: format === key ? '2px solid #c4a96a' : '2px solid rgba(255,255,255,0.08)',
                      background: format === key ? 'rgba(196,169,106,0.1)' : 'rgba(255,255,255,0.03)',
                      color: format === key ? '#c4a96a' : '#b8bfc8',
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
                      color: template === key ? val.accent : '#b8bfc8',
                    }}>
                    <div style={{ fontSize: '13px', fontWeight: 700 }}>{val.label}</div>
                    <div style={{ fontSize: '10px', opacity: 0.6, marginTop: '2px' }}>{val.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(184,191,200,0.5)', marginBottom: '8px', fontWeight: 600 }}>Categoria</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.12)', fontSize: '14px', background: 'rgba(255,255,255,0.05)', color: '#f1eae2', boxSizing: 'border-box' }}>
                {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>

            {/* Title */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(184,191,200,0.5)', marginBottom: '8px', fontWeight: 600 }}>Título</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.12)', fontSize: '16px', fontWeight: 600, color: '#f1eae2', background: 'rgba(255,255,255,0.05)', boxSizing: 'border-box' }} />
            </div>

            {/* Subtitle */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(184,191,200,0.5)', marginBottom: '8px', fontWeight: 600 }}>Subtítulo</label>
              <textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} rows={3}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.12)', fontSize: '14px', color: '#f1eae2', background: 'rgba(255,255,255,0.05)', resize: 'none', boxSizing: 'border-box', fontFamily: "'Source Sans 3', sans-serif" }} />
            </div>

            {/* CTA */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(184,191,200,0.5)', marginBottom: '8px', fontWeight: 600 }}>CTA</label>
              <input value={cta} onChange={(e) => setCta(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.12)', fontSize: '14px', color: '#f1eae2', background: 'rgba(255,255,255,0.05)', boxSizing: 'border-box' }} />
            </div>

            {/* Export button */}
            <button onClick={exportPNG} disabled={exporting}
              style={{
                width: '100%', padding: '16px', borderRadius: '4px', border: 'none',
                background: exporting ? 'rgba(196,169,106,0.3)' : '#c4a96a',
                color: '#152138', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.08em', cursor: exporting ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}>
              <Download style={{ width: '16px', height: '16px' }} />
              {exporting ? 'Gerando...' : `Baixar PNG ${fmt.label}`}
            </button>

            {/* Caption */}
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
                  <p style={{ color: '#c4a96a', fontSize: '12px', marginTop: '12px' }}>{currentHashtags.join(' ')}</p>
                )}
              </div>
            )}
          </div>

          {/* Preview */}
          <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: format === 'story' ? 360 : 540 }}>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(184,191,200,0.5)', marginBottom: '10px', fontWeight: 600, textAlign: 'center' }}>
                Preview (Canvas nativo — idêntico ao PNG exportado)
              </label>
              <div style={{
                width: '100%',
                aspectRatio: `${fmt.w}/${fmt.h}`,
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
              }}>
                <canvas
                  ref={previewCanvasRef}
                  style={{ width: '100%', height: '100%', display: 'block' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

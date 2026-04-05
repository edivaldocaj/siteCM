'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'

interface CampaignVideoHeroProps {
  videoUrl?: string | null       // YouTube/Vimeo URL
  videoFileUrl?: string | null   // Upload direto MP4
  heroImageUrl?: string | null   // Thumbnail fallback
}

function getEmbedUrl(url: string): string | null {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`

  // Vimeo
  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&title=0&byline=0`

  return null
}

export function CampaignVideoHero({ videoUrl, videoFileUrl, heroImageUrl }: CampaignVideoHeroProps) {
  const [playing, setPlaying] = useState(false)

  // Vídeo upload direto → autoplay muted
  if (videoFileUrl) {
    return (
      <div style={{
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
        aspectRatio: '16/9',
        background: '#0e1628',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={heroImageUrl || undefined}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        >
          <source src={videoFileUrl} type="video/mp4" />
        </video>
        {/* Overlay gradiente sutil no fundo */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '40%',
          background: 'linear-gradient(transparent, rgba(14,22,40,0.6))',
          pointerEvents: 'none',
        }} />
      </div>
    )
  }

  // Embed YouTube/Vimeo
  if (videoUrl) {
    const embedSrc = getEmbedUrl(videoUrl)

    if (!playing) {
      return (
        <div
          onClick={() => setPlaying(true)}
          style={{
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'relative',
            aspectRatio: '16/9',
            background: '#0e1628',
            cursor: 'pointer',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}
        >
          {/* Thumbnail */}
          {heroImageUrl ? (
            <img
              src={heroImageUrl}
              alt="Video thumbnail"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, #152138, #1c2d4a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: 'rgba(184,191,200,0.1)', fontFamily: "'Playfair Display', serif", fontSize: '120px', fontWeight: 'bold' }}>CM</span>
            </div>
          )}

          {/* Play button overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: '80px', height: '80px',
              borderRadius: '50%',
              background: 'rgba(196,169,106,0.9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform 0.3s',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }} className="play-btn">
              <Play style={{ width: '32px', height: '32px', color: '#152138', marginLeft: '4px' }} fill="#152138" />
            </div>
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            .play-btn:hover { transform: scale(1.1); }
          `}} />
        </div>
      )
    }

    // Playing → show embed
    return (
      <div style={{
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
        aspectRatio: '16/9',
        background: '#000',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}>
        <iframe
          src={embedSrc || videoUrl}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return null
}

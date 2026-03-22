'use client'
// components/NcmLiteWidget.tsx
// Compact collector network widget for artist profile pages.
// Shows a single collection's holders as a radial dot map.
// Fetches data live via /api/artists/[slug]/ncm-lite.
// Artists with a full NCM get the full map instead — this only shows for lite tier.

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import type { Artist } from '@/types'

interface LiteData {
  contract: string
  name: string
  holderCount: number
  totalSupply: string | null
  tokenType: string
  otherCount: number
}

interface NcmLiteWidgetProps {
  artist: Artist
}

// seeded rand
function mkRng(seed: number) {
  let s = seed
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
}

function hex2rgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ]
}

const ACCENT = '#C8A96E'  // The Line tan — matches site accent

export function NcmLiteWidget({ artist }: NcmLiteWidgetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef   = useRef<number>(0)
  const [data, setData]       = useState<LiteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dots, setDots]       = useState<Array<{ x: number; y: number; r: number }>>([])

  // Fetch lite data
  useEffect(() => {
    fetch(`/api/artists/${artist.slug}/ncm-lite`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [artist.slug])

  // Build dot positions when data arrives
  useEffect(() => {
    if (!data || !canvasRef.current) return
    const canvas = canvasRef.current
    const W = canvas.offsetWidth, H = canvas.offsetHeight
    const rng   = mkRng(0xC0DE1234)
    const count = Math.min(data.holderCount, 200)  // cap at 200 dots for perf
    const cx    = W / 2, cy = H / 2
    const maxR  = Math.min(W, H) * 0.42

    const newDots = Array.from({ length: count }, (_, i) => {
      // Spiral layout — denser near centre
      const t  = i / count
      const r  = maxR * Math.pow(t, 0.6) * (0.7 + rng() * 0.3)
      const a  = i * 2.4 + rng() * 0.3  // golden angle
      return {
        x: cx + Math.cos(a) * r,
        y: cy + Math.sin(a) * r,
        r: 1.5 + rng() * 2,
      }
    })
    setDots(newDots)
  }, [data])

  // Canvas draw loop
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width, H = canvas.height
    const cx = W / 2, cy = H / 2

    ctx.clearRect(0, 0, W, H)

    const [ar, ag, ab] = hex2rgb(ACCENT)
    const tk = Date.now() / 1000

    // Center pulse
    const pulse = 0.88 + Math.sin(tk * 1.6) * 0.12
    ;[44, 32, 22].forEach((r, i) => {
      ctx.beginPath()
      ctx.arc(cx, cy, r * pulse, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${ar},${ag},${ab},${[0.04, 0.08, 0.16][i]})`
      ctx.lineWidth = 0.5
      ctx.stroke()
    })
    ctx.beginPath()
    ctx.arc(cx, cy, 18, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(10,10,10,0.98)'
    ctx.fill()
    ctx.strokeStyle = `rgba(${ar},${ag},${ab},0.6)`
    ctx.lineWidth = 0.8
    ctx.stroke()

    // Dots + edges
    dots.forEach((d, i) => {
      const t = i / Math.max(dots.length - 1, 1)
      const alpha = 0.15 + t * 0.25

      // Edge from centre
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(d.x, d.y)
      ctx.strokeStyle = `rgba(${ar},${ag},${ab},${alpha * 0.3})`
      ctx.lineWidth = 0.3
      ctx.stroke()

      // Dot
      ctx.beginPath()
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
      ctx.fillStyle   = `rgba(${ar},${ag},${ab},${alpha})`
      ctx.fill()
      ctx.strokeStyle = `rgba(${ar},${ag},${ab},${alpha + 0.3})`
      ctx.lineWidth   = 0.4
      ctx.stroke()
    })

    // Vignette
    const grad = ctx.createRadialGradient(cx, cy, Math.min(W,H)*0.3, cx, cy, Math.min(W,H)*0.7)
    grad.addColorStop(0, 'transparent')
    grad.addColorStop(1, 'rgba(10,10,10,0.7)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)
  }, [dots])

  // RAF loop
  useEffect(() => {
    const loop = () => { draw(); animRef.current = requestAnimationFrame(loop) }
    animRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animRef.current)
  }, [draw])

  // Size canvas on mount
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const set = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    set()
    const ro = new ResizeObserver(set)
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [])

  // Don't render if no data came back (no deployed contracts found)
  if (!loading && !data) return null

  return (
    <div className="border-t border-line-border mt-12 pt-10">
      <div className="flex items-baseline justify-between mb-6">
        <p className="label">Collector Network</p>
        {data && (
          <span className="font-mono text-[9px] text-line-muted tracking-widest uppercase">
            {data.name}
          </span>
        )}
      </div>

      {/* Canvas */}
      <div className="relative w-full bg-[#0a0a0a] border border-line-border" style={{ height: '240px' }}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Loading state */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full animate-pulse" style={{ background: ACCENT }} />
          </div>
        )}

        {/* Stats overlay — bottom */}
        {data && (
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-4 py-3 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 100%)' }}>
            <div>
              <p className="font-display font-light text-2xl text-line-text" style={{ letterSpacing: '-0.02em' }}>
                {data.holderCount.toLocaleString()}
              </p>
              <p className="font-mono text-[9px] text-line-muted tracking-widest uppercase">Collectors</p>
            </div>
            {data.totalSupply && (
              <div className="text-right">
                <p className="font-display font-light text-2xl text-line-text" style={{ letterSpacing: '-0.02em' }}>
                  {parseInt(data.totalSupply).toLocaleString()}
                </p>
                <p className="font-mono text-[9px] text-line-muted tracking-widest uppercase">Works</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upgrade CTA */}
      {data && (
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="font-mono text-[10px] text-line-muted leading-relaxed">
            {data.otherCount > 0
              ? `Showing 1 of ${data.otherCount + 1} collections.`
              : 'Showing primary collection.'}
            {' '}Upgrade to map all collectors across every collection.
          </p>
          <Link
            href="/join#ncm"
            className="font-mono text-[10px] tracking-widest uppercase shrink-0 px-4 py-2 border border-line-border text-line-muted hover:border-line-accent hover:text-line-accent transition-colors"
          >
            Upgrade →
          </Link>
        </div>
      )}
    </div>
  )
}

'use client'
// components/NetworkCollectorsMap.tsx
// Networked Collectors Map — canvas-based network visualisation
// Uses d3-force for layout, direct eth_call for ENS resolution

import { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3-force'
import type { NcmCollection } from '@/types'

// ── Types ─────────────────────────────────────────────────────────────────

interface CollectorRecord {
  addr: string
  holdings: Record<string, number>
  total: number
}

interface NcmProps {
  artistName: string
  accent: string
  collections: NcmCollection[]
  stats: {
    total_collectors: number
    total_pieces: number
    cross_collection: number
  }
  collectorsUrl: string // e.g. "/ncm/apocalypse.collectors.json"
  ensUrl: string        // e.g. "/ncm/apocalypse.ens.json"
}

interface SimNode {
  id: string
  data: CollectorRecord
  x: number
  y: number
  vx: number
  vy: number
  r: number
  cross: boolean
  colId: string  // dominant collection id
}

// ── ENS reverse resolution via server-side proxy ────────────────────────
// Browser can't call Ethereum RPCs directly (CORS). We proxy through
// /api/ens/reverse which runs server-side with no CORS restrictions.
// Batches of 50 addresses per request.

async function resolveEnsBatch(addrs: string[]): Promise<Record<string, string | null>> {
  try {
    const res = await fetch('/api/ens/reverse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addresses: addrs })
    })
    if (!res.ok) return Object.fromEntries(addrs.map(a => [a, null]))
    const json = await res.json()
    return json.results ?? {}
  } catch {
    return Object.fromEntries(addrs.map(a => [a, null]))
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────

function shortAddr(addr: string) {
  return addr.slice(0, 6) + '…' + addr.slice(-4)
}

function hex2rgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ]
}

function collCount(d: CollectorRecord, cols: NcmCollection[]) {
  return cols.filter(c => (d.holdings[c.id] || 0) > 0).length
}

function setPct(d: CollectorRecord, cols: NcmCollection[]) {
  return Math.round(collCount(d, cols) / cols.length * 100)
}

function dominant(d: CollectorRecord, cols: NcmCollection[]) {
  let mx = 0, mid = cols[0]?.id ?? ''
  for (const c of cols) {
    const v = d.holdings[c.id] || 0
    if (v > mx) { mx = v; mid = c.id }
  }
  return mid
}

// seeded deterministic rand
function mkRng(seed: number) {
  let s = seed
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
}

// ── Component ─────────────────────────────────────────────────────────────

export function NetworkCollectorsMap({ artistName, accent, collections, stats, collectorsUrl, ensUrl }: NcmProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef   = useRef<number>(0)
  const simRef    = useRef<d3.Simulation<SimNode, undefined> | null>(null)

  const [collectors, setCollectors]   = useState<CollectorRecord[]>([])
  const [nodes, setNodes]             = useState<SimNode[]>([])
  const [loading, setLoading]         = useState(true)
  const [filter, setFilter]           = useState('all')
  const [hovered, setHovered]         = useState<SimNode | null>(null)
  const [hoveredPos, setHoveredPos]   = useState({ x: 0, y: 0 })
  const [pan, setPan]                 = useState({ x: 0, y: 0 })
  const [scale, setScale]             = useState(1)
  const [ensCache, setEnsCache]       = useState<Record<string, string | null>>({})
  const [ensStatus, setEnsStatus]     = useState<'idle' | 'loading' | 'live'>('idle')
  const [ensCount, setEnsCount]       = useState({ done: 0, total: 0 })

  const panRef      = useRef(pan)
  const scaleRef    = useRef(scale)
  const hovRef      = useRef(hovered)
  const filterRef   = useRef(filter)
  const ensCacheRef = useRef<Record<string, string | null>>({})
  panRef.current    = pan
  scaleRef.current  = scale
  hovRef.current    = hovered
  filterRef.current = filter
  ensCacheRef.current = ensCache  // always mirrors latest state — safe to read anywhere

  const colMap = Object.fromEntries(collections.map(c => [c.id, c]))
  const accentRgb = hex2rgb(accent)

  // ── Load collectors data ──────────────────────────────────────────────
  useEffect(() => {
    fetch(collectorsUrl)
      .then(r => r.json())
      .then((data: CollectorRecord[]) => {
        setCollectors(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [collectorsUrl])

  // ── Build nodes + d3-force simulation ────────────────────────────────
  useEffect(() => {
    if (!collectors.length) return
    const canvas = canvasRef.current
    if (!canvas) return

    const W = canvas.width, H = canvas.height
    const rng = mkRng(0xBEEF4242)

    const cross   = collectors.filter(d => collCount(d, collections) > 1)
    const singles = collectors.filter(d => collCount(d, collections) === 1)

    const innerR = Math.min(W, H) * 0.22
    const outerR = Math.min(W, H) * 0.40

    // Build initial positions
    const simNodes: SimNode[] = []

    cross.forEach((d, i) => {
      const a  = (i / cross.length) * Math.PI * 2 - Math.PI / 2
      const ja = a + (rng() - 0.5) * 0.4
      const jr = innerR + (rng() - 0.5) * innerR * 0.5
      simNodes.push({
        id: d.addr, data: d,
        x: Math.cos(ja) * jr, y: Math.sin(ja) * jr,
        vx: 0, vy: 0,
        r: 5 + Math.min(d.total * 1.0, 20),
        cross: true,
        colId: dominant(d, collections),
      })
    })

    const byCol: Record<string, CollectorRecord[]> = {}
    collections.forEach(c => { byCol[c.id] = [] })
    singles.forEach(d => {
      const dm = dominant(d, collections)
      if (byCol[dm]) byCol[dm].push(d)
    })

    collections.forEach((col, ci) => {
      const grp  = byCol[col.id] || []
      const base = (ci / collections.length) * Math.PI * 2 - Math.PI / 2
      grp.forEach((d, j) => {
        const sp = grp.length > 1 ? ((j / (grp.length - 1)) - 0.5) * 0.68 : 0
        const a  = base + sp
        const jr = outerR + (rng() - 0.5) * outerR * 0.3
        simNodes.push({
          id: d.addr, data: d,
          x: Math.cos(a) * jr, y: Math.sin(a) * jr,
          vx: 0, vy: 0,
          r: 2.5 + Math.min(d.total * 0.5, 8),
          cross: false,
          colId: col.id,
        })
      })
    })

    // d3-force simulation — gentle settling
    if (simRef.current) simRef.current.stop()
    const sim = d3.forceSimulation(simNodes)
      .force('charge', d3.forceManyBody().strength(-8))
      .force('collide', d3.forceCollide<SimNode>().radius(n => n.r + 2).strength(0.4))
      .alpha(0.3)
      .alphaDecay(0.05)
      .on('tick', () => setNodes([...simNodes]))

    simRef.current = sim
    setNodes([...simNodes])

    return () => { sim.stop() }
  }, [collectors, collections])

  // ── Canvas draw ───────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx   = canvas.getContext('2d')
    if (!ctx)   return
    const W = canvas.width, H = canvas.height
    const p = panRef.current, s = scaleRef.current
    const hov = hovRef.current, fil = filterRef.current

    ctx.clearRect(0, 0, W, H)
    ctx.save()
    ctx.translate(W / 2 + p.x, H / 2 + p.y)
    ctx.scale(s, s)

    const isVis = (n: SimNode) =>
      fil === 'all' || (n.data.holdings[fil] || 0) > 0

    // Edges
    nodes.forEach(n => {
      if (!isVis(n)) return
      const col = colMap[n.colId]
      if (!col) return
      const [r, g, b] = hex2rgb(col.color)
      const t     = Math.min(n.data.total / 30, 1)
      const alpha = n.cross ? 0.08 + t * 0.2 : 0.025 + t * 0.065
      const cpx   = n.x * 0.32 + Math.sin(n.x * 0.01) * 38
      const cpy   = n.y * 0.32 + Math.cos(n.y * 0.01) * 38
      ctx.beginPath(); ctx.moveTo(0, 0)
      ctx.quadraticCurveTo(cpx, cpy, n.x, n.y)
      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`
      ctx.lineWidth   = n.cross ? 0.6 + t * 1.3 : 0.25 + t * 0.5
      ctx.stroke()
    })

    // Center node
    const [ar, ag, ab] = accentRgb
    const tk = Date.now() / 1000
    const pulse = 0.88 + Math.sin(tk * 1.9) * 0.12
    ;[90, 68, 50, 34].forEach((r, i) => {
      ctx.beginPath(); ctx.arc(0, 0, r * pulse, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${ar},${ag},${ab},${[0.03, 0.05, 0.09, 0.18][i]})`
      ctx.lineWidth = 0.5; ctx.stroke()
    })
    ctx.beginPath(); ctx.arc(0, 0, 30, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(10,10,10,0.98)'; ctx.fill()
    ctx.strokeStyle = `rgba(${ar},${ag},${ab},0.72)`; ctx.lineWidth = 0.8; ctx.stroke()
    ctx.font = '400 7.5px var(--font-dm-sans, DM Sans, sans-serif)'
    ctx.fillStyle = 'rgba(240,237,230,0.88)'
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(artistName.toUpperCase(), 0, 0)

    // Collector nodes
    nodes.forEach(n => {
      const vis = isVis(n)
      const col = colMap[n.colId]
      if (!col) return
      const [r, g, b] = hex2rgb(col.color)
      const isH = hov?.id === n.id
      const t   = Math.min(n.data.total / 30, 1)

      if (!vis) {
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},0.025)`; ctx.fill()
        return
      }

      if (isH || n.cross) {
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r + (isH ? 10 : 4), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${isH ? 0.1 : 0.045})`; ctx.fill()
      }

      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
      ctx.fillStyle   = isH ? `rgba(${r},${g},${b},0.2)` : `rgba(${r},${g},${b},${0.06 + t * 0.12})`
      ctx.fill()
      ctx.strokeStyle = isH ? col.color : `rgba(${r},${g},${b},${0.38 + t * 0.62})`
      ctx.lineWidth   = isH ? 1 : 0.5
      ctx.stroke()

      if (n.cross) {
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 2.5, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${r},${g},${b},0.2)`; ctx.lineWidth = 0.4; ctx.stroke()
      }

      if (isH) {
        const label = ensCache[n.id] || shortAddr(n.id)
        ctx.font        = '300 9px var(--font-jetbrains-mono, monospace)'
        ctx.fillStyle   = 'rgba(240,237,230,0.82)'
        ctx.textAlign   = 'center'; ctx.textBaseline = 'top'
        ctx.fillText(label, n.x, n.y + n.r + 5)
      }
    })

    ctx.restore()
  }, [nodes, collections, colMap, accentRgb, artistName, ensCache])

  // RAF loop
  useEffect(() => {
    const loop = () => { draw(); animRef.current = requestAnimationFrame(loop) }
    animRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animRef.current)
  }, [draw])

  // Resize observer
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const observer = new ResizeObserver(() => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    })
    observer.observe(canvas)
    canvas.width  = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    return () => observer.disconnect()
  }, [])

  // ── Mouse interactions ────────────────────────────────────────────────
  const worldPos = (mx: number, my: number) => {
    const canvas = canvasRef.current!
    const rect   = canvas.getBoundingClientRect()
    return {
      x: (mx - rect.left - canvas.width / 2 - panRef.current.x) / scaleRef.current,
      y: (my - rect.top  - canvas.height / 2 - panRef.current.y) / scaleRef.current,
    }
  }

  const hitTest = (mx: number, my: number) => {
    const { x, y } = worldPos(mx, my)
    let best: SimNode | null = null, bd = Infinity
    for (const n of nodes) {
      const fil = filterRef.current
      if (fil !== 'all' && !(n.data.holdings[fil] || 0)) continue
      const dx = x - n.x, dy = y - n.y, d = Math.sqrt(dx * dx + dy * dy)
      if (d <= n.r + 8 && d < bd) { bd = d; best = n }
    }
    return best
  }

  const isDragging = useRef(false)
  const lastMouse  = useRef({ x: 0, y: 0 })

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      setPan(p => ({ x: p.x + e.clientX - lastMouse.current.x, y: p.y + e.clientY - lastMouse.current.y }))
      lastMouse.current = { x: e.clientX, y: e.clientY }
      return
    }
    const h = hitTest(e.clientX, e.clientY)
    setHovered(h)
    if (h) setHoveredPos({ x: e.clientX, y: e.clientY })
  }

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    setScale(s => Math.max(0.15, Math.min(4.5, s * (e.deltaY < 0 ? 1.07 : 0.94))))
  }

  // ── Register __saveENS immediately on mount ──────────────────────────
  // Uses ensCacheRef which always has the latest resolved names.
  // Works at any point — during resolution or after. Call from browser console.
  useEffect(() => {
    const filename = ensUrl.split('/').pop() ?? 'ens-cache.json'
    ;(window as any).__saveENS = () => {
      const data = ensCacheRef.current
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const a    = document.createElement('a')
      a.href     = URL.createObjectURL(blob)
      a.download = filename
      a.click()
      console.log(`Downloaded ${filename} with ${Object.keys(data).length} entries (${Object.values(data).filter(Boolean).length} resolved)`)
    }
    return () => { delete (window as any).__saveENS }
  }, [ensUrl])

  // ── ENS resolution ────────────────────────────────────────────────────
  // Step 1: load the pre-baked .ens.json cache instantly (no RPC needed).
  // Step 2: live-resolve only addresses absent from the cache file.
  useEffect(() => {
    // Trigger on collectors load — stable, not on nodes (d3 ticks constantly)
    if (!collectors.length) return
    let cancelled = false

    async function run() {
      // All unique addresses from the collectors data
      const allAddrs = [...new Set(collectors.map(d => d.addr))]

      // Load pre-cached names — instant, no RPC
      let preCache: Record<string, string | null> = {}
      try {
        const r = await fetch(ensUrl)
        if (r.ok) preCache = await r.json()
      } catch { /* cache file missing — proceed to live lookup */ }

      if (cancelled) return

      // Apply confirmed string names from pre-cache immediately
      const confirmed = Object.fromEntries(
        Object.entries(preCache).filter(([, v]) => typeof v === 'string')
      )
      if (Object.keys(confirmed).length) setEnsCache(confirmed)

      // Only resolve addresses without a confirmed string name
      const unknown = allAddrs.filter(a => typeof preCache[a] !== 'string')

      if (!unknown.length) {
        setEnsStatus('live')
        setEnsCount({ done: allAddrs.length, total: allAddrs.length })
        return
      }

      setEnsCount({ done: allAddrs.length - unknown.length, total: allAddrs.length })
      setEnsStatus('loading')

      const BATCH = 50
      let done = allAddrs.length - unknown.length

      for (let i = 0; i < unknown.length; i += BATCH) {
        if (cancelled) return
        const batch   = unknown.slice(i, i + BATCH)
        const updates = await resolveEnsBatch(batch)
        done += batch.length
        setEnsCache(prev => ({ ...prev, ...updates }))
        setEnsCount({ done, total: allAddrs.length })
        await new Promise(res => setTimeout(res, 80))
      }

      if (!cancelled) setEnsStatus('live')
    }

    run()
    return () => { cancelled = true }
  }, [collectors.length, ensUrl])

  // ── Render ────────────────────────────────────────────────────────────
  const ncols = collections.length
  const hd = hovered ? hovered.data : null

  return (
    <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden select-none">

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ cursor: hovered ? 'default' : 'crosshair' }}
        onMouseMove={onMouseMove}
        onMouseDown={e => { isDragging.current = true; lastMouse.current = { x: e.clientX, y: e.clientY } }}
        onMouseUp={() => { isDragging.current = false }}
        onMouseLeave={() => { isDragging.current = false; setHovered(null) }}
        onWheel={onWheel}
      />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 68% 62% at 50% 50%, transparent 28%, rgba(10,10,10,0.9) 100%)' }} />

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-1 h-1 rounded-full animate-pulse" style={{ background: accent }} />
            <p className="font-mono text-[9px] tracking-widest uppercase text-line-muted">Loading Map</p>
          </div>
        </div>
      )}

      {/* Wordmark — bottom left */}
      <div className="absolute bottom-8 left-7 z-10 pointer-events-none">
        <p className="font-mono text-[8px] tracking-[0.35em] uppercase text-line-muted mb-1">Networked Collectors Map</p>
        <p className="font-display font-light text-2xl tracking-wide text-line-text" style={{ letterSpacing: '0.1em' }}>
          {artistName}
        </p>
        <p className="font-mono text-[7px] tracking-[0.25em] uppercase mt-1.5" style={{ color: accent + '60' }}>
          {ncols} Collections · {stats.total_collectors.toLocaleString()} Collectors · {stats.total_pieces.toLocaleString()} Works
        </p>
      </div>

      {/* Stats — bottom right */}
      <div className="absolute bottom-8 right-7 z-10 pointer-events-none text-right flex flex-col gap-1">
        {[
          { n: stats.total_collectors.toLocaleString(), l: 'Collectors' },
          { n: stats.total_pieces.toLocaleString(),     l: 'Works Held' },
          { n: stats.cross_collection.toLocaleString(), l: 'Cross-Collection' },
        ].map(({ n, l }) => (
          <div key={l} className="flex items-baseline justify-end gap-2">
            <span className="font-mono text-base text-line-text" style={{ letterSpacing: '-0.025em' }}>{n}</span>
            <span className="font-mono text-[7px] tracking-[0.2em] uppercase text-line-muted">{l}</span>
          </div>
        ))}
      </div>

      {/* ENS status — top right */}
      <div className="absolute top-7 right-7 z-10 flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
          ensStatus === 'live'    ? 'bg-green-700' :
          ensStatus === 'loading' ? 'bg-amber-700 animate-pulse' : 'bg-line-border'
        }`} />
        <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-line-muted">
          {ensStatus === 'idle'    ? 'ENS' :
           ensStatus === 'loading' ? `ENS ${ensCount.done}/${ensCount.total}` :
           `ENS Live · ${ensCount.total}`}
        </span>
      </div>

      {/* Filter panel — top left */}
      <div className="absolute top-7 left-7 z-10 w-44">
        <p className="font-mono text-[7px] tracking-[0.38em] uppercase text-line-muted mb-2 pb-2 px-2 border-b border-line-border">
          Collections
        </p>
        {/* All */}
        <button
          onClick={() => setFilter('all')}
          className={`relative flex items-center gap-2 w-full px-2 py-1.5 border text-left transition-all ${
            filter === 'all'
              ? 'border-line-border bg-white/[0.03]'
              : 'border-transparent hover:border-line-border'
          }`}
        >
          {filter === 'all' && <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: accent }} />}
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-white/25" />
          <span className="font-mono text-[9px] tracking-wide text-line-muted">All</span>
        </button>
        {/* Per collection */}
        {collections.map(col => (
          <button
            key={col.id}
            onClick={() => setFilter(filter === col.id ? 'all' : col.id)}
            className={`relative flex items-center gap-2 w-full px-2 py-1.5 border text-left transition-all ${
              filter === col.id
                ? 'border-line-border bg-white/[0.03]'
                : filter === 'all'
                  ? 'border-transparent hover:border-line-border'
                  : 'border-transparent opacity-20'
            }`}
          >
            {filter === col.id && (
              <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: accent }} />
            )}
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: col.color }} />
            <span className="font-mono text-[9px] tracking-wide text-line-muted flex-1 truncate">{col.name}</span>
            <span className="font-mono text-[8px]" style={{ color: accent + '50' }}>
              {col.holders.toLocaleString()}
            </span>
          </button>
        ))}
      </div>

      {/* Collector card — on hover */}
      {hd && (
        <div
          className="absolute z-30 w-60 pointer-events-none"
          style={{
            left: Math.min(hoveredPos.x + 20, window.innerWidth - 260),
            top:  Math.max(20, Math.min(hoveredPos.y - 20, window.innerHeight - 420)),
          }}
        >
          <div className="border-t border-l border-r border-b border-line-border bg-[rgba(10,10,10,0.98)]"
            style={{ borderTopColor: accent, borderTopWidth: 1 }}>
            <div className="px-4 pt-3.5 pb-3">
              {/* ENS / Address */}
              <p className="font-sans font-medium text-sm text-line-text truncate mb-0.5">
                {ensCache[hd.addr] || shortAddr(hd.addr)}
              </p>
              <p className="font-mono text-[8px] text-line-muted tracking-wide mb-3">
                {hd.addr.slice(0, 10)}…{hd.addr.slice(-8)}
              </p>

              {/* Set Completion hero stat */}
              <div className="mb-2">
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-light text-[40px] leading-none text-line-text"
                    style={{ letterSpacing: '-0.04em' }}>
                    {setPct(hd, collections)}
                  </span>
                  <span className="font-display text-xl text-line-muted">%</span>
                </div>
                <p className="font-mono text-[8px] tracking-[0.3em] uppercase text-line-muted mt-0.5">
                  Set Completion
                </p>
                <p className="font-mono text-[10px] text-line-muted mt-1">
                  {hd.total} work{hd.total !== 1 ? 's' : ''} across {collCount(hd, collections)} collection{collCount(hd, collections) !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Completion bar */}
              <div className="h-px bg-white/[0.06] rounded-full mb-3 mt-2">
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${setPct(hd, collections)}%`, background: accent }} />
              </div>

              {/* Per collection breakdown */}
              <div className="border-t border-line-border pt-2.5 space-y-1.5">
                {collections.map(col => {
                  const v = hd.holdings[col.id] || 0
                  return (
                    <div key={col.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full" style={{ background: col.color }} />
                        <span className="font-mono text-[8px] tracking-wide uppercase text-line-muted">
                          {col.name}
                        </span>
                      </div>
                      <span className={`font-mono text-[10px] font-medium ${v ? 'text-line-text' : 'text-line-muted/30'}`}>
                        {v || '—'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

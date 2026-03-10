'use client'
// components/CollectorStatsPanel.tsx
import { useState, useEffect, useRef } from 'react'
import type { Artist } from '@/types'

function useCountUp(target: number, duration = 800, active = false) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active || target === 0) return
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration, active])
  return value
}

interface Stats {
  totalSold: number
  avgPriceEth: number
  avgPriceUsd: number
  totalVolumeEth: number
  totalVolumeUsd: number
  lastSaleDate: string | null
}

export function CollectorStatsPanel({ artist }: { artist: Artist }) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!artist.walletAddress) { setLoading(false); return }
    fetch(`/api/artists/${artist.slug}/stats`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setStats(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [artist.slug, artist.walletAddress])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const totalSold = useCountUp(stats?.totalSold ?? 0, 800, active)
  const totalVol = useCountUp(Math.round((stats?.totalVolumeEth ?? 0) * 100) / 100, 1000, active)

  if (!artist.walletAddress) {
    return (
      <div className="border border-line-border p-6">
        <p className="font-mono text-xs text-line-muted tracking-widest text-center py-4">
          On-chain data not yet linked
        </p>
      </div>
    )
  }

  return (
    <div ref={ref} className="grid grid-cols-2 gap-px bg-line-border">
      {[
        {
          label: 'Total Sold',
          value: loading ? null : error ? '—' : totalSold.toLocaleString(),
          sub: null,
        },
        {
          label: 'Avg Price',
          value: loading ? null : error ? '—' : stats ? `${stats.avgPriceEth.toFixed(3)} ETH` : '—',
          sub: stats ? `~$${stats.avgPriceUsd.toLocaleString()} USD` : null,
        },
        {
          label: 'Total Volume',
          value: loading ? null : error ? '—' : stats ? `${totalVol.toFixed(2)} ETH` : '—',
          sub: stats ? `~$${stats.totalVolumeUsd.toLocaleString()} USD` : null,
        },
        {
          label: 'Last Sale',
          value: loading ? null : error ? '—' : stats?.lastSaleDate
            ? new Date(stats.lastSaleDate).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })
            : '—',
          sub: null,
        },
      ].map(({ label, value, sub }) => (
        <div key={label} className="bg-line-bg p-5">
          <p className="font-mono text-[9px] text-line-muted tracking-widest uppercase mb-3">{label}</p>
          {value === null ? (
            <div className="skeleton h-7 w-20 rounded" />
          ) : (
            <>
              <p className="font-display font-light text-line-text text-2xl">{value}</p>
              {sub && <p className="font-mono text-[10px] text-line-muted mt-1">{sub}</p>}
            </>
          )}
        </div>
      ))}
    </div>
  )
}

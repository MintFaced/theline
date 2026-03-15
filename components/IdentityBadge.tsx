'use client'
// components/IdentityBadge.tsx
// Shows 6529 Level (L34) and Rep (0.6m) for artists with a 6529 identity

import { useState, useEffect } from 'react'

function formatRep(rep: number): string {
  if (rep >= 1_000_000) return `${(rep / 1_000_000).toFixed(1)}m`
  if (rep >= 1_000)     return `${(rep / 1_000).toFixed(0)}k`
  return String(rep)
}

export function IdentityBadge({ slug }: { slug: string }) {
  const [data, setData] = useState<{ rep: number; level: number } | null>(null)

  useEffect(() => {
    fetch(`/api/artists/${slug}/identity`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.level || d?.rep) setData(d) })
      .catch(() => {})
  }, [slug])

  if (!data) return null

  return (
    <div className="flex items-center gap-2">
      {data.level != null && data.level > 0 && (
        <span className="font-mono text-[10px] text-line-muted tracking-widest">
          L{data.level}
        </span>
      )}
      {data.rep != null && data.rep > 0 && (
        <span className="font-mono text-[10px] text-line-muted/60 tracking-widest">
          {formatRep(data.rep)} Rep
        </span>
      )}
    </div>
  )
}

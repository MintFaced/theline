'use client'
// components/RecentWorksSection.tsx
import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { Artist } from '@/types'

interface Work {
  tokenId: string
  title: string
  imageUrl: string
  animationUrl: string | null
  mintDate: string
  edition: string
  chain: string
  marketplaceUrl: string
}

export function RecentWorksSection({ artist }: { artist: Artist }) {
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!artist.walletAddress) { setLoading(false); return }
    fetch(`/api/artists/${artist.slug}/recent-works`)
      .then(r => r.ok ? r.json() : [])
      .then(data => { setWorks(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [artist.slug, artist.walletAddress])

  if (loading) {
    return (
      <div className="flex gap-6 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="shrink-0 w-64">
            <div className="skeleton aspect-square w-full rounded mb-3" />
            <div className="skeleton h-3 w-32 rounded mb-2" />
            <div className="skeleton h-3 w-20 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (!artist.walletAddress || works.length === 0) {
    if (artist.purchaseUrl) {
      return (
        <a href={artist.purchaseUrl} target="_blank" rel="noopener noreferrer"
          className="btn-outline inline-flex">
          View this artist's collection →
        </a>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {works.slice(0, 5).map(work => (
        <a key={work.tokenId} href={work.marketplaceUrl} target="_blank" rel="noopener noreferrer"
          className="group block">
          <div className="relative aspect-square overflow-hidden bg-line-surface mb-3">
            <Image
              src={work.imageUrl}
              alt={work.title}
              fill
              sizes="200px"
              className="object-cover transition-all duration-300 group-hover:brightness-110 group-hover:scale-[1.02]"
            />
            {/* Chain badge */}
            <div className="absolute top-2 left-2">
              <span className="font-mono text-[9px] tracking-widest uppercase bg-line-bg/80 text-line-accent px-1.5 py-0.5">
                {work.chain}
              </span>
            </div>
          </div>
          <p className="font-sans text-xs text-line-text group-hover:text-line-hover transition-colors truncate">
            {work.title || 'Untitled'}
          </p>
          <div className="flex items-center justify-between mt-1">
            <p className="font-mono text-[10px] text-line-muted">{work.edition}</p>
            <p className="font-mono text-[10px] text-line-muted">
              {work.mintDate ? new Date(work.mintDate).toLocaleDateString('en-NZ', { month: 'short', year: 'numeric' }) : ''}
            </p>
          </div>
        </a>
      ))}
    </div>
  )
}

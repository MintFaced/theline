'use client'
// components/ArtistDirectoryClient.tsx
import { useState, useMemo, useCallback, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Artist } from '@/types'
import { CATEGORY_LABELS } from '@/types'
import { ArtistCard } from './ArtistCard'

const PAGE_SIZE = 60
const CATEGORIES = ['lens-based', 'illustration', 'glitch', 'ai', 'generative', '3d', 'painting']
const CHAINS = ['ethereum', 'tezos']
const SORTS = [
  { value: 'line',    label: 'Line Number' },
  { value: 'recent',  label: 'Recently Added' },
  { value: 'works',   label: 'Most Artworks' },
  { value: 'featured', label: 'Featured First' },
]

interface Props { artists: Artist[] }

export function ArtistDirectoryClient({ artists }: Props) {
  const searchParams = useSearchParams()
  const [query, setQuery]         = useState('')
  const [category, setCategory]   = useState<string | null>(() => searchParams.get('category'))
  const [chain, setChain]         = useState<string | null>(null)
  const [lineRange, setLineRange] = useState<[number, number]>([0, 900])
  const [sort, setSort]           = useState('line')
  const [page, setPage]           = useState(1)
  const [verification, setVerification] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let result = artists

    // Search
    if (query.length >= 2) {
      const q = query.toLowerCase()
      result = result.filter(a =>
        a.name.toLowerCase().includes(q) ||
        (a.xHandle?.toLowerCase().includes(q)) ||
        (a.description?.toLowerCase().includes(q)) ||
        a.allLineNumbers.some(n => String(n).includes(q))
      )
    }

    // Category
    if (category) result = result.filter(a => a.category === category)

    // Chain
    if (chain) result = result.filter(a => a.blockchain === chain)

    // Verification
    if (verification === 'mintface') result = result.filter(a => a.verified)
    if (verification === '6529') result = result.filter(a => a.curations?.some(cu => cu.key === '6529'))

    // Line range
    result = result.filter(a =>
      a.allLineNumbers.some(n => n >= lineRange[0] && n <= lineRange[1])
    )

    // Sort
    switch (sort) {
      case 'line':    result = [...result].sort((a, b) => a.allLineNumbers[0] - b.allLineNumbers[0]); break
      case 'recent':  result = [...result].sort((a, b) => Math.max(...b.allLineNumbers) - Math.max(...a.allLineNumbers)); break
      case 'works':   result = [...result].sort((a, b) => (b.artworksDisplayed ?? 0) - (a.artworksDisplayed ?? 0)); break
      case 'featured': result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break
    }

    return result
  }, [artists, query, category, chain, lineRange, sort, verification])

  const visible = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = visible.length < filtered.length

  const reset = useCallback(() => {
    setQuery(''); setCategory(null); setChain(null)
    setLineRange([0, 900]); setSort('line'); setPage(1); setVerification(null)
  }, [])

  return (
    <div>
      {/* ── Filter Bar ── */}
      <div className="sticky top-14 z-30 bg-line-bg/95 backdrop-blur-sm border-b border-line-border py-4 mb-10 -mx-6 px-6">
        <div className="flex flex-wrap items-center gap-4">

          {/* Search */}
          <div className="relative flex items-center">
            <svg className="absolute left-3 text-line-muted" width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/>
              <line x1="10.5" y1="10.5" x2="14.5" y2="14.5" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(1) }}
              placeholder="Search artists…"
              className="bg-line-surface border border-line-border pl-8 pr-4 py-2 font-mono text-xs text-line-text placeholder-line-muted outline-none focus:border-line-accent transition-colors w-48"
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => { setCategory(null); setPage(1) }}
              className={`font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-all ${
                !category ? 'bg-line-accent text-line-bg border-line-accent' : 'border-line-border text-line-muted hover:border-line-text'
              }`}
            >All</button>
            {CATEGORIES.map(cat => (
              <button key={cat}
                onClick={() => { setCategory(category === cat ? null : cat); setPage(1) }}
                className={`font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-all ${
                  category === cat ? 'bg-line-accent text-line-bg border-line-accent' : 'border-line-border text-line-muted hover:border-line-text'
                }`}
              >{CATEGORY_LABELS[cat]}</button>
            ))}
          </div>

          {/* Verification */}
          <div className="flex gap-1.5">
            <button
              onClick={() => { setVerification(verification === 'mintface' ? null : 'mintface'); setPage(1) }}
              className={`font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-all ${
                verification === 'mintface' ? 'bg-line-accent text-line-bg border-line-accent' : 'border-line-border text-line-muted hover:border-line-text'
              }`}
            >✓ Verified</button>
            <button
              onClick={() => { setVerification(verification === '6529' ? null : '6529'); setPage(1) }}
              className={`font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-all ${
                verification === '6529' ? 'bg-line-accent text-line-bg border-line-accent' : 'border-line-border text-line-muted hover:border-line-text'
              }`}
            >6529 Identities</button>
          </div>

          {/* Chain */}
          <div className="flex gap-1.5">
            {CHAINS.map(c => (
              <button key={c}
                onClick={() => { setChain(chain === c ? null : c); setPage(1) }}
                className={`font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-all ${
                  chain === c ? 'bg-line-accent text-line-bg border-line-accent' : 'border-line-border text-line-muted hover:border-line-text'
                }`}
              >{c.toUpperCase()}</button>
            ))}
          </div>

          {/* Sort */}
          <select value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}
            className="bg-line-surface border border-line-border px-3 py-2 font-mono text-[10px] text-line-muted tracking-widest uppercase outline-none cursor-pointer ml-auto">
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

          {/* Count */}
          <span className="font-mono text-[10px] text-line-muted tracking-widest">
            {filtered.length} artists
          </span>
        </div>
      </div>

      {/* ── Grid ── */}
      {visible.length === 0 ? (
        <div className="text-center py-32">
          <p className="font-mono text-sm text-line-muted tracking-widest">No artists found</p>
          <button onClick={reset} className="font-mono text-xs text-line-accent mt-4 tracking-widest uppercase hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {visible.map(artist => (
              <ArtistCard key={artist.slug} artist={artist} />
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="text-center mt-16">
              <button
                onClick={() => setPage(p => p + 1)}
                className="btn-outline"
              >
                Load more · {filtered.length - visible.length} remaining
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

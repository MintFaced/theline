'use client'
// components/LiveSearch.tsx
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import artistsData from '@/data/artists.json'
import type { Artist } from '@/types'
import { CATEGORY_LABELS } from '@/types'

const artists = artistsData as Artist[]

export function LiveSearch({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const results = query.length >= 2
    ? artists
        .filter(a =>
          a.name.toLowerCase().includes(query.toLowerCase()) ||
          (a.xHandle && a.xHandle.toLowerCase().includes(query.toLowerCase())) ||
          (a.description && a.description.toLowerCase().includes(query.toLowerCase())) ||
          a.allLineNumbers.some(n => String(n).includes(query))
        )
        .slice(0, 12)
    : []

  return (
    <div
      className="fixed inset-0 z-50 bg-line-bg/97 backdrop-blur-sm flex flex-col"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Search input */}
      <div className="border-b border-line-border px-6 py-5 flex items-center gap-4">
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="text-line-muted shrink-0">
          <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/>
          <line x1="10.5" y1="10.5" x2="14.5" y2="14.5" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search artists, genres, Line numbers…"
          className="flex-1 bg-transparent text-lg text-line-text placeholder-line-muted outline-none" style={{ fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}
        />
        <button
          onClick={onClose}
          className="font-mono text-xs text-line-muted hover:text-line-text transition-colors tracking-widest uppercase"
        >
          ESC
        </button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {query.length >= 2 && results.length === 0 && (
          <p className="font-mono text-sm text-line-muted text-center py-16 tracking-widest">
            No artists found for "{query}"
          </p>
        )}

        {results.length > 0 && (
          <div className="max-w-2xl mx-auto space-y-1">
            <p className="font-mono text-[10px] text-line-muted tracking-widest uppercase mb-4">
              {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
            {results.map(artist => (
              <Link
                key={artist.slug}
                href={`/artists/${artist.slug}`}
                onClick={onClose}
                className="flex items-center gap-4 py-3 px-4 rounded hover:bg-line-surface transition-colors group"
              >
                {/* Thumbnail */}
                <div className="w-12 h-12 bg-line-surface shrink-0 overflow-hidden">
                  {artist.galleryImage && (
                    <Image
                      src={artist.galleryImage}
                      alt={artist.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm text-line-text group-hover:text-line-hover transition-colors truncate">
                    {artist.name}
                  </p>
                  <p className="font-mono text-[10px] text-line-muted tracking-wider">
                    {CATEGORY_LABELS[artist.category] || artist.category}
                  </p>
                </div>
                {/* Line number */}
                <div className="shrink-0 text-right">
                  {artist.allLineNumbers.map(n => (
                    <span key={n} className="font-mono text-[11px] text-line-accent block">
                      LINE {n}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}

        {query.length < 2 && (
          <div className="max-w-2xl mx-auto">
            <p className="font-mono text-xs text-line-muted tracking-widest uppercase mb-6">
              Featured artists
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {artists.filter(a => a.featured).slice(0, 8).map(artist => (
                <Link
                  key={artist.slug}
                  href={`/artists/${artist.slug}`}
                  onClick={onClose}
                  className="group"
                >
                  <div className="aspect-square bg-line-surface overflow-hidden mb-2">
                    {artist.galleryImage && (
                      <Image
                        src={artist.galleryImage}
                        alt={artist.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
                      />
                    )}
                  </div>
                  <p className="font-sans text-xs text-line-text truncate">{artist.name}</p>
                  <p className="font-mono text-[10px] text-line-accent">LINE {artist.lineNumber}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

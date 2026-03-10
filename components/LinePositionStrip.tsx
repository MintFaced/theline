// components/LinePositionStrip.tsx
import Link from 'next/link'
import Image from 'next/image'
import type { Artist } from '@/types'
import { LINE_MAX } from '@/types'

interface Props {
  artist: Artist
  allArtists: Artist[]
}

export function LinePositionStrip({ artist, allArtists }: Props) {
  const primaryLine = artist.allLineNumbers[0]
  const maxLine = Math.max(...allArtists.flatMap(a => a.allLineNumbers))

  // Multi-line artist
  if (artist.allLineNumbers.length > 1) {
    return (
      <div>
        <div className="flex flex-wrap gap-3 mb-6">
          {artist.allLineNumbers.map((n, i) => (
            <a
              key={n}
              href={artist.oncyberUrls[i] ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-line-accent border border-line-accent px-4 py-2 hover:bg-line-accent hover:text-line-bg transition-all tracking-wider"
            >
              LINE {n}
            </a>
          ))}
        </div>
        <p className="font-mono text-xs text-line-muted tracking-widest">
          {artist.name} holds {artist.allLineNumbers.length} positions on The Line. The Line is fixed at 1,000 artists.
        </p>
      </div>
    )
  }

  // Single-line: show contextual neighbours
  const WINDOW = 10 // show 10 either side
  const start = Math.max(0, primaryLine - WINDOW)
  const end = Math.min(LINE_MAX - 1, primaryLine + WINDOW)

  // Build a map of lineNumber → artist
  const lineMap = new Map<number, Artist>()
  for (const a of allArtists) {
    for (const n of a.allLineNumbers) lineMap.set(n, a)
  }

  const neighbours = Array.from({ length: end - start + 1 }, (_, i) => ({
    lineNumber: start + i,
    artist: lineMap.get(start + i) ?? null,
    isCurrent: start + i === primaryLine,
  }))

  // Prev / next
  let prev: Artist | null = null
  let next: Artist | null = null
  for (let n = primaryLine - 1; n >= 0; n--) {
    if (lineMap.has(n)) { prev = lineMap.get(n)!; break }
  }
  for (let n = primaryLine + 1; n <= LINE_MAX; n++) {
    if (lineMap.has(n)) { next = lineMap.get(n)!; break }
  }

  return (
    <div>
      {/* Neighbour strip */}
      <div className="flex items-center gap-1 overflow-x-auto pb-4 mb-8" style={{ scrollbarWidth: 'none' }}>
        {neighbours.map(({ lineNumber, artist: a, isCurrent }) => (
          <div key={lineNumber} className={`shrink-0 ${isCurrent ? 'z-10' : ''}`}>
            {a ? (
              <Link href={`/artists/${a.slug}`}>
                <div className={`relative overflow-hidden transition-all duration-200 ${
                  isCurrent
                    ? 'w-14 h-20 ring-1 ring-line-accent brightness-100'
                    : 'w-9 h-12 brightness-50 hover:brightness-75'
                }`}>
                  {a.galleryImage ? (
                    <Image src={a.galleryImage} alt={a.name} fill sizes="56px" className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-line-surface" />
                  )}
                  {isCurrent && (
                    <div className="absolute bottom-0 left-0 right-0 text-center pb-1 bg-gradient-to-t from-black/60">
                      <span className="font-mono text-[8px] text-line-accent tracking-widest">{lineNumber}</span>
                    </div>
                  )}
                </div>
              </Link>
            ) : (
              <div className={`border border-dashed border-line-ghost ${
                isCurrent ? 'w-14 h-20' : 'w-9 h-12'
              }`} style={{ borderColor: '#2A2A2A' }} />
            )}
          </div>
        ))}
      </div>

      {/* Prev / Next navigation */}
      <div className="flex items-center justify-between">
        {prev ? (
          <Link href={`/artists/${prev.slug}`}
            className="flex items-center gap-3 group">
            <span className="font-mono text-[10px] text-line-muted tracking-widest group-hover:text-line-accent transition-colors">←</span>
            <div>
              <p className="font-mono text-[9px] text-line-muted tracking-widest">PREV · LINE {prev.allLineNumbers[0]}</p>
              <p className="font-sans text-sm text-line-text group-hover:text-line-hover transition-colors">{prev.name}</p>
            </div>
          </Link>
        ) : <div />}

        <p className="font-mono text-[10px] text-line-muted tracking-widest text-center hidden md:block">
          The Line is fixed at 1,000 artists · {LINE_MAX - maxLine - 1} remain
        </p>

        {next ? (
          <Link href={`/artists/${next.slug}`}
            className="flex items-center gap-3 group text-right">
            <div>
              <p className="font-mono text-[9px] text-line-muted tracking-widest">NEXT · LINE {next.allLineNumbers[0]}</p>
              <p className="font-sans text-sm text-line-text group-hover:text-line-hover transition-colors">{next.name}</p>
            </div>
            <span className="font-mono text-[10px] text-line-muted tracking-widest group-hover:text-line-accent transition-colors">→</span>
          </Link>
        ) : <div />}
      </div>
    </div>
  )
}

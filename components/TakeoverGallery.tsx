'use client'
// components/TakeoverGallery.tsx
import { useState, useCallback } from 'react'

const VIDEOS = [
  'ULbHt7iOQS8',
  '0ieVu5HqphQ',
  'mwqzdHkIiGo',
  'rKI-Bodqyyo',
  'sTJl9gT3AyA',
  '7TfjEoIc63E',
  'D6hoRQHyfNo',
  'UoA_VOl4msA',
  '0oQdXvicZQM',
  'GxsLHKZSd-Q',
  'u0R0ksFSjRA',
  '8kJ6sx5SiQw',
  'jAhnE-H4f30',
  'w1okF1JG8ec',
  'nLwZBDZjUQw',
  '2oAaSVq_Zh8',
  'x8FY5XjKNpU',
  'iv2h9KcZrk8',
  '9gXFx5NH6yI',
  'cCOBUJFkupE',
]

function thumbUrl(id: string) {
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
}

export function TakeoverGallery({ hideCta = false }: { hideCta?: boolean }) {
  const [active, setActive] = useState<string | null>(null)

  const close = useCallback(() => setActive(null), [])

  const onBackdrop = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) close()
  }, [close])

  return (
    <>
      {/* Thumbnail grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-line-border">
        {VIDEOS.map((id) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className="group relative overflow-hidden bg-line-bg aspect-video block w-full focus:outline-none"
            aria-label="Play takeover video"
          >
            <img
              src={thumbUrl(id)}
              alt=""
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 rounded-full border border-white/60 flex items-center justify-center">
                <svg width="14" height="16" viewBox="0 0 14 16" fill="none" className="ml-0.5">
                  <path d="M1 1L13 8L1 15V1Z" fill="white" fillOpacity="0.9" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Reserve spot CTA */}
      {!hideCta && (
        <div className="mt-16 md:mt-24 border-t border-line-border pt-12">
          <div className="max-w-lg">
            <p className="label mb-4">Your Turn</p>
            <h2 className="font-display font-light text-3xl text-line-text mb-4" style={{ letterSpacing: '-0.02em' }}>
              Reserve a takeover slot
            </h2>
            <p className="font-sans text-sm text-line-muted leading-relaxed mb-6">
              One week, every screen. Your work visible from the street in Hastings, New Zealand — 24 hours a day.
            </p>
            <a href="/takeover" className="btn-primary">Reserve spot →</a>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={onBackdrop}
        >
          <button
            onClick={close}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors font-mono text-[11px] tracking-widest uppercase flex items-center gap-2"
          >
            Close
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.2"/>
              <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
          </button>

          {VIDEOS.indexOf(active) > 0 && (
            <button
              onClick={() => setActive(VIDEOS[VIDEOS.indexOf(active!) - 1])}
              className="absolute left-4 md:left-8 text-white/40 hover:text-white transition-colors p-2"
              aria-label="Previous"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 4L7 12L15 20" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
            </button>
          )}

          {VIDEOS.indexOf(active) < VIDEOS.length - 1 && (
            <button
              onClick={() => setActive(VIDEOS[VIDEOS.indexOf(active!) + 1])}
              className="absolute right-4 md:right-8 text-white/40 hover:text-white transition-colors p-2"
              aria-label="Next"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 4L17 12L9 20" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
            </button>
          )}

          <div className="w-full max-w-5xl mx-12 aspect-video">
            <iframe
              key={active}
              src={`https://www.youtube.com/embed/${active}?autoplay=1&rel=0&modestbranding=1&color=white&enablejsapi=1`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  )
}

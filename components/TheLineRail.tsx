'use client'
// components/TheLineRail.tsx
import { useRef, useState, useCallback, useEffect, memo } from 'react'
import { FixedSizeList as List } from 'react-window'
import Link from 'next/link'
import type { Artist } from '@/types'
import { LINE_MAX, LINE_MILESTONES } from '@/types'

interface Props {
  artists: Artist[]
}

const NODE_WIDTH = 72
const NODE_SIZE_REST = 48
const RAIL_HEIGHT = 520

interface Slot {
  lineNumber: number
  artist: Artist | null
}

interface ItemData {
  slots: Slot[]
  hoveredLine: number | null
  setHoveredLine: (n: number | null) => void
}

function buildSlots(artists: Artist[]): Slot[] {
  const map = new Map<number, Artist>()
  for (const a of artists) {
    for (const n of a.allLineNumbers) {
      map.set(n, a)
    }
  }
  return Array.from({ length: LINE_MAX }, (_, i) => ({
    lineNumber: i,
    artist: map.get(i) ?? null,
  }))
}

// Defined OUTSIDE the parent component so react-window never remounts slots
const RailSlot = memo(({ index, style, data }: {
  index: number
  style: React.CSSProperties
  data: ItemData
}) => {
  const { slots, hoveredLine, setHoveredLine } = data
  const { lineNumber, artist } = slots[index]
  const isHovered = hoveredLine === lineNumber
  const isMilestone = LINE_MILESTONES.includes(lineNumber)

  return (
    <div style={style} className="flex flex-col items-center justify-center relative">

      {/* Milestone label */}
      {isMilestone && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="font-mono text-[9px] text-line-accent tracking-widest">
            {lineNumber === 0 ? 'THE LINE' : `LINE ${lineNumber}`}
          </span>
          <div className="w-px h-3 bg-line-accent mx-auto mt-1" />
        </div>
      )}

      {artist ? (
        <Link href={`/artists/${artist.slug}`}>
          <div
            className="relative overflow-hidden cursor-pointer"
            style={{
              width:  isHovered ? 80 : NODE_SIZE_REST,
              height: isHovered ? 106 : NODE_SIZE_REST,
              transition: 'width 150ms ease, height 150ms ease',
            }}
            onMouseEnter={() => setHoveredLine(lineNumber)}
            onMouseLeave={() => setHoveredLine(null)}
          >
            {/* Plain <img> — tiny thumbnails don't need Next.js Image optimization */}
            {artist.galleryImage ? (
              <img
                src={artist.galleryImage}
                alt={artist.name}
                width={80}
                height={106}
                loading="lazy"
                decoding="async"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: isHovered ? 'brightness(1.1)' : 'brightness(0.75)',
                  transition: 'filter 150ms ease',
                  display: 'block',
                }}
              />
            ) : (
              <div className="w-full h-full bg-line-surface border border-line-border" />
            )}

            {/* Hover label */}
            {isHovered && (
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-center pointer-events-none z-20">
                <p className="font-sans text-[10px] text-line-text truncate max-w-[100px]">
                  {artist.name}
                </p>
                <p className="font-mono text-[9px] text-line-accent tracking-wider">
                  LINE {lineNumber}
                </p>
              </div>
            )}

            {/* Featured dot */}
            {artist.featured && !isHovered && (
              <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-line-accent" />
            )}
          </div>
        </Link>
      ) : (
        /* Ghost node — future position */
        <div style={{ width: NODE_SIZE_REST, height: NODE_SIZE_REST }}>
          <div
            className="w-full h-full border border-dashed flex items-center justify-center"
            style={{ borderColor: '#2A2A2A' }}
          >
            {isMilestone && (
              <span className="font-mono text-[7px] text-line-muted tracking-widest">OPEN</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
})

RailSlot.displayName = 'RailSlot'

export function TheLineRail({ artists }: Props) {
  const listRef = useRef<List>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredLine, setHoveredLine] = useState<number | null>(null)
  const [containerWidth, setContainerWidth] = useState(1200)

  const slots = useRef<Slot[]>(buildSlots(artists)).current
  const maxOccupied = Math.max(...artists.flatMap(a => a.allLineNumbers))

  // Measure container
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Auto-scroll to most recent artist
  useEffect(() => {
    if (listRef.current) {
      const target = Math.max(0, maxOccupied - Math.floor(containerWidth / NODE_WIDTH / 2))
      listRef.current.scrollToItem(target, 'start')
    }
  }, [maxOccupied, containerWidth])

  // Drag-to-scroll
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, scrollLeft: 0 })

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true
    const outer = (listRef.current as any)?._outerRef
    if (!outer) return
    dragStart.current = { x: e.clientX, scrollLeft: outer.scrollLeft }
    outer.style.cursor = 'grabbing'
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return
    const outer = (listRef.current as any)?._outerRef
    if (!outer) return
    outer.scrollLeft = dragStart.current.scrollLeft - (e.clientX - dragStart.current.x)
  }, [])

  const onMouseUp = useCallback(() => {
    isDragging.current = false
    const outer = (listRef.current as any)?._outerRef
    if (outer) outer.style.cursor = 'grab'
  }, [])

  // itemData must be stable to avoid remounting — only recreate when hoveredLine changes
  const itemData: ItemData = { slots, hoveredLine, setHoveredLine }

  return (
    <section className="relative w-full overflow-hidden" style={{ height: 'var(--rail-height)' }}>
      <div className="absolute inset-0 bg-line-bg" />

      {/* The gold line */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: '50%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, #C8A96E 5%, #C8A96E 95%, transparent 100%)',
          transform: 'translateY(-50%)',
        }}
      />

      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, #0A0A0A, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(-90deg, #0A0A0A, transparent)' }} />

      {/* Rail */}
      <div
        ref={containerRef}
        className="absolute inset-0 select-none"
        style={{ cursor: 'grab' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {containerWidth > 0 && (
          <List
            ref={listRef}
            layout="horizontal"
            height={RAIL_HEIGHT}
            width={containerWidth}
            itemCount={LINE_MAX}
            itemSize={NODE_WIDTH}
            itemData={itemData}
            style={{ overflow: 'auto', scrollbarWidth: 'none' }}
          >
            {RailSlot}
          </List>
        )}
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10 pointer-events-none">
        <p className="font-mono text-[10px] text-line-muted tracking-[0.2em] italic">
          {artists.length} artists · 1,000 positions · {LINE_MAX - maxOccupied - 1} remain
        </p>
      </div>

      {/* Drag hint */}
      <div className="absolute bottom-8 right-8 z-10 hidden md:flex items-center gap-2 opacity-40">
        <span className="font-mono text-[9px] text-line-muted tracking-widest">DRAG</span>
        <svg width="20" height="8" viewBox="0 0 20 8" fill="none">
          <line x1="0" y1="4" x2="18" y2="4" stroke="#666" strokeWidth="0.8"/>
          <polyline points="14,1 18,4 14,7" stroke="#666" strokeWidth="0.8" fill="none"/>
        </svg>
      </div>
    </section>
  )
}
  const [containerWidth, setContainerWidth] = useState(1200)

  const slots = buildSlots(artists)
  const maxOccupied = Math.max(...artists.flatMap(a => a.allLineNumbers))

  // Measure container width
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Auto-scroll to most recent artist on load
  useEffect(() => {
    if (listRef.current) {
      const targetIndex = Math.max(0, maxOccupied - Math.floor(containerWidth / NODE_WIDTH / 2))
      listRef.current.scrollToItem(targetIndex, 'start')
    }
  }, [maxOccupied, containerWidth])

  // Drag-to-scroll
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, scrollLeft: 0 })

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true
    const outer = (listRef.current as any)?._outerRef
    if (!outer) return
    dragStart.current = { x: e.clientX, scrollLeft: outer.scrollLeft }
    outer.style.cursor = 'grabbing'
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return
    const outer = (listRef.current as any)?._outerRef
    if (!outer) return
    const dx = e.clientX - dragStart.current.x
    outer.scrollLeft = dragStart.current.scrollLeft - dx
  }, [])

  const onMouseUp = useCallback(() => {
    isDragging.current = false
    const outer = (listRef.current as any)?._outerRef
    if (outer) outer.style.cursor = 'grab'
  }, [])

  const RailSlot = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const { lineNumber, artist } = slots[index]
    const isHovered = hoveredLine === lineNumber
    const isMilestone = LINE_MILESTONES.includes(lineNumber)
    const isGhost = !artist
    const isDualLine = artist && artist.allLineNumbers.length > 1 && artist.allLineNumbers[0] !== lineNumber

    return (
      <div style={style} className="flex flex-col items-center justify-center relative">
        {/* Milestone label above */}
        {isMilestone && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="font-mono text-[9px] text-line-accent tracking-widest">
              {lineNumber === 0 ? 'THE LINE' : lineNumber === LINE_MAX ? 'LINE 1000' : `LINE ${lineNumber}`}
            </span>
            <div className="w-px h-3 bg-line-accent mx-auto mt-1" />
          </div>
        )}

        {/* The node */}
        {artist ? (
          <Link href={`/artists/${artist.slug}`}>
            <div
              className="relative transition-all duration-200 ease-out cursor-pointer"
              style={{
                width: isHovered ? 80 : NODE_SIZE_REST,
                height: isHovered ? 106 : NODE_SIZE_REST,
              }}
              onMouseEnter={() => setHoveredLine(lineNumber)}
              onMouseLeave={() => setHoveredLine(null)}
            >
              {artist.galleryImage ? (
                <Image
                  src={artist.galleryImage}
                  alt={artist.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                  style={{
                    filter: isHovered ? 'brightness(1.1)' : 'brightness(0.75)',
                    transition: 'filter 150ms ease',
                  }}
                />
              ) : (
                <div className="w-full h-full bg-line-surface border border-line-border" />
              )}
              {/* Hover name label */}
              {isHovered && (
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-center pointer-events-none">
                  <p className="font-sans text-[10px] text-line-text truncate max-w-[100px]">
                    {artist.name}
                  </p>
                  <p className="font-mono text-[9px] text-line-accent tracking-wider">
                    LINE {lineNumber}
                  </p>
                </div>
              )}
              {/* Featured dot */}
              {artist.featured && !isHovered && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-line-accent" />
              )}
            </div>
          </Link>
        ) : (
          /* Ghost node */
          <div
            className="transition-all duration-200 ease-out"
            style={{ width: NODE_SIZE_REST, height: NODE_SIZE_REST }}
          >
            <div
              className="w-full h-full border border-dashed flex items-center justify-center"
              style={{ borderColor: '#2A2A2A' }}
            >
              {isMilestone && (
                <span className="font-mono text-[7px] text-line-muted tracking-widest">OPEN</span>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <section className="relative w-full overflow-hidden" style={{ height: 'var(--rail-height)' }}>
      {/* Background — The Line itself */}
      <div className="absolute inset-0 bg-line-bg" />

      {/* The gold horizontal rule — The Line */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: '50%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, #C8A96E 5%, #C8A96E 95%, transparent 100%)',
          transform: 'translateY(-50%)',
        }}
      />

      {/* Fading edges — left and right */}
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, #0A0A0A, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(-90deg, #0A0A0A, transparent)' }} />

      {/* Rail */}
      <div
        ref={containerRef}
        className="absolute inset-0 select-none"
        style={{ cursor: 'grab' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {containerWidth > 0 && (
          <List
            ref={listRef}
            layout="horizontal"
            height={RAIL_HEIGHT}
            width={containerWidth}
            itemCount={LINE_MAX}
            itemSize={NODE_WIDTH}
            style={{ overflow: 'auto', scrollbarWidth: 'none' }}
          >
            {RailSlot}
          </List>
        )}
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10 pointer-events-none">
        <p className="font-mono text-[10px] text-line-muted tracking-[0.2em] italic">
          {artists.length} artists · 1,000 positions · {LINE_MAX - maxOccupied - 1} remain
        </p>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 right-8 z-10 hidden md:flex items-center gap-2 opacity-40">
        <span className="font-mono text-[9px] text-line-muted tracking-widest">DRAG</span>
        <svg width="20" height="8" viewBox="0 0 20 8" fill="none">
          <line x1="0" y1="4" x2="18" y2="4" stroke="#666" strokeWidth="0.8"/>
          <polyline points="14,1 18,4 14,7" stroke="#666" strokeWidth="0.8" fill="none"/>
        </svg>
      </div>
    </section>
  )
}

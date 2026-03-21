// app/artists/[slug]/collectors/page.tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import artistsData from '@/data/artists.json'
import type { Artist } from '@/types'
import { NetworkCollectorsMap } from '@/components/NetworkCollectorsMap'

const artists = artistsData as Artist[]

export async function generateStaticParams() {
  // Only generate for artists who have NCM config
  return artists
    .filter(a => a.ncm)
    .map(a => ({ slug: a.slug }))
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params
  const artist = artists.find(a => a.slug === slug)
  if (!artist?.ncm) return {}
  return {
    title: `${artist.name} — Networked Collectors Map`,
    description: `Who collects ${artist.name}? Explore ${artist.ncm.stats.total_collectors.toLocaleString()} collectors across ${artist.ncm.collections.length} collections.`,
  }
}

export default async function CollectorsPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params
  const artist = artists.find(a => a.slug === slug)

  // 404 if artist doesn't exist or has no NCM config
  if (!artist || !artist.ncm) notFound()

  const { ncm } = artist

  return (
    // Full-screen layout — no site nav, pure canvas experience
    <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col">

      {/* Thin top bar — back link */}
      <div className="flex-none flex items-center justify-between px-7 h-11 border-b border-line-border/50 z-50">
        <Link
          href={`/artists/${slug}`}
          className="font-mono text-[9px] tracking-[0.3em] uppercase text-line-muted hover:text-line-accent transition-colors flex items-center gap-2"
        >
          ← {artist.name}
        </Link>
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-line-muted/40">
          Networked Collectors Map
        </span>
        <a
          href="https://theline.wtf"
          className="font-mono text-[9px] tracking-[0.25em] uppercase text-line-muted/30 hover:text-line-muted transition-colors"
        >
          The Line
        </a>
      </div>

      {/* Map — fills remaining height */}
      <div className="flex-1 relative">
        <NetworkCollectorsMap
          artistName={artist.name}
          accent={ncm.accent}
          collections={ncm.collections}
          stats={ncm.stats}
          collectorsUrl={`/ncm/${slug}.collectors.json`}
        />
      </div>
    </div>
  )
}

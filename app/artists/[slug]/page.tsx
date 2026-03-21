// app/artists/[slug]/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import artistsData from '@/data/artists.json'
import type { Artist } from '@/types'
import { CATEGORY_LABELS } from '@/types'
import { StickyIdentityBar } from '@/components/StickyIdentityBar'
import { CollectorStatsPanel } from '@/components/CollectorStatsPanel'
import { RecentWorksSection } from '@/components/RecentWorksSection'
import { LinePositionStrip } from '@/components/LinePositionStrip'
import { MembershipCTA } from '@/components/MembershipCTA'
import { IdentityBadge } from '@/components/IdentityBadge'
import { ArtistCard } from '@/components/ArtistCard'
import { RevealSection } from '@/components/RevealSection'
import { getBio } from '@/lib/bio'

const artists = artistsData as Artist[]

export async function generateStaticParams() {
  return artists.map(a => ({ slug: a.slug }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params
  const artist = artists.find(a => a.slug === slug)
  if (!artist) return {}
  return {
    title: `${artist.name} — The Line ${artist.allLineNumbers.join(', ')}`,
    description: artist.description ?? `${artist.name} is a ${CATEGORY_LABELS[artist.category] ?? artist.category} artist on The Line.`,
    openGraph: {
      images: artist.galleryImage ? [{ url: artist.galleryImage }] : [],
    },
  }
}



export default async function ArtistPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const artist = artists.find(a => a.slug === slug)
  if (!artist) notFound()

  const bio = await getBio(artist)
  const primaryLine = artist.allLineNumbers[0]

  // Related artists — same category, different artist
  const related = artists
    .filter(a => a.slug !== artist.slug && a.category === artist.category && a.galleryImage)
    .slice(0, 4)

  return (
    <div className="bg-line-bg">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative w-full" style={{ height: '100vh', minHeight: '600px' }}>
        {/* Full-bleed artwork */}
        {artist.galleryImage ? (
          <Image
            src={artist.heroImage ?? artist.galleryImage}
            alt={artist.name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-line-surface" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.2) 0%, transparent 40%, transparent 50%, rgba(10,10,10,0.92) 100%)' }}
        />

        {/* Name + line number — above Enter button on mobile, bottom-left on desktop */}
        <div className="absolute bottom-24 left-8 right-8 md:bottom-14 md:left-12 md:right-auto z-10">
          <p className="label mb-3">
            {artist.allLineNumbers.map((n, i) => (
              <span key={n}>
                {i > 0 && <span className="mx-2 text-line-border">·</span>}
                THE LINE {n}
              </span>
            ))}
            {' '}·{' '}
            {CATEGORY_LABELS[artist.category] ?? artist.category}
          </p>
          <h1 className="font-display font-light text-line-text"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', lineHeight: 1.0, letterSpacing: '-0.02em' }}>
            {artist.name}
          </h1>
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {artist.verified && (
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-line-accent" />
                <span className="font-mono text-[10px] text-line-muted tracking-widest uppercase">Verified Artist</span>
              </div>
            )}
            <IdentityBadge slug={artist.slug} />
          </div>
        </div>

        {/* Bottom-right: Enter The Line button — desktop only */}
        {artist.oncyberUrls.length > 0 && (
          <div className="hidden md:block absolute bottom-14 right-12 z-10">
            <a
              href={artist.oncyberUrls[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-xs"
            >
              Enter The Line {primaryLine} by {artist.name} →
            </a>
          </div>
        )}

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-scroll-hint">
          <div className="w-px h-12 mx-auto" style={{ background: 'linear-gradient(to bottom, transparent, #C8A96E)' }} />
        </div>
      </section>

      {/* ── Sticky Identity Bar ───────────────────────────────────────────── */}
      <StickyIdentityBar artist={artist} />

      {/* ── Bio + Stats ───────────────────────────────────────────────────── */}
      <RevealSection className="px-6 py-20 md:py-28">
        <div className="max-w-content mx-auto">
          <div className="grid md:grid-cols-5 gap-16 md:gap-20">

            {/* Bio — 3/5 width */}
            <div className="md:col-span-3">
              <p className="label mb-8">Artist</p>
              {bio ? (
                <div className="font-sans text-line-text leading-relaxed space-y-6"
                  style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)' }}>
                  {bio.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              ) : (
                <p className="font-sans text-line-muted leading-relaxed">
                  {artist.description ?? `${artist.name} is an artist on The Line.`}
                </p>
              )}

              {/* Social links */}
              <div className="flex flex-wrap gap-4 mt-10">
                {artist.xHandle && (
                  <div className="flex flex-col gap-1">
                    <a href={`https://x.com/${artist.xHandle.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer"
                      className="font-mono text-[11px] text-line-muted hover:text-line-accent transition-colors tracking-widest uppercase flex items-center gap-1.5">
                      𝕏 @{artist.xHandle.replace(/^@/, '')}
                    </a>

                  </div>
                )}
                {artist.purchaseUrl && (
                  <a href={artist.purchaseUrl} target="_blank" rel="noopener noreferrer"
                    className="font-mono text-[11px] text-line-muted hover:text-line-accent transition-colors tracking-widest uppercase">
                    View Collection →
                  </a>
                )}
                {artist.walletAddress && (
                  <span className="font-mono text-[11px] text-line-muted tracking-wider">
                    {artist.walletAddress.length > 20
                      ? `${artist.walletAddress.slice(0, 8)}…${artist.walletAddress.slice(-6)}`
                      : artist.walletAddress}
                  </span>
                )}
              </div>

              {/* NCM — Networked Collectors Map */}
              {artist.ncm && (
                <div className="mt-8 pt-8 border-t border-line-border">
                  <Link
                    href={`/artists/${artist.slug}/collectors`}
                    className="group inline-flex items-center gap-3 border border-line-border px-5 py-3.5 hover:border-line-accent transition-all"
                  >
                    <div className="flex gap-0.5 items-end">
                      {[8, 12, 16].map((h, i) => (
                        <div key={i} className="w-1 rounded-full bg-line-muted group-hover:bg-line-accent transition-colors"
                          style={{ height: `${h}px` }} />
                      ))}
                    </div>
                    <div>
                      <p className="font-mono text-[10px] tracking-widest uppercase text-line-text group-hover:text-line-accent transition-colors">
                        Networked Collectors Map
                      </p>
                      <p className="font-mono text-[9px] text-line-muted mt-0.5">
                        {artist.ncm.stats.total_collectors.toLocaleString()} collectors · {artist.ncm.collections.length} collections
                      </p>
                    </div>
                    <span className="ml-2 font-mono text-[11px] text-line-muted group-hover:text-line-accent transition-colors">→</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Stats — 2/5 width */}
            <div className="md:col-span-2">
              <p className="label mb-8">Collector Data</p>
              <CollectorStatsPanel artist={artist} />
            </div>
          </div>
        </div>
      </RevealSection>

      {/* ── Recent Works ──────────────────────────────────────────────────── */}
      {artist.walletAddress && (
        <RevealSection className="px-6 pb-24">
          <div className="max-w-content mx-auto">
            <div className="the-line mb-12" />
            <p className="label mb-10">Recent Works</p>
            <RecentWorksSection artist={artist} />
          </div>
        </RevealSection>
      )}

      {/* -- Storyline Articles -- */}
      {artist.storylineArticles && artist.storylineArticles.length > 0 && (
        <div className="border-t border-line-border pt-10 mt-10">
          <p className="label mb-5">Storyline Articles</p>
          <div className="flex flex-col gap-2">
            {(artist.storylineArticles as Array<{title: string; slug: string; type: string; date: string}>).map((article) => (
              <a
                key={article.slug}
                href={'/storyline/' + article.slug}
                className="group flex items-center justify-between gap-4 py-3 border-b border-line-border/40 hover:border-line-accent/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {article.type === 'feature' && (
                    <span className="font-mono text-[9px] text-line-accent tracking-widest shrink-0">FEATURE</span>
                  )}
                  {article.type === 'mention' && (
                    <span className="font-mono text-[9px] text-line-muted/50 tracking-widest shrink-0">MENTION</span>
                  )}
                  <span className="font-sans text-sm text-line-muted group-hover:text-line-text transition-colors truncate">
                    {article.title}
                  </span>
                </div>
                <span className="font-mono text-[9px] text-line-muted/50 tracking-widest shrink-0 group-hover:text-line-accent transition-colors">
                  {article.date} -&gt;
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* -- Curated Collections -- */}
      {artist.curations && artist.curations.length > 0 && (
        <RevealSection className="px-6 pb-16">
          <div className="max-w-content mx-auto">
            <div className="the-line mb-10" />
            <p className="label mb-6">Curated Collections</p>
            <div className="flex flex-wrap gap-2">
              {artist.curations.map(({ key, label, url }) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border border-line-border text-line-muted hover:border-line-accent hover:text-line-accent transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </RevealSection>
      )}

      {/* ── Line Position Strip ───────────────────────────────────────────── */}
      <RevealSection className="px-6 pb-24">
        <div className="max-w-content mx-auto">
          <div className="the-line mb-12" />
          <p className="label mb-10">
            {artist.allLineNumbers.length > 1 ? 'Their Lines' : 'Position on The Line'}
          </p>
          <LinePositionStrip artist={artist} allArtists={artists} />
        </div>
      </RevealSection>

      {/* ── The Gallery (oncyber) ─────────────────────────────────────────── */}
      <RevealSection className="pb-24">
        <div className="px-6 max-w-content mx-auto mb-6">
          <div className="the-line mb-12" />
          <p className="label">
            Enter The Line {primaryLine} by {artist.name}
          </p>
        </div>
        {artist.oncyberUrls.length > 0 && (
          <>
            {/* Desktop: iframe */}
            <div className="hidden md:block">
              <iframe
                src={artist.oncyberUrls[0]}
                title={`The Line ${primaryLine} by ${artist.name}`}
                className="oncyber-embed"
                allow="xr-spatial-tracking; gyroscope; accelerometer"
                allowFullScreen
              />
            </div>
            {/* Mobile: button */}
            <div className="md:hidden px-6">
              <a
                href={artist.oncyberUrls[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full justify-center py-4 text-center text-sm"
              >
                Enter The Gallery →
              </a>
            </div>
            {/* Multiple lines: show all */}
            {artist.oncyberUrls.length > 1 && (
              <div className="px-6 mt-4 flex flex-wrap gap-3 max-w-content mx-auto">
                {artist.oncyberUrls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                    className="font-mono text-[11px] text-line-muted hover:text-line-accent transition-colors tracking-widest uppercase border border-line-border px-3 py-1.5">
                    LINE {artist.allLineNumbers[i]} →
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </RevealSection>

      {/* ── Membership CTA ────────────────────────────────────────────────── */}
      <RevealSection className="px-6 pb-24">
        <div className="max-w-content mx-auto">
          <div className="the-line mb-12" />
          <MembershipCTA artist={artist} />
        </div>
      </RevealSection>

      {/* ── Related Artists ───────────────────────────────────────────────── */}
      {related.length > 0 && (
        <RevealSection className="px-6 pb-32">
          <div className="max-w-content mx-auto">
            <div className="the-line mb-12" />
            <div className="flex items-baseline justify-between mb-10">
              <p className="label">More {CATEGORY_LABELS[artist.category]} Artists</p>
              <Link href={`/artists?category=${artist.category}`}
                className="font-mono text-[11px] text-line-muted hover:text-line-accent transition-colors tracking-widest uppercase">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map(a => <ArtistCard key={a.slug} artist={a} />)}
            </div>
          </div>
        </RevealSection>
      )}
    </div>
  )
}

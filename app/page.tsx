// app/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { TheLineRail } from '@/components/TheLineRail'
import { ArtistCard } from '@/components/ArtistCard'
import { RevealSection } from '@/components/RevealSection'
import artistsData from '@/data/artists.json'
import postsData from '@/data/posts.json'
import type { Artist } from '@/types'
import { CATEGORY_LABELS } from '@/types'

const artists = artistsData as Artist[]

interface Post { title: string; slug: string; date: string; excerpt: string; featuredImage?: string; categories?: string[] }
const allPosts = postsData as Post[]
const latestPosts = [...allPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3)

const CATEGORY_IMAGES: Record<string, string> = {
  'lens-based':   '/images/categories/lens-based.jpg',
  'illustration': '/images/categories/illustration.jpg',
  'glitch':       '/images/categories/glitch.jpg',
  'ai':           '/images/categories/ai.jpg',
  'generative':   '/images/categories/generative.jpg',
  '3d':           '/images/categories/3d.jpg',
  'painting':     '/images/categories/painting.jpg',
}

const CATEGORY_COUNTS: Record<string, number> = {}
for (const a of artists) {
  CATEGORY_COUNTS[a.category] = (CATEGORY_COUNTS[a.category] || 0) + 1
}

// Get fresh lines (highest line numbers first, with images)
const freshLines = [...artists]
  .filter(a => a.galleryImage)
  .sort((a, b) => Math.max(...b.allLineNumbers) - Math.max(...a.allLineNumbers))
  .slice(0, 4)

// Featured artists for quotes
const QUOTES = [
  { text: "One of my favourite places to display art is The Line.", author: "Tylers Journey", line: 15 },
  { text: "The Line metaverse gallery is pretty dope when you've got six years of work.", author: "Robness", line: 193 },
  { text: "It really is the Matrix, but with art.", author: "Slowhed", line: 247 },
]

const MAIN_CATEGORIES = ['lens-based', 'illustration', 'glitch', 'ai', 'generative', '3d', 'painting']

export default function HomePage() {
  const maxLine = Math.max(...artists.flatMap(a => a.allLineNumbers))

  return (
    <div className="bg-line-bg">

      {/* ── Section 1: The Line Rail ──────────────────────────────────────── */}
      <div style={{ paddingTop: "var(--nav-height)" }}> {/* nav offset */}
        <TheLineRail artists={artists} />
      </div>

      {/* ── Section 2: The Gallery ────────────────────────────────────────── */}
      <RevealSection className="mt-12 md:mt-40 px-6">
        <div className="max-w-content mx-auto">

          {/* Full-width gallery exterior */}
          <div className="relative w-full overflow-hidden group" style={{ height: 'clamp(320px, 55vw, 640px)' }}>
            <Image
              src="/images/gallery/exterior.jpg"
              alt="The Line Gallery, Napier New Zealand"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.01]"
              priority
            />
            {/* Overlay */}
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(10,10,10,0.85))' }} />
            <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
              <p className="label text-line-accent mb-3">Physical Gallery</p>
              <h2 className="font-display font-light text-line-text"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', lineHeight: 1.05 }}>
                THE LINE GALLERY
              </h2>
              <p className="font-mono text-xs text-line-muted tracking-widest mt-2">
                318 HERETAUNGA STREET W · HASTINGS · NEW ZEALAND
              </p>
            </div>
          </div>

          {/* Three gallery sub-features */}
          <div className="grid md:grid-cols-3 gap-px mt-px bg-line-border">
            {/* Artist Retreats */}
            <div className="bg-line-bg p-8 md:p-10">
              <div className="flex items-start justify-between mb-6">
                <p className="label">Artist Retreats</p>
                <TokenBadge />
              </div>
              <p className="font-sans text-sm text-line-muted leading-relaxed">
                The Line Gallery sits in Napier, New Zealand — one of the world's most
                architecturally distinctive small cities. Coming here isn't a holiday.
                It's a deliberate step away from the feed, the screen, the constant
                noise of the market. Time and space to develop your practice without
                distraction: to think about what you're making, why, and where it's going next.
              </p>
              <Link href="/retreat"
                className="inline-flex items-center gap-2 font-mono text-[11px] text-line-accent tracking-widest uppercase mt-6 hover:gap-3 transition-all">
                Join waitlist
                <span>→</span>
              </Link>
            </div>

            {/* Screen Takeovers */}
            <div className="bg-line-bg p-8 md:p-10">
              <div className="flex items-start justify-between mb-6">
                <p className="label">Screen Takeovers</p>
                <TokenBadge />
              </div>
              <p className="font-sans text-sm text-line-muted leading-relaxed">
                The Line Gallery runs a programme of screen takeovers — dedicated
                periods where a single artist's work fills every screen in the space,
                24 hours a day. For a digital artist, this is genuine exhibition. Artists
                who participate can add The Line Gallery, Napier, New Zealand to their
                exhibition record. These aren't honorary listings — your work is in a
                physical gallery, being seen.
              </p>
              <Link href="/takeover"
                className="inline-flex items-center gap-2 font-mono text-[11px] text-line-accent tracking-widest uppercase mt-6 hover:gap-3 transition-all">
                Reserve spot
                <span>→</span>
              </Link>
            </div>

            {/* Current Exhibition */}
            <div className="bg-line-bg p-8 md:p-10">
              <p className="label mb-6">Current Exhibition</p>
              {/* YouTube embed */}
              <div className="relative w-full mb-4" style={{ aspectRatio: '16/9' }}>
                <iframe
                  src="https://www.youtube.com/embed/tBMgbXUv02A"
                  title="The Line Gallery — Current Exhibition"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 'none' }}
                />
              </div>
              <Link href="/gallery"
                className="inline-flex items-center gap-2 font-mono text-[11px] text-line-accent tracking-widest uppercase mt-2 hover:gap-3 transition-all">
                View gallery
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Gallery interior photo */}
          <div className="mt-px relative overflow-hidden" style={{ height: 'clamp(400px, 60vw, 800px)' }}>
            <Image
              src="/images/gallery/interior.jpg"
              alt="The Line Gallery opening night"
              fill
              className="object-cover"
              style={{ objectPosition: 'center 47%' }}
            />
            <div className="absolute inset-0"
              style={{ background: 'rgba(10,10,10,0.3)' }} />
          </div>
        </div>
      </RevealSection>

      {/* ── Section 3: Storyline ──────────────────────────────────────────── */}
      <RevealSection className="mt-12 md:mt-40 px-6">
        <div className="max-w-content mx-auto">
          <div className="flex items-baseline justify-between mb-12">
            <p className="label">Storyline</p>
            <Link href="/storyline"
              className="font-mono text-[11px] text-line-muted hover:text-line-accent transition-colors tracking-widest uppercase">
              All stories →
            </Link>
          </div>
          {/* Latest 3 articles from posts.json - always current */}
          <div className="grid md:grid-cols-3 gap-8">
            {latestPosts.map((article, i) => (
              <Link key={i} href={`/storyline/${article.slug}`} className="group">
                <div className="relative aspect-[4/3] overflow-hidden bg-line-surface mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={article.featuredImage || ''} alt={article.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-110 group-hover:scale-[1.02]" />
                </div>
                <p className="font-mono text-[10px] text-line-muted tracking-widest uppercase mb-2">
                  {new Date(article.date).toLocaleDateString('en-NZ', { month: 'short', year: 'numeric' })}
                </p>
                <h3 className="font-display font-light text-line-text text-xl mb-2 group-hover:text-line-hover transition-colors">
                  {article.title}
                </h3>
                <p className="font-sans text-xs text-line-muted leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ── Section 4: Fresh Lines ────────────────────────────────────────── */}
      <RevealSection className="mt-12 md:mt-40 px-6">
        <div className="max-w-content mx-auto">
          <div className="flex items-baseline justify-between mb-12">
            <div>
              <p className="label mb-1">Hot Lines</p>
              <p className="font-sans text-xs text-line-muted">Put your hippocampus into overdrive</p>
            </div>
            <Link href="/artists?sort=recent"
              className="font-mono text-[11px] text-line-muted hover:text-line-accent transition-colors tracking-widest uppercase">
              All artists →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {freshLines.map(artist => (
              <ArtistCard key={artist.slug} artist={artist} />
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ── Section 5: By Medium ──────────────────────────────────────────── */}
      <RevealSection className="mt-12 md:mt-40 px-6">
        <div className="max-w-content mx-auto">
          <p className="label mb-12">By Medium</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-px bg-line-border">
            {MAIN_CATEGORIES.map(cat => {
              const count = CATEGORY_COUNTS[cat] || 0
              // Find a representative artist image for this category
              const repArtist = artists.find(a => a.category === cat && a.galleryImage && a.featured)
                ?? artists.find(a => a.category === cat && a.galleryImage)
              return (
                <Link key={cat} href={`/artists?category=${cat}`}
                  className="group relative bg-line-bg overflow-hidden"
                  style={{ aspectRatio: '2/3' }}>
                  {repArtist?.galleryImage && (
                    <Image
                      src={repArtist.galleryImage}
                      alt={CATEGORY_LABELS[cat]}
                      fill
                      sizes="200px"
                      className="object-cover transition-all duration-500 group-hover:brightness-90 group-hover:scale-[1.03]"
                      style={{ filter: 'brightness(0.5)' }}
                    />
                  )}
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <p className="font-display font-light text-line-text group-hover:text-line-hover transition-colors"
                      style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)', lineHeight: 1.2 }}>
                      {CATEGORY_LABELS[cat]}
                    </p>
                    <p className="font-mono text-[9px] text-line-muted tracking-wider mt-1">
                      {count} artists
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </RevealSection>

      {/* ── Section 6: Pull Quotes ────────────────────────────────────────── */}
      <RevealSection className="mt-32 md:mt-48">
        {QUOTES.map((q, i) => (
          <div key={i} className={`py-16 md:py-20 px-8 border-t border-line-border ${i === QUOTES.length - 1 ? 'border-b' : ''}`}>
            <div className="max-w-4xl mx-auto text-center">
              <p className="font-display font-light text-line-text"
                style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.8rem)', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                "{q.text}"
              </p>
              <p className="font-mono text-xs text-line-muted tracking-widest uppercase mt-6">
                {q.author} · The Line {q.line}
              </p>
            </div>
          </div>
        ))}
      </RevealSection>

      {/* ── Section 7: The Line Outro ─────────────────────────────────────── */}
      <RevealSection className="mt-24 md:mt-40 px-6 pb-32">
        <div className="max-w-content mx-auto text-center">
          <div className="the-line mx-auto mb-16" style={{ maxWidth: '200px' }} />
          <p className="font-mono text-[11px] text-line-muted tracking-[0.3em] uppercase mb-6">
            The Line
          </p>
          <div className="flex items-baseline justify-center gap-3">
            <span className="font-display font-light text-line-accent"
              style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', lineHeight: 1, letterSpacing: '-0.03em' }}>
              {artists.length}
            </span>
            <span className="font-display font-light text-line-muted"
              style={{ fontSize: 'clamp(2rem, 6vw, 5rem)', lineHeight: 1 }}>
              / 1,000
            </span>
          </div>
          <p className="font-mono text-xs text-line-muted tracking-widest mt-4">
            {1000 - maxLine - 1} positions remain on The Line
          </p>
          <div className="mt-12">
            <Link href="/membership" className="btn-primary text-sm">
              Apply for The Line
            </Link>
          </div>
        </div>
      </RevealSection>

    </div>
  )
}

function TokenBadge() {
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <div className="w-2 h-2 rounded-full bg-line-accent" />
      <span className="font-mono text-[9px] text-line-muted tracking-widest">TOKEN</span>
    </div>
  )
}

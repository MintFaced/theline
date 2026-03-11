// app/storyline/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { RevealSection } from '@/components/RevealSection'

export const metadata: Metadata = {
  title: 'Storyline — The Line',
  description: 'Editorial writing about cryptoart, The Line, and the artists who occupy it.',
}

// Placeholder articles — replace with MDX/CMS content when ready
const ARTICLES = [
  {
    slug: 'what-is-the-line',
    title: 'What Is The Line?',
    excerpt: 'A 1,000-metre wall. A permanent physical institution for cryptoart. The story of how The Line came to exist in Hawke\'s Bay, New Zealand.',
    date: '2026-02-01',
    category: 'About',
    readTime: '6 min',
  },
  {
    slug: 'the-first-hundred',
    title: 'The First Hundred',
    excerpt: 'The artists who occupy positions 0–99 on The Line represent a cross-section of cryptoart\'s early history. We look at who they are and what they made.',
    date: '2026-01-15',
    category: 'Artists',
    readTime: '8 min',
  },
  {
    slug: 'collecting-on-chain',
    title: 'Collecting On-Chain: A Guide for New Collectors',
    excerpt: 'Everything you need to know about owning a piece of cryptoart — wallets, marketplaces, provenance, and why on-chain ownership changes everything.',
    date: '2025-12-10',
    category: 'Collecting',
    readTime: '10 min',
  },
  {
    slug: 'tezos-on-the-line',
    title: 'Tezos on The Line',
    excerpt: 'Nearly 40% of Line Artists work on Tezos — a chain with a distinct culture, lower barriers to entry, and a commitment to experimental practice.',
    date: '2025-11-20',
    category: 'Ecosystem',
    readTime: '7 min',
  },
  {
    slug: 'the-gallery-space',
    title: 'Inside the Gallery Space',
    excerpt: 'A physical walk through the building at 318 Heretaunga Street West. What does it feel like to stand in front of a wall that stretches to 1,000?',
    date: '2025-10-05',
    category: 'Gallery',
    readTime: '5 min',
  },
  {
    slug: 'ai-and-the-line',
    title: 'AI Art and The Line',
    excerpt: 'AI artists now make up a significant portion of The Line\'s roster. What does this mean for the institution, and how does the work hold up?',
    date: '2025-09-18',
    category: 'Medium',
    readTime: '9 min',
  },
]

const FEATURED = ARTICLES[0]
const REST = ARTICLES.slice(1)

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function StorylinePage() {
  return (
    <div className="bg-line-bg min-h-screen" style={{ paddingTop: 'var(--nav-height)' }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-line-border">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <p className="label mb-4">Storyline</p>
          <h1 className="font-display font-light text-5xl md:text-7xl text-line-text mb-6" style={{ letterSpacing: '-0.03em' }}>
            Writing from<br />The Line
          </h1>
          <p className="font-sans text-sm text-line-muted max-w-md leading-relaxed">
            Essays, profiles, and dispatches from inside one of the world's most unusual art institutions.
          </p>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6">

        {/* ── Featured article ────────────────────────────────────────────── */}
        <RevealSection className="py-16 md:py-24 border-b border-line-border">
          <Link href={`/storyline/${FEATURED.slug}`} className="group block md:grid md:grid-cols-2 md:gap-16 items-end">
            {/* Image placeholder */}
            <div
              className="relative w-full bg-line-surface mb-8 md:mb-0 overflow-hidden"
              style={{ aspectRatio: '4/3' }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-[10px] text-line-muted tracking-widest">IMAGE COMING</span>
              </div>
              <div className="absolute inset-0 bg-line-accent/5 group-hover:bg-line-accent/10 transition-colors duration-500" />
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="label">{FEATURED.category}</span>
                <span className="font-mono text-[10px] text-line-muted tracking-widest">{FEATURED.readTime} read</span>
              </div>
              <h2 className="font-display font-light text-4xl md:text-5xl text-line-text mb-6 group-hover:text-line-accent transition-colors duration-300" style={{ letterSpacing: '-0.02em' }}>
                {FEATURED.title}
              </h2>
              <p className="font-sans text-sm text-line-muted leading-relaxed mb-8">
                {FEATURED.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-line-muted tracking-widest">{formatDate(FEATURED.date)}</span>
                <span className="font-mono text-[10px] text-line-accent tracking-widest group-hover:translate-x-1 transition-transform duration-200 inline-block">
                  Read →
                </span>
              </div>
            </div>
          </Link>
        </RevealSection>

        {/* ── Article grid ────────────────────────────────────────────────── */}
        <RevealSection className="py-16 md:py-24">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-line-border">
            {REST.map(article => (
              <Link
                key={article.slug}
                href={`/storyline/${article.slug}`}
                className="group bg-line-bg p-8 block hover:bg-line-surface transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="label">{article.category}</span>
                  <span className="font-mono text-[10px] text-line-muted tracking-widest">{article.readTime}</span>
                </div>
                <h3 className="font-display font-light text-2xl text-line-text mb-4 group-hover:text-line-accent transition-colors duration-200" style={{ letterSpacing: '-0.01em' }}>
                  {article.title}
                </h3>
                <p className="font-sans text-xs text-line-muted leading-relaxed mb-8">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-line-muted tracking-widest">{formatDate(article.date)}</span>
                  <span className="font-mono text-[10px] text-line-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200">→</span>
                </div>
              </Link>
            ))}
          </div>
        </RevealSection>

      </div>
    </div>
  )
}

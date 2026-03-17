// app/storyline/page.tsx
'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { RevealSection } from '@/components/RevealSection'
import postsData from '@/data/posts.json'

const posts = postsData as any[]

// Top tags to surface — rest hidden behind "More"
const TOP_TAGS = ['Photography', 'News On The Line', 'Illustration', '1/1', 'Generative', 'AI', 'Artist Features']

// Normalise tags for comparison
function normTag(t: string) { return t.toLowerCase().trim() }

export default function StorylinePage() {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [showMoreTags, setShowMoreTags] = useState(false)

  // Build all tags with counts
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of posts) {
      for (const c of p.categories ?? []) {
        const key = c.trim()
        counts[key] = (counts[key] || 0) + 1
      }
    }
    return counts
  }, [])

  // All tags sorted by count
  const allTags = useMemo(() =>
    Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)
  , [tagCounts])

  // Tags not in top list
  const moreTags = allTags.filter(t => !TOP_TAGS.some(top => normTag(top) === normTag(t)))

  // Filter posts by active tag
  const filtered = useMemo(() => {
    if (!activeTag) return posts
    return posts.filter(p =>
      (p.categories ?? []).some((c: string) => normTag(c) === normTag(activeTag))
    )
  }, [activeTag])

  const featured = filtered[0]
  const next2    = filtered.slice(1, 3)
  const grid6    = filtered.slice(3, 9)
  const next11   = filtered.slice(9, 20)
  const archive  = filtered.slice(20)

  return (
    <div className="bg-line-bg min-h-screen" style={{ paddingTop: 'var(--nav-height)' }}>

      {/* ── Header ── */}
      <div className="border-b border-line-border px-6 py-16 md:py-20 max-w-content mx-auto">
        <p className="label mb-4">Storyline</p>
        <div className="flex items-end justify-between gap-6 mb-10">
          <h1 className="font-display font-light text-5xl md:text-7xl text-line-text" style={{ letterSpacing: '-0.03em', lineHeight: 1 }}>
            The Line<br />in words
          </h1>
          <p className="font-sans text-sm text-line-muted max-w-xs leading-relaxed hidden md:block">
            Artist features, exhibition dispatches, and essays on art, ownership, and the blockchain.
          </p>
        </div>

        {/* ── Tag navigation ── */}
        <div className="flex flex-wrap items-center gap-2">
          {/* All */}
          <button
            onClick={() => setActiveTag(null)}
            className={`font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-colors ${
              !activeTag
                ? 'border-line-accent text-line-accent'
                : 'border-line-border text-line-muted hover:border-line-muted hover:text-line-text'
            }`}
          >
            All · {posts.length}
          </button>

          {/* Top tags */}
          {TOP_TAGS.filter(t => tagCounts[t] || allTags.some(a => normTag(a) === normTag(t))).map(tag => {
            const realTag = allTags.find(a => normTag(a) === normTag(tag)) ?? tag
            const count = tagCounts[realTag] ?? 0
            if (!count) return null
            return (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === realTag ? null : realTag)}
                className={`font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-colors ${
                  activeTag === realTag
                    ? 'border-line-accent text-line-accent'
                    : 'border-line-border text-line-muted hover:border-line-muted hover:text-line-text'
                }`}
              >
                {tag} · {count}
              </button>
            )
          })}

          {/* More toggle */}
          {moreTags.length > 0 && (
            <button
              onClick={() => setShowMoreTags(!showMoreTags)}
              className="font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border border-line-border text-line-muted/50 hover:text-line-muted hover:border-line-muted transition-colors"
            >
              {showMoreTags ? 'Less ↑' : `More ↓`}
            </button>
          )}

          {/* Hidden tags */}
          {showMoreTags && moreTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-colors ${
                activeTag === tag
                  ? 'border-line-accent text-line-accent'
                  : 'border-line-border/50 text-line-muted/50 hover:border-line-muted hover:text-line-muted'
              }`}
            >
              {tag} · {tagCounts[tag]}
            </button>
          ))}
        </div>

        {/* Active filter label */}
        {activeTag && (
          <p className="font-mono text-[10px] text-line-muted tracking-widest mt-4">
            {filtered.length} article{filtered.length !== 1 ? 's' : ''} tagged <span className="text-line-accent">{activeTag}</span>
            <button onClick={() => setActiveTag(null)} className="ml-3 hover:text-line-text transition-colors">× clear</button>
          </p>
        )}
      </div>

      {/* ── Featured + 2 side ── */}
      {featured && (
        <RevealSection className="border-b border-line-border">
          <div className="grid md:grid-cols-3 gap-px bg-line-border">
            <Link href={`/storyline/${featured.slug}`} className="md:col-span-2 block group relative overflow-hidden bg-line-surface" style={{ minHeight: '480px' }}>
              {featured.featuredImage && (
                <img src={featured.featuredImage} alt={featured.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              )}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, transparent 60%)' }} />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                <span className="label text-line-accent mb-3 inline-block">Featured</span>
                <h2 className="font-display font-light text-2xl md:text-3xl text-line-text group-hover:text-line-accent transition-colors mb-3" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  {featured.title}
                </h2>
                <p className="font-sans text-xs text-line-muted leading-relaxed line-clamp-2 mb-3">{featured.excerpt}</p>
                <span className="font-mono text-[10px] text-line-muted tracking-widest">{featured.date} · {featured.readTime} min</span>
              </div>
            </Link>
            <div className="flex flex-col gap-px bg-line-border">
              {next2.map((post: any) => (
                <Link key={post.slug} href={`/storyline/${post.slug}`} className="bg-line-surface group flex flex-col flex-1 overflow-hidden relative" style={{ minHeight: '235px' }}>
                  {post.featuredImage && (
                    <img src={post.featuredImage} alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04] opacity-40" />
                  )}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, transparent 50%)' }} />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="font-mono text-[9px] text-line-muted tracking-widest mb-2">{post.date}</p>
                    <h3 className="font-display font-light text-lg text-line-text group-hover:text-line-accent transition-colors leading-snug" style={{ letterSpacing: '-0.01em' }}>
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </RevealSection>
      )}

      {/* ── Grid of 6 ── */}
      {grid6.length > 0 && (
        <RevealSection className="border-b border-line-border">
          <div className="grid md:grid-cols-3 gap-px bg-line-border">
            {grid6.map((post: any) => (
              <Link key={post.slug} href={`/storyline/${post.slug}`} className="bg-line-bg group block hover:bg-line-surface transition-colors">
                <div className="relative overflow-hidden bg-line-surface" style={{ aspectRatio: '16/9' }}>
                  {post.featuredImage && (
                    <img src={post.featuredImage} alt={post.title} loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    {post.categories.slice(0,1).map((c: string) => (
                      <span key={c} className="label" style={{ fontSize: '9px' }}>{c}</span>
                    ))}
                    <span className="font-mono text-[9px] text-line-muted tracking-widest">{post.readTime} min</span>
                  </div>
                  <h3 className="font-display font-light text-lg text-line-text group-hover:text-line-accent transition-colors mb-2 leading-snug" style={{ letterSpacing: '-0.01em' }}>
                    {post.title}
                  </h3>
                  <p className="font-sans text-xs text-line-muted leading-relaxed line-clamp-2 mb-3">{post.excerpt}</p>
                  <span className="font-mono text-[10px] text-line-muted tracking-widest">{post.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </RevealSection>
      )}

      {/* ── Next 11 compact ── */}
      {next11.length > 0 && (
        <RevealSection className="border-b border-line-border">
          <div className="grid md:grid-cols-2 gap-px bg-line-border">
            {next11.map((post: any) => (
              <Link key={post.slug} href={`/storyline/${post.slug}`}
                className="bg-line-bg group flex gap-5 p-6 hover:bg-line-surface transition-colors border-b border-line-border">
                <div className="w-24 h-16 shrink-0 bg-line-surface overflow-hidden">
                  {post.featuredImage && (
                    <img src={post.featuredImage} alt={post.title} loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  )}
                </div>
                <div className="min-w-0 flex flex-col justify-center">
                  <p className="font-mono text-[9px] text-line-muted tracking-widest mb-1">{post.date} · {post.readTime} min</p>
                  <h3 className="font-display font-light text-base text-line-text group-hover:text-line-accent transition-colors leading-snug" style={{ letterSpacing: '-0.01em' }}>
                    {post.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </RevealSection>
      )}

      {/* ── Subscribe ── */}
      <RevealSection className="border-t border-line-border">
        <div className="max-w-content mx-auto grid md:grid-cols-2 gap-px bg-line-border">
          <div className="bg-line-bg px-6 md:px-16 py-16 md:py-20">
            <p className="label mb-6">Storyline · The Newsletter</p>
            <h2 className="font-display font-light text-4xl md:text-5xl text-line-text mb-6" style={{ letterSpacing: '-0.03em', lineHeight: 1.05 }}>
              Tokenized art<br />in your inbox
            </h2>
            <div className="space-y-4 font-sans text-sm text-line-muted leading-relaxed max-w-sm">
              <p>Artist features, new works, and essays on what's happening at the intersection of art, ownership, and the blockchain — direct from The Line.</p>
              <p>No algorithm. No noise. Just the artists and stories that matter.</p>
            </div>
          </div>
          <div className="bg-line-surface px-6 md:px-16 py-16 md:py-20 flex flex-col justify-center">
            <p className="font-mono text-[10px] text-line-muted tracking-widest uppercase mb-2">Free · No spam · Unsubscribe anytime</p>
            <p className="font-display font-light text-2xl text-line-text mb-8" style={{ letterSpacing: '-0.02em' }}>
              Subscribe to Storyline
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement)?.value
                window.open('https://linestories.substack.com/subscribe?email=' + encodeURIComponent(email), '_blank')
              }}
              className="flex flex-col gap-3 mt-2"
            >
              <input type="email" name="email" placeholder="your@email.com" required
                className="w-full bg-line-bg border border-line-border px-4 py-3 font-mono text-sm text-line-text placeholder:text-line-muted focus:outline-none focus:border-line-accent transition-colors" />
              <button type="submit" className="btn-primary w-full text-center">Join on Substack</button>
            </form>
            <p className="font-mono text-[9px] text-line-muted tracking-widest mt-6">
              Published on{' '}
              <a href="https://linestories.substack.com" target="_blank" rel="noopener noreferrer" className="text-line-accent hover:opacity-70 transition-opacity">
                linestories.substack.com
              </a>
            </p>
          </div>
        </div>
      </RevealSection>

      {/* ── Archive ── */}
      {archive.length > 0 && (
        <RevealSection className="max-w-content mx-auto px-6 py-16">
          <div className="flex items-baseline justify-between mb-8">
            <p className="label">Archive · {archive.length} more articles</p>
            <span className="font-mono text-[10px] text-line-muted tracking-widest">{filtered.length} total</span>
          </div>
          <div className="divide-y divide-line-border">
            {archive.map((post: any) => (
              <Link key={post.slug} href={`/storyline/${post.slug}`}
                className="group flex items-baseline justify-between gap-4 py-3 hover:text-line-accent transition-colors">
                <h3 className="font-display font-light text-sm text-line-text group-hover:text-line-accent transition-colors leading-snug" style={{ letterSpacing: '-0.01em' }}>
                  {post.title}
                </h3>
                <span className="font-mono text-[9px] text-line-muted tracking-widest shrink-0">{post.date}</span>
              </Link>
            ))}
          </div>
        </RevealSection>
      )}

    </div>
  )
}

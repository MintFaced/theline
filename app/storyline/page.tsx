// app/storyline/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { RevealSection } from '@/components/RevealSection'
import posts from '@/data/posts.json'

export const metadata: Metadata = {
  title: 'Storyline — The Line',
  description: 'Articles, artist features, and news from The Line.',
}

export default function StorylinePage() {
  const featured = posts[0]
  const next2 = posts.slice(1, 3)
  const grid6 = posts.slice(3, 9)
  const next11 = posts.slice(9, 20)
  const archive = posts.slice(20)

  return (
    <div className="bg-line-bg min-h-screen" style={{ paddingTop: 'var(--nav-height)' }}>

      {/* ── Header ── */}
      <div className="border-b border-line-border px-6 py-16 md:py-20 max-w-content mx-auto">
        <p className="label mb-4">Storyline</p>
        <div className="flex items-end justify-between gap-6">
          <h1 className="font-display font-light text-5xl md:text-7xl text-line-text" style={{ letterSpacing: '-0.03em', lineHeight: 1 }}>
            The Line<br />in words
          </h1>
          <p className="font-sans text-sm text-line-muted max-w-xs leading-relaxed hidden md:block">
            Artist features, exhibition dispatches, and essays on art, ownership, and the blockchain.
          </p>
        </div>
      </div>

      {/* ── Featured + 2 side ── */}
      <RevealSection className="border-b border-line-border">
        <div className="grid md:grid-cols-3 gap-px bg-line-border">

          {/* Big featured */}
          <Link href={`/storyline/${featured.slug}`} className="md:col-span-2 block group relative overflow-hidden bg-line-surface" style={{ minHeight: '480px' }}>
            {featured.featuredImage && (
              // eslint-disable-next-line @next/next/no-img-element
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

          {/* 2 stacked beside */}
          <div className="flex flex-col gap-px bg-line-border">
            {next2.map((post: any) => (
              <Link key={post.slug} href={`/storyline/${post.slug}`} className="bg-line-surface group flex flex-col flex-1 overflow-hidden relative" style={{ minHeight: '235px' }}>
                {post.featuredImage && (
                  // eslint-disable-next-line @next/next/no-img-element
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

      {/* ── Grid of 6 ── */}
      <RevealSection className="border-b border-line-border">
        <div className="grid md:grid-cols-3 gap-px bg-line-border">
          {grid6.map((post: any) => (
            <Link key={post.slug} href={`/storyline/${post.slug}`} className="bg-line-bg group block hover:bg-line-surface transition-colors">
              <div className="relative overflow-hidden bg-line-surface" style={{ aspectRatio: '16/9' }}>
                {post.featuredImage && (
                  // eslint-disable-next-line @next/next/no-img-element
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

      {/* ── Next 11 as compact cards (2 col) ── */}
      <RevealSection className="border-b border-line-border">
        <div className="grid md:grid-cols-2 gap-px bg-line-border">
          {next11.map((post: any) => (
            <Link key={post.slug} href={`/storyline/${post.slug}`}
              className="bg-line-bg group flex gap-5 p-6 hover:bg-line-surface transition-colors border-b border-line-border">
              <div className="w-24 h-16 shrink-0 bg-line-surface overflow-hidden">
                {post.featuredImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.featuredImage} alt={post.title} loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                )}
              </div>
              <div className="min-w-0 flex flex-col justify-center">
                <p className="font-mono text-[9px] text-line-muted tracking-widest mb-1">{post.date} · {post.readTime} min</p>
                <h3 className="font-display font-light text-base text-line-text group-hover:text-line-accent transition-colors leading-snug" style={{ letterSpacing: '-0.01em' }}>
                  {post.title}
                </h3>
                <p className="font-sans text-xs text-line-muted leading-relaxed line-clamp-1 mt-1">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </RevealSection>

      {/* ── Archive ── */}
      <RevealSection className="max-w-content mx-auto px-6 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <p className="label">Archive · {archive.length} more articles</p>
          <span className="font-mono text-[10px] text-line-muted tracking-widest">{posts.length} total</span>
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

    </div>
  )
}

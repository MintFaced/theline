// app/storyline/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { RevealSection } from '@/components/RevealSection'
import posts from '@/data/posts.json'

export const metadata: Metadata = {
  title: 'Storyline — The Line',
  description: 'Articles, artist features, and news from The Line — the world\'s first cryptoart museum directory.',
}

const CATS = ['All', 'Photography', 'Illustration', 'AI', 'Generative', 'News On The Line', 'MintFace']

export default function StorylinePage() {
  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <div className="bg-line-bg min-h-screen" style={{ paddingTop: 'var(--nav-height)' }}>

      {/* ── Header ── */}
      <div className="border-b border-line-border px-6 py-16 md:py-24 max-w-content mx-auto">
        <p className="label mb-4">Storyline</p>
        <h1 className="font-display font-light text-5xl md:text-7xl text-line-text" style={{ letterSpacing: '-0.03em', lineHeight: 1 }}>
          The Line<br />in words
        </h1>
        <p className="font-sans text-sm text-line-muted mt-6 max-w-md leading-relaxed">
          Artist features, exhibition dispatches, and essays on the intersection of art, ownership, and the blockchain.
        </p>
      </div>

      {/* ── Featured article ── */}
      <RevealSection className="border-b border-line-border">
        <Link href={`/storyline/${featured.slug}`} className="block group">
          <div className="grid md:grid-cols-2 gap-px bg-line-border">
            <div className="relative overflow-hidden" style={{ minHeight: '400px' }}>
              {featured.featuredImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featured.featuredImage}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  style={{ position: 'absolute', inset: 0 }}
                />
              ) : (
                <div className="absolute inset-0 bg-line-surface" />
              )}
            </div>
            <div className="bg-line-bg p-10 md:p-14 flex flex-col justify-end">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="label text-line-accent">Featured</span>
                {featured.categories.slice(0, 1).map((c: string) => (
                  <span key={c} className="label">{c}</span>
                ))}
              </div>
              <h2 className="font-display font-light text-3xl md:text-4xl text-line-text mb-4 group-hover:text-line-accent transition-colors" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                {featured.title}
              </h2>
              <p className="font-sans text-sm text-line-muted leading-relaxed mb-6 line-clamp-3">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-line-muted tracking-widest">{featured.date}</span>
                <span className="text-line-border">·</span>
                <span className="font-mono text-xs text-line-muted tracking-widest">{featured.readTime} min read</span>
              </div>
            </div>
          </div>
        </Link>
      </RevealSection>

      {/* ── Article grid ── */}
      <div className="max-w-content mx-auto px-6">
        <RevealSection className="py-16 md:py-20">
          <div className="grid md:grid-cols-3 gap-px bg-line-border mb-px">
            {rest.map((post: any) => (
              <Link
                key={post.slug}
                href={`/storyline/${post.slug}`}
                className="bg-line-bg group block hover:bg-line-surface transition-colors"
              >
                {post.featuredImage && (
                  <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                )}
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {post.categories.slice(0, 1).map((c: string) => (
                      <span key={c} className="label" style={{ fontSize: '9px' }}>{c}</span>
                    ))}
                    <span className="font-mono text-[9px] text-line-muted tracking-widest">{post.readTime} min</span>
                  </div>
                  <h3 className="font-display font-light text-xl text-line-text group-hover:text-line-accent transition-colors mb-3 leading-snug" style={{ letterSpacing: '-0.01em' }}>
                    {post.title}
                  </h3>
                  <p className="font-sans text-xs text-line-muted leading-relaxed line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  <span className="font-mono text-[10px] text-line-muted tracking-widest">{post.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </RevealSection>
      </div>

    </div>
  )
}

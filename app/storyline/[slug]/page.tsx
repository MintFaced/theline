// app/storyline/[slug]/page.tsx
import type { Metadata } from 'next'
import { SubstackForm } from '@/components/SubstackForm'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { promises as fs } from 'fs'
import path from 'path'
import posts from '@/data/posts.json'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return posts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = posts.find(p => p.slug === slug)
  if (!post) return {}
  return {
    title: `${post.title} — The Line Storyline`,
    description: post.excerpt,
    openGraph: { images: post.featuredImage ? [post.featuredImage] : [] },
  }
}

async function getContent(slug: string): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'content', 'storyline', `${slug}.json`)
    const raw = await fs.readFile(filePath, 'utf-8')
    const { content } = JSON.parse(raw)
    return cleanContent(content)
  } catch {
    return '<p>Content not available.</p>'
  }
}

function cleanContent(html: string) {
  return html
    .replace(/\s+srcset="[^"]*"/g, '')
    .replace(/\s+sizes="[^"]*"/g, '')
    .replace(/\s+width="\d+"/g, '')
    .replace(/\s+height="\d+"/g, '')
    .replace(/<img /g, '<img loading="lazy" class="storyline-img" ')
    .replace(/<p>\s*(&nbsp;)?\s*<\/p>/g, '')
    .replace(/\t+/g, ' ')
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const meta = posts.find(p => p.slug === slug)
  if (!meta) notFound()

  const content = await getContent(slug)

  const dateFormatted = new Date(meta.date).toLocaleDateString('en-NZ', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  const related = posts
    .filter(p => p.slug !== meta.slug && p.categories.some((c: string) => meta.categories.includes(c)))
    .slice(0, 3)

  return (
    <div className="bg-line-bg min-h-screen" style={{ paddingTop: 'var(--nav-height)' }}>

      {/* ── Hero ── */}
      {meta.featuredImage && (
        <div className="relative w-full overflow-hidden" style={{ height: 'clamp(360px, 50vw, 620px)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={meta.featuredImage}
            alt={meta.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.3) 55%, transparent 100%)' }} />
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 md:px-12 md:pb-14">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {meta.categories.slice(0, 2).map((cat: string) => (
                <span key={cat} className="label">{cat}</span>
              ))}
              <span className="font-mono text-[10px] text-line-muted tracking-widest">{meta.readTime} min read</span>
            </div>
            <h1 className="font-display font-light text-line-text max-w-3xl" style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {meta.title}
            </h1>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">

        {!meta.featuredImage && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {meta.categories.slice(0, 2).map((cat: string) => (
                <span key={cat} className="label">{cat}</span>
              ))}
            </div>
            <h1 className="font-display font-light text-4xl md:text-5xl text-line-text mb-4" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {meta.title}
            </h1>
          </div>
        )}

        <div className="flex items-center gap-4 mb-12 pb-8 border-b border-line-border">
          <span className="font-mono text-xs text-line-muted tracking-widest">{dateFormatted}</span>
          <span className="text-line-border font-mono">·</span>
          <span className="font-mono text-xs text-line-muted tracking-widest">{meta.readTime} min read</span>
        </div>

        {/* ── Article body ── */}
        <article
          className="storyline-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* ── Footer nav ── */}
        <div className="mt-16 pt-12 border-t border-line-border">
          <Link href="/storyline" className="font-mono text-xs text-line-muted tracking-widest hover:text-line-accent transition-colors">
            ← All Articles
          </Link>

          {related.length > 0 && (
            <div className="mt-12">
              <p className="label mb-6">Related Articles</p>
              <div className="grid md:grid-cols-3 gap-px bg-line-border">
                {related.map((r: any) => (
                  <Link key={r.slug} href={`/storyline/${r.slug}`} className="bg-line-bg p-6 group block hover:bg-line-surface transition-colors">
                    {r.featuredImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.featuredImage} alt={r.title} className="w-full aspect-video object-cover mb-4" loading="lazy" />
                    )}
                    <p className="font-mono text-[10px] text-line-muted tracking-widest mb-2">{r.date}</p>
                    <h3 className="font-display font-light text-base text-line-text group-hover:text-line-accent transition-colors leading-snug" style={{ letterSpacing: '-0.01em' }}>
                      {r.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ── Subscribe ── */}
      <div className="border-t border-line-border mt-16">
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <p className="label mb-4">Storyline · The Newsletter</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-line-text mb-4" style={{ letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Tokenized art in your inbox
          </h2>
          <p className="font-sans text-sm text-line-muted mb-8 max-w-sm mx-auto">
            Artist features, new works, and essays on cryptoart — direct from The Line. Free, no spam.
          </p>
          <SubstackForm />
        </div>
      </div>

      <style>{`
        .storyline-content { color: #A0998F; font-size: 0.9375rem; line-height: 1.8; }
        .storyline-content h1,.storyline-content h2,.storyline-content h3,.storyline-content h4 {
          font-family: var(--font-display); font-weight: 300; color: #F0EDE6;
          letter-spacing: -0.02em; margin: 2.5rem 0 1rem; line-height: 1.15;
        }
        .storyline-content h1 { font-size: clamp(1.6rem,3vw,2.2rem); }
        .storyline-content h2 { font-size: clamp(1.3rem,2.5vw,1.8rem); }
        .storyline-content h3 { font-size: 1.2rem; }
        .storyline-content h4 { font-size: 1rem; }
        .storyline-content p { margin: 0 0 1.4rem; }
        .storyline-content a { color: #C8A96E; text-decoration: underline; text-underline-offset: 3px; }
        .storyline-content a:hover { color: #F0EDE6; }
        .storyline-content strong { color: #F0EDE6; font-weight: 500; }
        .storyline-content ul,.storyline-content ol { margin: 0 0 1.4rem 1.5rem; }
        .storyline-content li { margin-bottom: 0.5rem; }
        .storyline-content blockquote {
          border-left: 2px solid #C8A96E; padding: 0.5rem 0 0.5rem 1.25rem;
          margin: 2rem 0; font-style: italic; color: #F0EDE6;
        }
        .storyline-img { width: 100%; height: auto; margin: 2rem 0; display: block; }
        .storyline-content figure { margin: 2rem 0; }
        .storyline-content figcaption { font-size: 0.75rem; color: #555; margin-top: 0.5rem; font-family: var(--font-mono); }
        .storyline-content iframe { width: 100%; aspect-ratio: 16/9; margin: 2rem 0; border: none; }
        .storyline-content hr { border: none; border-top: 1px solid #1E1E1E; margin: 2.5rem 0; }
        .storyline-content pre,.storyline-content code { font-family: var(--font-mono); font-size: 0.85rem; background: #111; padding: 0.2em 0.4em; border-radius: 2px; }
      `}</style>
    </div>
  )
}

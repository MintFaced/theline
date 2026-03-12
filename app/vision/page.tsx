// app/vision/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Vision — The Line',
  description: 'The Line was founded to create an unbroken, collaborative exhibition of digital art — a museum without walls for the cryptoart community.',
}

const SECTIONS = [
  {
    label: '01',
    title: 'Artists Together',
    body: 'MintFace founded The Line in October 2022 as an ambitious project to create an unbroken, collaborative exhibition of digital art — a continuous, interconnected line of works that showcases the diversity, creativity, and shared vision of the crypto art community. The concept stemmed from a desire to transcend the isolated nature of individual portfolios and gallery spaces, bringing all crypto artists together into a single, unified exhibition. No other exhibition unifies artists together like The Line.',
    quote: 'The Line is a work of genius.',
    attribution: 'Stranger Solemn — Artist',
  },
  {
    label: '02',
    title: 'Line of Equals',
    body: 'By using theline.nz as both platform and portal, The Line allows viewers to experience the art world without the usual barriers of physical galleries, curating a democratic and infinitely expandable space where all artists have an equal opportunity to shine. In an era of fragmented platforms, fragile marketplaces and rampant individualism, The Line serves as a metaphorical and literal attempt to connect the scattered pieces of the cryptoart landscape together into a backbone of art.',
    quote: 'Galleries like this are dope when you\'ve got six years of work!',
    attribution: 'ROBNESS — Artist',
  },
  {
    label: '03',
    title: 'Free From Walls',
    body: 'MintFace recognized that crypto art had the potential to forge its own path, free from the confines of traditional art institutions. However, without a cohesive space to unite this new wave of creators, much of the art risked becoming lost or overlooked in an ocean of NFTs and independent projects. By establishing The Line as a shared exhibition space, MintFace effectively created a museum without walls — one that could expand infinitely to include an ever-growing roster of artists and artworks, making the digital world\'s creativity accessible and interconnected.',
    quote: 'MintFace has created a free-to-join community of artists only, with incredible discovery and now tooling. The Line is one of the best things in NFTs right now.',
    attribution: 'Articulate — Artist',
  },
  {
    label: '04',
    title: 'Anti-Hierarchy',
    body: 'Beyond just connecting artists, The Line redefines how art is experienced in the digital age. It challenges traditional curation by giving each artwork equal placement and visibility along the line, rejecting hierarchical displays. This format creates a journey for viewers, who must engage with each piece sequentially rather than selecting only the most famous works or being told what to see via an algorithm. MintFace saw this as a way to preserve the value of discovery, allowing both seasoned collectors and curious newcomers to experience the entire spectrum of crypto art without preconceived biases.',
    quote: 'Once you explore the wonderful art galleries of The Line, you can\'t unsee how it transcends the natural beauty around us.',
    attribution: 'readypereone — Cryptoart Collector',
  },
  {
    label: '05',
    title: 'Amplifying Artists',
    body: 'MintFace\'s playful yet intentional approach to redefining art spaces gives a new voice to crypto artists. With its straightforward, almost defiant approach, The Line underscores MintFace\'s vision for an unconventional, unbounded approach to art curation. The platform goes beyond digital exhibition; it embodies a mission to preserve and amplify the voices of crypto artists, ensuring their work remains accessible, celebrated, and connected in an endless line stretching into the digital future.',
    quote: 'The Line is my contribution to the era of tokenized art that puts artists first, ensuring their vision for exhibiting collections is always top of the line.',
    attribution: 'MintFace — Founder',
  },
]

export default function VisionPage() {
  return (
    <div className="bg-line-bg min-h-screen" style={{ paddingTop: 'var(--nav-height)' }}>

      {/* ── Header ── */}
      <div className="border-b border-line-border px-6 py-16 md:py-24 max-w-content mx-auto">
        <p className="label mb-4">Vision</p>
        <div className="flex items-end justify-between gap-6">
          <h1 className="font-display font-light text-5xl md:text-7xl text-line-text" style={{ letterSpacing: '-0.03em', lineHeight: 1 }}>
            A museum<br />without walls
          </h1>
          <p className="font-sans text-sm text-line-muted max-w-xs leading-relaxed hidden md:block">
            Founded October 2022. 1,000 positions. One permanent line stretching into the digital future.
          </p>
        </div>
      </div>

      {/* ── Sections ── */}
      <div className="max-w-content mx-auto">
        {SECTIONS.map((s, i) => (
          <div key={s.label} className="border-b border-line-border grid md:grid-cols-[280px_1fr] gap-px bg-line-border">

            {/* Left — number + title */}
            <div className="bg-line-bg px-6 md:px-10 py-12 flex flex-col justify-between">
              <div>
                <p className="font-mono text-[9px] text-line-muted tracking-widest mb-4">{s.label}</p>
                <h2 className="font-display font-light text-3xl text-line-text leading-tight" style={{ letterSpacing: '-0.02em' }}>
                  {s.title}
                </h2>
              </div>
              <div className="mt-10 border-l-2 border-line-accent pl-4">
                <p className="font-display italic font-light text-sm text-line-text leading-relaxed mb-3">
                  "{s.quote}"
                </p>
                <p className="font-mono text-[9px] text-line-muted tracking-widest">{s.attribution}</p>
              </div>
            </div>

            {/* Right — body */}
            <div className="bg-line-bg px-6 md:px-16 py-12 flex items-center">
              <p className="font-sans text-sm text-line-muted leading-relaxed max-w-2xl">
                {s.body}
              </p>
            </div>

          </div>
        ))}
      </div>

      {/* ── CTA ── */}
      <div className="max-w-content mx-auto px-6 py-20 text-center">
        <p className="font-display font-light text-3xl md:text-5xl text-line-text mb-4" style={{ letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          1,000 artists.<br />One permanent line.
        </p>
        <p className="font-sans text-sm text-line-muted mb-10">The canon era of cryptoart. 2021–2026.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/artists" className="btn-primary">Explore Artists</Link>
          <Link href="/membership" className="btn-outline">Join The Line</Link>
        </div>
      </div>

    </div>
  )
}

// app/collect/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { RevealSection } from '@/components/RevealSection'
import artistsData from '@/data/artists.json'
import type { Artist } from '@/types'

export const metadata: Metadata = {
  title: 'Collect — The Line',
  description: 'How to collect cryptoart from Line Artists. Wallets, marketplaces, and everything you need to start.',
}

const artists = artistsData as Artist[]
const featuredArtists = artists.filter(a => a.featured && a.galleryImage).slice(0, 3)

const MARKETPLACES = [
  {
    name: 'OpenSea',
    url: 'https://opensea.io',
    chain: 'ETH / Base / Polygon',
    description: 'The largest NFT marketplace. Best for Ethereum-based Line Artists.',
  },
  {
    name: 'Objkt',
    url: 'https://objkt.com',
    chain: 'Tezos',
    description: 'The primary marketplace for Tezos art. Around 40% of Line Artists sell here.',
  },
  {
    name: 'Foundation',
    url: 'https://foundation.app',
    chain: 'ETH',
    description: 'Curated platform focused on 1/1 Ethereum works. High-value single editions.',
  },
  {
    name: 'Manifold',
    url: 'https://manifold.xyz',
    chain: 'ETH',
    description: 'Artist-owned smart contracts. Many Line Artists self-publish here.',
  },
]

const STEPS = [
  {
    step: '01',
    heading: 'Get a wallet',
    body: 'Download MetaMask (Ethereum) or Temple (Tezos). Your wallet is your identity on-chain — it holds your art and proves ownership.',
  },
  {
    step: '02',
    heading: 'Fund your wallet',
    body: 'Buy ETH or XTZ from an exchange like Coinbase or Kraken and send it to your wallet address. Most works on The Line sell for 0.01–1 ETH.',
  },
  {
    step: '03',
    heading: 'Find an artist',
    body: 'Browse The Line\'s artist directory. Each profile shows the artist\'s work, sales history, and links to where their art is available to collect.',
  },
  {
    step: '04',
    heading: 'Make your first purchase',
    body: 'Click through to the marketplace, connect your wallet, and place a bid or buy at the listed price. The artwork is transferred to your wallet instantly.',
  },
  {
    step: '05',
    heading: 'Your collection lives on-chain',
    body: 'Connect your wallet on The Line to see your collection displayed alongside the artists you\'ve collected from. Provenance is permanent.',
  },
]

export default function CollectPage() {
  return (
    <div className="bg-line-bg min-h-screen" style={{ paddingTop: 'var(--nav-height)' }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-line-border">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="label mb-4">Collecting</p>
            <h1 className="font-display font-light text-5xl md:text-7xl text-line-text mb-6" style={{ letterSpacing: '-0.03em' }}>
              How to collect<br />Line Artists
            </h1>
            <p className="font-sans text-sm text-line-muted leading-relaxed max-w-md">
              Owning a work from The Line means holding a piece of digital art history. Here is everything you need to start collecting — no experience required.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6">

        {/* ── Steps ───────────────────────────────────────────────────────── */}
        <RevealSection className="py-16 md:py-24 border-b border-line-border">
          <p className="label mb-12">Getting started</p>
          <div className="space-y-px bg-line-border">
            {STEPS.map(({ step, heading, body }) => (
              <div key={step} className="bg-line-bg p-8 md:p-10 grid md:grid-cols-[80px_1fr_2fr] gap-6 md:gap-12 items-start">
                <span className="font-mono text-[10px] text-line-accent tracking-widest">{step}</span>
                <h3 className="font-display font-light text-xl text-line-text" style={{ letterSpacing: '-0.01em' }}>{heading}</h3>
                <p className="font-sans text-sm text-line-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </RevealSection>

        {/* ── Marketplaces ────────────────────────────────────────────────── */}
        <RevealSection className="py-16 md:py-24 border-b border-line-border">
          <p className="label mb-12">Where to buy</p>
          <div className="grid md:grid-cols-2 gap-px bg-line-border">
            {MARKETPLACES.map(({ name, url, chain, description }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-line-bg p-8 md:p-10 block hover:bg-line-surface transition-colors duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-display font-light text-2xl text-line-text group-hover:text-line-accent transition-colors duration-200">
                    {name}
                  </h3>
                  <span className="font-mono text-[10px] text-line-muted tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-200">↗</span>
                </div>
                <p className="font-mono text-[10px] text-line-accent tracking-widest mb-4">{chain}</p>
                <p className="font-sans text-sm text-line-muted leading-relaxed">{description}</p>
              </a>
            ))}
          </div>
        </RevealSection>

        {/* ── Featured artists to collect ─────────────────────────────────── */}
        {featuredArtists.length > 0 && (
          <RevealSection className="py-16 md:py-24 border-b border-line-border">
            <div className="flex items-end justify-between mb-12">
              <p className="label">Artists to collect now</p>
              <Link href="/artists" className="font-mono text-[10px] text-line-muted tracking-widest hover:text-line-accent transition-colors">
                All artists →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-px bg-line-border">
              {featuredArtists.map(artist => (
                <Link
                  key={artist.slug}
                  href={`/artists/${artist.slug}`}
                  className="group bg-line-bg block"
                >
                  <div className="relative overflow-hidden" style={{ aspectRatio: '1' }}>
                    <img
                      src={artist.galleryImage}
                      alt={artist.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-6">
                    <p className="font-mono text-[10px] text-line-accent tracking-widest mb-1">
                      THE LINE {artist.allLineNumbers[0]}
                    </p>
                    <p className="font-display font-light text-xl text-line-text group-hover:text-line-accent transition-colors duration-200">
                      {artist.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </RevealSection>
        )}

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <RevealSection className="py-16 md:py-24 text-center">
          <p className="label mb-6">Ready to collect?</p>
          <h2 className="font-display font-light text-4xl md:text-5xl text-line-text mb-8" style={{ letterSpacing: '-0.02em' }}>
            Browse all 784 artists
          </h2>
          <p className="font-sans text-sm text-line-muted mb-10 max-w-sm mx-auto leading-relaxed">
            Each artist profile shows their work, on-chain sales data, and direct links to collect.
          </p>
          <Link href="/artists" className="btn-primary">
            Browse The Line →
          </Link>
        </RevealSection>

      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { JoinButtons } from '@/components/JoinButtons'
import { NcmUpgradeButton } from '@/components/NcmUpgradeButton'

export const metadata: Metadata = {
  title: 'Join The Line',
  description: 'Join The Line as an artist or support as a Guardian.',
}

const MANIFOLD_LARP       = 'https://manifold.xyz/@mintfaced/id/3807920368'
const MANIFOLD_NCM        = 'https://manifold.xyz/@mintfaced/id/3807920368' // TODO: replace with NCM Manifold mint URL
const OPENSEA_GUARDIANS   = 'https://opensea.io/collection/the-line-guardians'

const ARTIST_BENEFITS = [
  'Dedicated Line Artist bio written by The Line',
  'Your unique Line number, permanent on-chain identity',
  'A feature article written about you and your work',
  'Featured artist profile on The Line',
  'Access to LARP Chat, free from bots and AI',
  'Identity Verification via 6529 Protocol',
]

const NCM_BENEFITS = [
  'Everything in your existing Line Artist membership',
  'Networked Collectors Map live on your artist profile',
  'Dedicated URL at collectors.yourwebsite.com',
  'All your collectors visualised by name across every collection',
  'ENS names resolved live — your community, identified',
  'Map updates as new collectors join your world',
]

const GUARDIAN_BENEFITS = [
  'Line Guardians NFT, permanent on-chain record of your support',
  'Access to LARP Chat alongside the artists you collect',
  'Support exhibitions and artist retreats in New Zealand',
  'Early access to new Line positions and events',
  'Token is tradeable, Guardian benefits transfer with it',
]

export default function JoinPage() {
  return (
    <div className="bg-line-bg min-h-screen" style={{ paddingTop: 'var(--nav-height)' }}>

      {/* Hero */}
      <div className="border-b border-line-border relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img src="/images/guardian-wave-1.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-content mx-auto px-6 py-16 md:py-24 relative z-10">
          <div className="max-w-2xl">
            <p className="label mb-4">The Line</p>
            <h1 className="font-display font-light text-5xl md:text-7xl text-line-text mb-6" style={{ letterSpacing: '-0.03em' }}>
              Join<br />The Line
            </h1>
            <p className="font-sans text-sm text-line-muted leading-relaxed max-w-lg">
              The Line is a permanent home for digital artists. Join as an artist, upgrade with the Networked Collectors Map, or support the platform as a Guardian.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6 py-16 md:py-24">

        {/* Three column grid */}
        <div className="grid md:grid-cols-3 gap-px bg-line-border">

          {/* ── Column 1: Join The Line ── */}
          <div className="bg-line-bg p-8 md:p-10 flex flex-col">
            <div className="flex-1">
              <p className="label mb-4">For Artists</p>
              <h2 className="font-display font-light text-3xl text-line-text mb-6" style={{ letterSpacing: '-0.02em' }}>
                Join The Line
              </h2>

              <div className="space-y-px bg-line-border mb-8">
                <div className="bg-line-bg px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-mono text-[11px] text-line-text tracking-widest uppercase mb-1">One off</p>
                    <p className="font-sans text-xs text-line-muted">Pay once, yours forever</p>
                  </div>
                  <span className="font-display font-light text-2xl text-line-accent" style={{ letterSpacing: '-0.02em' }}>0.1 ETH</span>
                </div>
                <div className="bg-line-surface px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-mono text-[11px] text-line-text tracking-widest uppercase mb-1">Monthly</p>
                    <p className="font-sans text-xs text-line-muted">Cancel anytime</p>
                  </div>
                  <span className="font-display font-light text-2xl text-line-accent" style={{ letterSpacing: '-0.02em' }}>
                    $10 <span className="font-mono text-sm text-line-muted">/ mo</span>
                  </span>
                </div>
              </div>

              <div className="space-y-px bg-line-border mb-8">
                {ARTIST_BENEFITS.map((text, i) => (
                  <div key={i} className="bg-line-bg px-5 py-4 flex items-start gap-4">
                    <span className="font-mono text-[10px] text-line-accent tracking-widest shrink-0 mt-0.5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="font-sans text-sm text-line-muted leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <JoinButtons manifoldUrl={MANIFOLD_LARP} />
          </div>

          {/* ── Column 2: NCM Upgrade — highlighted ── */}
          <div className="bg-line-bg p-8 md:p-10 flex flex-col relative" style={{ borderTop: '2px solid #C8A96E' }}>

            {/* Badge */}
            <div className="absolute top-0 right-8 -translate-y-1/2">
              <span className="font-mono text-[9px] tracking-widest uppercase bg-line-accent text-line-bg px-3 py-1.5">
                Upgrade
              </span>
            </div>

            <div className="flex-1">
              <p className="label mb-4">For Line Artists</p>
              <h2 className="font-display font-light text-3xl text-line-text mb-2" style={{ letterSpacing: '-0.02em' }}>
                Networked<br />Collectors Map
              </h2>
              <p className="font-sans text-xs text-line-muted mb-6 leading-relaxed">
                Add a live collector network visualisation to your Line profile and your own website.
              </p>

              <div className="space-y-px bg-line-border mb-8">
                <div className="bg-line-bg px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-mono text-[11px] text-line-text tracking-widest uppercase mb-1">One off setup</p>
                    <p className="font-sans text-xs text-line-muted">Includes all collections</p>
                  </div>
                  <span className="font-display font-light text-2xl text-line-accent" style={{ letterSpacing: '-0.02em' }}>0.1 ETH</span>
                </div>
              </div>

              <div className="space-y-px bg-line-border mb-8">
                {NCM_BENEFITS.map((text, i) => (
                  <div key={i} className="bg-line-bg px-5 py-4 flex items-start gap-4">
                    <span className="font-mono text-[10px] text-line-accent tracking-widest shrink-0 mt-0.5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="font-sans text-sm text-line-muted leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>

              {/* Live preview link */}
              <div className="mb-8 px-5 py-4 border border-line-border">
                <p className="font-mono text-[9px] text-line-muted tracking-widest uppercase mb-2">Live example</p>
                <Link
                  href="/artists/apocalypse/collectors"
                  className="font-mono text-[11px] text-line-accent hover:opacity-70 transition-opacity tracking-wide"
                >
                  Apocalypse — Networked Collectors Map →
                </Link>
              </div>
            </div>

            <NcmUpgradeButton manifoldUrl={MANIFOLD_NCM} />
          </div>

          {/* ── Column 3: Guardians ── */}
          <div className="bg-line-surface p-8 md:p-10 flex flex-col">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <p className="label">For Collectors</p>
                <span className="font-mono text-[9px] text-line-accent tracking-widest uppercase border border-line-accent/30 px-2 py-1">
                  101 only
                </span>
              </div>
              <h2 className="font-display font-light text-3xl text-line-text mb-6" style={{ letterSpacing: '-0.02em' }}>
                Support The Line
              </h2>

              <div className="space-y-px bg-line-border mb-8">
                <div className="bg-line-bg px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-mono text-[11px] text-line-text tracking-widest uppercase mb-1">Guardian NFT</p>
                    <p className="font-sans text-xs text-line-muted">Buy once, access forever</p>
                  </div>
                  <span className="font-display font-light text-2xl text-line-accent" style={{ letterSpacing: '-0.02em' }}>0.1 ETH</span>
                </div>
              </div>

              <div className="space-y-px bg-line-border mb-8">
                {GUARDIAN_BENEFITS.map((text, i) => (
                  <div key={i} className="bg-line-bg px-5 py-4 flex items-start gap-4">
                    <span className="font-mono text-[10px] text-line-accent tracking-widest shrink-0 mt-0.5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="font-sans text-sm text-line-muted leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a href={OPENSEA_GUARDIANS} target="_blank" rel="noopener noreferrer" className="btn-primary text-center">
                Acquire Guardian NFT
              </a>
              <p className="font-mono text-[9px] text-line-muted tracking-widest text-center">
                101 spots, exclusive to Line supporters
              </p>
            </div>
          </div>

        </div>

        {/* LARP Chat bar */}
        <div className="mt-px bg-line-border">
          <div className="bg-line-bg p-8 md:p-10">
            <div className="max-w-content mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <p className="label mb-2">Included with all memberships</p>
                <h3 className="font-display font-light text-2xl text-line-text mb-2" style={{ letterSpacing: '-0.01em' }}>
                  LARP Chat
                </h3>
                <p className="font-sans text-sm text-line-muted leading-relaxed max-w-lg">
                  A private, tokenized community for Line Artists and Guardians. No bots. No AI. No one who has not earned their place. Just the artists and the people who support them.
                </p>
              </div>
              <Link href="/members/chat" className="btn-outline shrink-0">
                Enter LARP Chat
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="font-mono text-[10px] text-line-muted tracking-widest">
            Questions about the NCM upgrade?{' '}
            <a href="mailto:mintface@digitalartisteconomy.com" className="text-line-accent hover:opacity-70 transition-opacity">
              Get in touch
            </a>
          </p>
        </div>

      </div>
    </div>
  )
}

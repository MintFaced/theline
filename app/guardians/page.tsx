// app/guardians/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Guardians of The Line',
  description: 'Support the continued operation and independence of The Line — a permanent home for digital artists in a time of shrinking infrastructure.',
}

const MANIFOLD_GUARDIANS_URL = 'https://app.manifold.xyz/c/guardians-of-the-line'
const OPENSEA_GUARDIANS_URL  = 'https://opensea.io/collection/guardians-of-the-line'

export default function GuardiansPage() {
  return (
    <div className="bg-line-bg min-h-screen" style={{ paddingTop: 'var(--nav-height)' }}>

      {/* ── Hero ── */}
      <div className="border-b border-line-border">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="label mb-4">The Line</p>
            <h1 className="font-display font-light text-5xl md:text-7xl text-line-text mb-6" style={{ letterSpacing: '-0.03em' }}>
              Guardians<br />of The Line
            </h1>
            <p className="font-sans text-sm text-line-muted leading-relaxed max-w-lg mb-10">
              The marketplaces are shutting down. The resources are disappearing. The infrastructure that digital artists built their practice on is being dismantled. The Line is building something permanent — and Guardians are the people who make that possible.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={MANIFOLD_GUARDIANS_URL} target="_blank" rel="noopener noreferrer"
                className="btn-primary">
                Become a Guardian →
              </a>
              <a href={OPENSEA_GUARDIANS_URL} target="_blank" rel="noopener noreferrer"
                className="btn-outline">
                View on OpenSea
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6">

        {/* ── Why it matters ── */}
        <div className="py-16 md:py-24 border-b border-line-border grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="label mb-6">Why It Matters</p>
            <h2 className="font-display font-light text-4xl text-line-text mb-6" style={{ letterSpacing: '-0.02em' }}>
              The infrastructure<br />is disappearing
            </h2>
          </div>
          <div className="space-y-4 font-sans text-sm text-line-muted leading-relaxed">
            <p>
              SuperRare cut their discovery tools. Foundation changed their model. Nifty Gateway went quiet. The platforms that once gave digital artists visibility, community, and income have pivoted, paused, or closed.
            </p>
            <p>
              The Line was built to be independent of all of it. A physical gallery in Napier, New Zealand. A permanent registry of digital artists. A community that exists on-chain, not at the pleasure of a VC-backed platform.
            </p>
            <p>
              Guardians are the patrons who keep it running — and who have a say in what gets built next.
            </p>
          </div>
        </div>

        {/* ── What you get ── */}
        <div className="py-16 md:py-24 border-b border-line-border">
          <p className="label mb-12">What Guardians Receive</p>
          <div className="grid md:grid-cols-3 gap-px bg-line-border">
            {[
              {
                n: '01',
                title: 'On-chain recognition',
                body: 'The Guardian token is a permanent on-chain record that you supported The Line during a critical period of digital art infrastructure. That provenance doesn\'t disappear.',
              },
              {
                n: '02',
                title: 'LARP Chat access',
                body: 'Guardians get access to LARP Chat — the private community for Line Artists. Collect alongside the artists, be part of the conversation, not just a spectator.',
              },
              {
                n: '03',
                title: 'Gallery acknowledgement',
                body: 'Guardians are acknowledged in the physical gallery space and in the digital record of The Line. Your support is visible, not anonymous.',
              },
              {
                n: '04',
                title: 'Early access',
                body: 'Guardians get first access to new Line positions, retreat invitations, and screen takeover slots before they open to the public.',
              },
              {
                n: '05',
                title: 'Voice in what\'s built',
                body: 'As the platform grows, Guardians have direct input into the roadmap — what tools get built, which artists get featured, how the gallery evolves.',
              },
              {
                n: '06',
                title: 'A reason to exist',
                body: 'Honestly? This is what makes the difference between The Line surviving and not. That matters if you believe digital art deserves a permanent home.',
              },
            ].map(({ n, title, body }) => (
              <div key={n} className="bg-line-bg p-8 md:p-10">
                <span className="font-mono text-[10px] text-line-accent tracking-widest block mb-4">{n}</span>
                <h3 className="font-display font-light text-xl text-line-text mb-3" style={{ letterSpacing: '-0.01em' }}>{title}</h3>
                <p className="font-sans text-sm text-line-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── The token ── */}
        <div className="py-16 md:py-24 border-b border-line-border grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="label mb-6">The Guardian Token</p>
            <h2 className="font-display font-light text-4xl text-line-text mb-6" style={{ letterSpacing: '-0.02em' }}>
              Line Guardians
            </h2>
            <div className="space-y-4 font-sans text-sm text-line-muted leading-relaxed mb-8">
              <p>
                Line Guardians is a limited set of Line Artist supporter tokens, minted on Manifold. Each token is a permanent record of your support and your access key to the Guardian tier.
              </p>
              <p>
                The token is tradeable — but the Guardian benefits transfer with it. Whoever holds the token is a Guardian.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={MANIFOLD_GUARDIANS_URL} target="_blank" rel="noopener noreferrer"
                className="btn-primary">
                Mint on Manifold →
              </a>
              <a href={OPENSEA_GUARDIANS_URL} target="_blank" rel="noopener noreferrer"
                className="btn-outline">
                View on OpenSea
              </a>
            </div>
          </div>

          {/* Token image */}
          <a href={OPENSEA_GUARDIANS_URL} target="_blank" rel="noopener noreferrer"
            className="block group relative overflow-hidden border border-line-border hover:border-line-accent transition-colors aspect-square bg-line-surface flex items-center justify-center">
            <div className="text-center">
              <p className="font-mono text-[10px] text-line-muted tracking-widest mb-2">LINE GUARDIANS</p>
              <p className="font-display font-light text-5xl text-line-accent" style={{ letterSpacing: '-0.03em' }}>G</p>
            </div>
          </a>
        </div>

        {/* ── CTA ── */}
        <div className="py-16 md:py-24">
          <div className="max-w-xl">
            <p className="label mb-6">Join Now</p>
            <h2 className="font-display font-light text-4xl text-line-text mb-6" style={{ letterSpacing: '-0.02em' }}>
              Be here at<br />the beginning
            </h2>
            <p className="font-sans text-sm text-line-muted leading-relaxed mb-8">
              The Line is five years old. It&apos;s been built by one person in a physical gallery in Hawke&apos;s Bay, New Zealand — stubbornly, without VC funding, without a marketplace deal, without a platform to prop it up. Guardians are what make the next five years possible.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={MANIFOLD_GUARDIANS_URL} target="_blank" rel="noopener noreferrer"
                className="btn-primary">
                Become a Guardian →
              </a>
              <Link href="/collect" className="btn-ghost">
                Learn how to collect →
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

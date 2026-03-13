// app/guardians/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Guardians of The Line',
  description: 'Guardians represent the highest values of Web3.0 society — supporting artists by taking them under their wing, embracing them and helping others recognise their talents.',
}

const OPENSEA_URL = 'https://opensea.io/collection/the-line-guardians'

export default function GuardiansPage() {
  return (
    <div className="bg-line-bg min-h-screen" style={{ paddingTop: 'var(--nav-height)' }}>

      {/* ── Hero with wave image ── */}
      <div className="border-b border-line-border relative overflow-hidden">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24 relative z-10">
          <div className="max-w-2xl">
            <p className="label mb-4">The Line</p>
            <h1 className="font-display font-light text-5xl md:text-7xl text-line-text mb-6" style={{ letterSpacing: '-0.03em' }}>
              Guardians<br />of The Line
            </h1>
            <p className="font-sans text-base text-line-muted leading-relaxed max-w-lg mb-10">
              For too long artists have been expected to do everything on their own in Web3.0. Become a Guardian of The Line and smooth the pathway forward for Line artists.
            </p>
            <a href={OPENSEA_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Acquire on OpenSea →
            </a>
          </div>
        </div>
        {/* Wave image behind hero text */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img src="/images/guardian-wave-1.png" alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="max-w-content mx-auto px-6">

        {/* ── What is a Guardian ── */}
        <div className="py-16 md:py-24 border-b border-line-border grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="label mb-6">What Is a Guardian</p>
            <h2 className="font-display font-light text-4xl text-line-text mb-6" style={{ letterSpacing: '-0.02em' }}>
              The highest values<br />of Web3.0 society
            </h2>
            <div className="space-y-5 font-sans text-sm text-line-muted leading-relaxed">
              <p>
                Guardians of The Line represent the highest values of Web3.0 society — supporting artists by taking them under their wing, embracing them and helping others recognise their talents.
              </p>
              <p>
                Each Guardian smooths the pathway forward for Line artists. Not as a passive collector. As an active participant in the future of the artists they support.
              </p>
              <p>
                Guardians and artists can together elevate the crypto art scene to a new level of collective beauty and experience — and support the exhibitions and island retreats of Line artists in New Zealand.
              </p>
            </div>
          </div>
          <div className="relative">
            <img src="/images/guardian-wave-2.png" alt="The Line" className="w-full" />
          </div>
        </div>

        {/* ── Only 100 ── */}
        <div className="py-16 md:py-24 border-b border-line-border grid md:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 md:order-1">
            <img src="/images/guardian-wave-3.png" alt="The Line" className="w-full" />
          </div>
          <div className="order-1 md:order-2">
            <p className="label mb-6">Scarcity</p>
            <h2 className="font-display font-light text-4xl text-line-text mb-6" style={{ letterSpacing: '-0.02em' }}>
              Only 100<br />Guardians
            </h2>
            <div className="space-y-4 font-sans text-sm text-line-muted leading-relaxed">
              <p>
                Only 100 Guardians will ever be admitted into the artists&apos; space. This is a hard limit — not a marketing number.
              </p>
              <p>
                Buy once. Access forever. The Guardian token is your permanent key. Whoever holds it, holds the access.
              </p>
              <p>
                The token is tradeable on OpenSea. If you sell, the next holder becomes a Guardian. The community stays at 100.
              </p>
            </div>
          </div>
        </div>

        {/* ── Why it matters ── */}
        <div className="py-16 md:py-24 border-b border-line-border">
          <p className="label mb-12">Why It Matters</p>
          <div className="grid md:grid-cols-3 gap-px bg-line-border">
            {[
              {
                n: '01',
                title: "Artists can't do it alone",
                body: "Web3.0 promised a new model for artists. But the reality is that artists are still expected to be their own marketers, community managers, collectors, and advocates — while also making the work.",
              },
              {
                n: '02',
                title: 'The infrastructure is shrinking',
                body: 'The platforms that once gave digital artists visibility and income have pivoted, paused, or closed. The Line is building something permanent — and Guardians are the people who make that possible.',
              },
              {
                n: '03',
                title: 'Art is at the centre',
                body: 'Art is at the centre of the crypto revolution. There is no art without artists. Guardians ensure the artists at the heart of that revolution have the support, space, and resources to keep making work.',
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

        {/* ── What Guardians support ── */}
        <div className="py-16 md:py-24 border-b border-line-border grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="label mb-6">What You Support</p>
            <h2 className="font-display font-light text-4xl text-line-text mb-6" style={{ letterSpacing: '-0.02em' }}>
              Exhibitions.<br />Retreats.<br />A permanent home.
            </h2>
            <p className="font-sans text-sm text-line-muted leading-relaxed">
              The Line Gallery sits in Hastings, New Zealand. Guardian support funds the exhibitions, the artist retreats, and the continued building of the platform — independent of marketplaces, independent of VC, independent of any single platform&apos;s survival.
            </p>
          </div>
          <div className="space-y-px bg-line-border">
            {[
              { label: 'Physical exhibitions', desc: 'Line artist work shown in the gallery space in Hastings, New Zealand — a real exhibition record, not an honorary listing.' },
              { label: 'Island retreats', desc: 'Dedicated retreats for Line artists in New Zealand. Time away from the feed to develop practice, meet peers, and make work.' },
              { label: 'Artist resources', desc: 'Tools, guides, and support for Line artists navigating a rapidly changing landscape of platforms and marketplaces.' },
              { label: 'Screen takeovers', desc: "Dedicated periods where a single artist's work fills every screen in the gallery, 24 hours a day." },
            ].map(({ label, desc }) => (
              <div key={label} className="bg-line-bg p-6 flex items-start gap-6">
                <div className="w-1.5 h-1.5 rounded-full bg-line-accent shrink-0 mt-1.5" />
                <div>
                  <p className="font-mono text-[11px] text-line-text tracking-widest uppercase mb-1">{label}</p>
                  <p className="font-sans text-sm text-line-muted leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA with wave ── */}
        <div className="py-16 md:py-24 relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <p className="label mb-6">Change the Future</p>
            <h2 className="font-display font-light text-4xl text-line-text mb-6" style={{ letterSpacing: '-0.02em' }}>
              Become a Guardian<br />of The Line
            </h2>
            <p className="font-sans text-sm text-line-muted leading-relaxed mb-8">
              Art is at the centre of the crypto revolution. There is no art without artists. Become a Guardian of The Line and change the future of Line artists. 100 spots. Buy once. Access forever.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={OPENSEA_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Acquire on OpenSea →
              </a>
              <Link href="/artists" className="btn-ghost">
                Meet the artists →
              </Link>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 w-1/2 opacity-15 pointer-events-none">
            <img src="/images/guardian-wave-4.png" alt="" className="w-full" />
          </div>
        </div>

      </div>
    </div>
  )
}

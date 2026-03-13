// app/retreat/page.tsx
import type { Metadata } from 'next'
import { RetreatForm } from '@/components/RetreatForm'

export const metadata: Metadata = {
  title: 'Artist Retreat — The Line',
  description: 'Join The Line Artist Retreat in Hawke\'s Bay, New Zealand. A gathering of digital artists in one of the world\'s most beautiful wine regions.',
}

export default function RetreatPage() {
  return (
    <div className="bg-line-bg min-h-screen" style={{ paddingTop: 'var(--nav-height)' }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-line-border">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="label mb-4">The Line</p>
            <h1 className="font-display font-light text-5xl md:text-7xl text-line-text mb-6" style={{ letterSpacing: '-0.03em' }}>
              Artist<br />Retreat
            </h1>
            <p className="font-sans text-sm text-line-muted leading-relaxed max-w-md">
              A gathering of digital artists in Hawke&apos;s Bay, New Zealand — one of the world&apos;s most beautiful wine regions. Four days of making, sharing, and deep conversation about what it means to create in the on-chain era.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6">

        {/* ── Details ──────────────────────────────────────────────────────── */}
        <div className="py-16 md:py-24 border-b border-line-border grid md:grid-cols-3 gap-12">
          {[
            {
              label: 'Location',
              heading: 'Hawke\'s Bay',
              body: 'New Zealand\'s art deco coast. Rolling hills, ocean light, and a pace that encourages depth of thought and work.',
            },
            {
              label: 'Who it\'s for',
              heading: 'Line Artists',
              body: 'Open to artists on The Line. Priority given to those actively creating and minting. You bring the work — we provide the space.',
            },
            {
              label: 'What to expect',
              heading: 'Four days',
              body: 'Studio time, group crits, evening discussions. No panels, no pitches. Just artists making things and talking honestly about them.',
            },
          ].map(({ label, heading, body }) => (
            <div key={label}>
              <p className="font-mono text-[10px] text-line-accent tracking-widest uppercase mb-4">{label}</p>
              <h3 className="font-display font-light text-2xl text-line-text mb-3" style={{ letterSpacing: '-0.01em' }}>{heading}</h3>
              <p className="font-sans text-sm text-line-muted leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* ── Form ─────────────────────────────────────────────────────────── */}
        <div className="py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="label mb-6">Register interest</p>
            <h2 className="font-display font-light text-3xl md:text-4xl text-line-text mb-4" style={{ letterSpacing: '-0.02em' }}>
              I want to attend
            </h2>
            <p className="font-sans text-sm text-line-muted leading-relaxed mb-12">
              Dates are not yet confirmed. Leave your details and we&apos;ll reach out when the retreat is announced. No commitment required.
            </p>
            <RetreatForm />
          </div>
        </div>

      </div>
    </div>
  )
}

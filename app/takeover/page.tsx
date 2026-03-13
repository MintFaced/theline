// app/takeover/page.tsx
import type { Metadata } from 'next'
import { TakeoverForm } from '@/components/TakeoverForm'
import { TakeoverGallery } from '@/components/TakeoverGallery'

export const metadata: Metadata = {
  title: 'Screen Takeover — The Line',
  description: 'Apply for a Screen Takeover at The Line Gallery, Hastings. Your work displayed full-screen in the gallery window for one week.',
}

export default function TakeoverPage() {
  return (
    <div className="bg-line-bg min-h-screen" style={{ paddingTop: 'var(--nav-height)' }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-line-border relative overflow-hidden">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24 relative z-10">
          <div className="max-w-2xl">
            <p className="label mb-4">The Line Gallery</p>
            <h1 className="font-display font-light text-5xl md:text-7xl text-line-text mb-6" style={{ letterSpacing: '-0.03em' }}>
              Screen<br />Takeover
            </h1>
            <p className="font-sans text-sm text-line-muted leading-relaxed max-w-md">
              One week. One artist. Your work displayed full-screen in The Line Gallery window in Hastings, New Zealand — visible from the street, 24 hours a day.
            </p>
          </div>
        </div>
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img src="/images/guardian-wave-1.png" alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="max-w-content mx-auto px-6">

        {/* ── Details ──────────────────────────────────────────────────────── */}
        <div className="py-16 md:py-24 border-b border-line-border grid md:grid-cols-3 gap-12">
          {[
            {
              label: 'The screen',
              heading: 'Gallery window',
              body: 'A large format display in the front window of The Line Gallery, 318 Heretaunga Street West, Hastings. Street-facing, always on.',
            },
            {
              label: 'Duration',
              heading: 'One week',
              body: 'Your work occupies the screen for seven days. Still works, video, animation, generative — any format that works at screen resolution.',
            },
            {
              label: 'Who can apply',
              heading: 'Line Artists',
              body: 'Open to all artists on The Line. Priority given to artists who have not had a takeover before and whose work is suited to large format display.',
            },
          ].map(({ label, heading, body }) => (
            <div key={label}>
              <p className="font-mono text-[10px] text-line-accent tracking-widest uppercase mb-4">{label}</p>
              <h3 className="font-display font-light text-2xl text-line-text mb-3" style={{ letterSpacing: '-0.01em' }}>{heading}</h3>
              <p className="font-sans text-sm text-line-muted leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* ── Popular Takeovers ─────────────────────────────────────────── */}
        <div className="py-16 md:py-24 border-b border-line-border">
          <p className="label mb-12">Popular Takeovers</p>
          <TakeoverGallery hideCta />
        </div>

        {/* ── Form ─────────────────────────────────────────────────────────── */}
        <div className="py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="label mb-6">Apply</p>
            <h2 className="font-display font-light text-3xl md:text-4xl text-line-text mb-4" style={{ letterSpacing: '-0.02em' }}>
              I want to take over the screen
            </h2>
            <p className="font-sans text-sm text-line-muted leading-relaxed mb-12">
              Tell us about your work and your preferred week. We&apos;ll be in touch to confirm availability.
            </p>
            <TakeoverForm />
          </div>
        </div>

      </div>
    </div>
  )
}

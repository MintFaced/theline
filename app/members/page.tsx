// app/membership/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { RevealSection } from '@/components/RevealSection'

export const metadata: Metadata = {
  title: 'Membership — The Line',
  description: 'LARP — Line Artists Rad Party. Token-gated membership for Line Artists.',
}

const BENEFITS = [
  {
    label: 'Community',
    heading: 'LARP Chat',
    body: 'Access the private Stream Chat room — one room, all Line Artists. Direct access to the community that built The Line.',
  },
  {
    label: 'Events',
    heading: 'Gallery Retreats',
    body: 'Invitations to exclusive Line Artist events at the physical gallery in Hawke\'s Bay — openings, talks, and collector evenings.',
  },
  {
    label: 'Visibility',
    heading: 'Screen Takeovers',
    body: 'Opportunities for your work to be featured across The Line\'s physical and digital display network.',
  },
  {
    label: 'Recognition',
    heading: 'Verified Status',
    body: 'A verified badge on your artist profile, signalling active membership to collectors browsing The Line.',
  },
]

export default function MembershipPage() {
  return (
    <div className="bg-line-bg min-h-screen" style={{ paddingTop: 'var(--nav-height)' }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-line-border">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="label mb-4">Membership</p>
            <h1 className="font-display font-light text-5xl md:text-7xl text-line-text mb-6" style={{ letterSpacing: '-0.03em' }}>
              Line Artists<br />Rad Party
            </h1>
            <p className="font-mono text-sm text-line-accent tracking-widest mb-8">LARP</p>
            <p className="font-sans text-sm text-line-muted leading-relaxed max-w-md">
              LARP Membership is token-gated for Line Artists only. Hold a LARP token to access the artist community, gallery retreats, and screen takeovers.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6">

        {/* ── What you get ────────────────────────────────────────────────── */}
        <RevealSection className="py-16 md:py-24 border-b border-line-border">
          <p className="label mb-12">What membership includes</p>
          <div className="grid md:grid-cols-2 gap-px bg-line-border">
            {BENEFITS.map(({ label, heading, body }) => (
              <div key={label} className="bg-line-bg p-8 md:p-10">
                <p className="label mb-4">{label}</p>
                <h3 className="font-display font-light text-2xl text-line-text mb-4">{heading}</h3>
                <p className="font-sans text-sm text-line-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </RevealSection>

        {/* ── How to get a token ──────────────────────────────────────────── */}
        <RevealSection className="py-16 md:py-24 border-b border-line-border">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="label mb-6">How to get a token</p>
              <h2 className="font-display font-light text-4xl text-line-text mb-8" style={{ letterSpacing: '-0.02em' }}>
                For Line Artists only
              </h2>
              <div className="space-y-6 font-sans text-sm text-line-muted leading-relaxed">
                <p>
                  LARP membership is exclusively available to artists who hold a position on The Line. It is not available for general purchase.
                </p>
                <p>
                  If you are a Line Artist and do not yet hold a LARP token, contact us directly. You will need to verify ownership of your registered Line wallet address.
                </p>
                <p>
                  Once verified, a LARP token will be issued to your wallet. Connect your wallet on this site to unlock member access.
                </p>
              </div>
            </div>

            <div className="space-y-px bg-line-border">
              {[
                { step: '01', text: 'Hold a position on The Line as a registered artist' },
                { step: '02', text: 'Contact The Line to request a LARP token' },
                { step: '03', text: 'Verify ownership of your Line wallet address' },
                { step: '04', text: 'Receive your token and connect your wallet here' },
              ].map(({ step, text }) => (
                <div key={step} className="bg-line-bg p-6 flex items-start gap-6">
                  <span className="font-mono text-[10px] text-line-accent tracking-widest shrink-0 mt-0.5">{step}</span>
                  <p className="font-sans text-sm text-line-muted leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <RevealSection className="py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-px bg-line-border">
            <div className="bg-line-bg p-10 md:p-14">
              <p className="label mb-4">Already a member?</p>
              <h2 className="font-display font-light text-3xl text-line-text mb-6" style={{ letterSpacing: '-0.02em' }}>
                Connect your wallet<br />to enter LARP
              </h2>
              <p className="font-sans text-sm text-line-muted leading-relaxed mb-8">
                If you already hold a LARP token, connect your wallet to access the chat and all member features.
              </p>
              <Link href="/members/chat" className="btn-primary">
                Connect Wallet →
              </Link>
            </div>
            <div className="bg-line-surface p-10 md:p-14">
              <p className="label mb-4">Not yet on The Line?</p>
              <h2 className="font-display font-light text-3xl text-line-text mb-6" style={{ letterSpacing: '-0.02em' }}>
                Browse the artists<br />who are
              </h2>
              <p className="font-sans text-sm text-line-muted leading-relaxed mb-8">
                Explore all 784 artists currently on The Line — their work, their positions, and their on-chain history.
              </p>
              <Link href="/artists" className="btn-outline">
                Browse Artists →
              </Link>
            </div>
          </div>
        </RevealSection>

      </div>
    </div>
  )
}

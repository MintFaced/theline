// app/membership/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { RevealSection } from '@/components/RevealSection'

export const metadata: Metadata = {
  title: 'LARP Chat — The Line',
  description: 'LARP — Line Artists Rad Party. Token-gated chat for Line Artists only.',
}

export default function MembershipPage() {
  return (
    <div className="bg-line-bg min-h-screen" style={{ paddingTop: 'var(--nav-height)' }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-line-border">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="label mb-4">Chat</p>
            <h1 className="font-display font-light text-5xl md:text-7xl text-line-text mb-6" style={{ letterSpacing: '-0.03em' }}>
              Line Artists<br />Rad Party
            </h1>
            <p className="font-mono text-sm text-line-accent tracking-widest mb-8">LARP</p>
            <p className="font-sans text-sm text-line-muted leading-relaxed max-w-lg">
              LARP Chat is private from collectors so you can say whatever you like — with one rule. What happens in LARP Chat stays in LARP Chat.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6">

        {/* ── NFT Feature ─────────────────────────────────────────────────── */}
        <RevealSection className="py-16 md:py-24 border-b border-line-border">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="label mb-6">The NFT</p>
              <h2 className="font-display font-light text-4xl text-line-text mb-6" style={{ letterSpacing: '-0.02em' }}>
                First 1,000 Artists<br />on The Line
              </h2>
              <div className="space-y-4 font-sans text-sm text-line-muted leading-relaxed mb-8">
                <p>
                  All Line Artists have been airdropped a <em>'First 1,000 Artists on The Line'</em> NFT — a permanent on-chain record that you were here at the beginning.
                </p>
                <p>
                  This token is your key to LARP Chat. It proves you're a Line Artist and grants access to the private community. Hold it, and the door is always open.
                </p>
              </div>
              <a
                href="https://opensea.io/item/ethereum/0x269bc803c233620506c9d25d980e979bf8bcbbf6/8"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                View on OpenSea →
              </a>
            </div>

            {/* NFT Image */}
            <a
              href="https://opensea.io/item/ethereum/0x269bc803c233620506c9d25d980e979bf8bcbbf6/8"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden"
              style={{ aspectRatio: '4/3' }}
            >
              <Image
                src="/images/gallery/line1000-nft.png"
                alt="First 1,000 Artists on The Line NFT"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-line-bg/0 group-hover:bg-line-bg/10 transition-colors duration-300" />
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="font-mono text-[10px] text-line-accent tracking-widest bg-line-bg/80 px-3 py-1.5">
                  View on OpenSea ↗
                </span>
              </div>
            </a>
          </div>
        </RevealSection>

        {/* ── What Line Artists Receive ────────────────────────────────────── */}
        <RevealSection className="py-16 md:py-24 border-b border-line-border">
          <p className="label mb-12">What Line Artists Receive</p>
          <div className="grid md:grid-cols-2 gap-px bg-line-border">

            {/* Gratis column */}
            <div className="bg-line-bg">
              <div className="px-8 md:px-10 py-6 border-b border-line-border">
                <p className="font-mono text-[10px] text-line-accent tracking-widest">Gratis</p>
              </div>
              <div className="divide-y divide-line-border">
                <div className="p-8 md:p-10">
                  <p className="label mb-3">Community</p>
                  <h3 className="font-display font-light text-2xl text-line-text mb-3">LARP Chat</h3>
                  <p className="font-sans text-sm text-line-muted leading-relaxed">
                    Access the private chat room — one room, all Line Artists. Private from collectors so you can speak freely.
                  </p>
                </div>
                <div className="p-8 md:p-10">
                  <p className="label mb-3">Recognition</p>
                  <h3 className="font-display font-light text-2xl text-line-text mb-3">Verified Artist on The Line</h3>
                  <p className="font-sans text-sm text-line-muted leading-relaxed">
                    A permanent page on The Line directory, signalling you are an OG of the crypto space to collectors browsing The Line.
                  </p>
                </div>
              </div>
            </div>

            {/* Paid column */}
            <div className="bg-line-surface">
              <div className="px-8 md:px-10 py-6 border-b border-line-border">
                <p className="font-mono text-[10px] text-line-muted tracking-widest">Paid</p>
              </div>
              <div className="divide-y divide-line-border">
                <div className="p-8 md:p-10">
                  <p className="label mb-3">Visibility</p>
                  <h3 className="font-display font-light text-2xl text-line-text mb-3">Screen Takeovers</h3>
                  <p className="font-sans text-sm text-line-muted leading-relaxed">
                    Opportunities for your work to be featured across The Line's physical and digital display network.
                  </p>
                </div>
                <div className="p-8 md:p-10">
                  <p className="label mb-3">Events</p>
                  <h3 className="font-display font-light text-2xl text-line-text mb-3">Gallery Retreats</h3>
                  <p className="font-sans text-sm text-line-muted leading-relaxed">
                    Invitations to exclusive Line Artist events at the physical gallery in Hawke's Bay — openings, talks, and collector evenings.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </RevealSection>

        {/* ── How to Get Access ────────────────────────────────────────────── */}
        <RevealSection className="py-16 md:py-24 border-b border-line-border">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="label mb-6">How to Get Access</p>
              <h2 className="font-display font-light text-4xl text-line-text mb-8" style={{ letterSpacing: '-0.02em' }}>
                For Line Artists only
              </h2>
              <div className="space-y-4 font-sans text-sm text-line-muted leading-relaxed">
                <p>
                  LARP Chat is exclusively available to artists who hold a position on The Line. It is not available to collectors or general users.
                </p>
                <p>
                  If you are a Line Artist and do not yet hold a <em>'First 1,000 Artists on The Line'</em> NFT,{' '}
                  <a href="mailto:mintface@digitalartisteconomy.com" className="text-line-accent hover:opacity-70 transition-opacity">
                    contact us directly
                  </a>.
                </p>
                <p>
                  Once verified, connect your wallet to unlock access.
                </p>
              </div>
            </div>

            <div className="space-y-px bg-line-border">
              {[
                {
                  step: '01',
                  text: 'Hold a position on The Line as a registered artist',
                  link: null,
                },
                {
                  step: '02',
                  text: 'Contact The Line to request your NFT if you haven\'t received it',
                  link: { label: 'mintface@digitalartisteconomy.com', href: 'mailto:mintface@digitalartisteconomy.com' },
                },
                {
                  step: '03',
                  text: 'Verify ownership of your Line wallet address',
                  link: null,
                },
                {
                  step: '04',
                  text: 'Connect your wallet to unlock LARP Chat',
                  link: { label: 'Connect now →', href: '/members/chat' },
                },
              ].map(({ step, text, link }) => (
                <div key={step} className="bg-line-bg p-6 flex items-start gap-6">
                  <span className="font-mono text-[10px] text-line-accent tracking-widest shrink-0 mt-0.5">{step}</span>
                  <div>
                    <p className="font-sans text-sm text-line-muted leading-relaxed">{text}</p>
                    {link && (
                      <a
                        href={link.href}
                        className="font-mono text-[10px] text-line-accent tracking-widest hover:opacity-70 transition-opacity mt-2 block"
                      >
                        {link.label}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>



      </div>
    </div>
  )
}

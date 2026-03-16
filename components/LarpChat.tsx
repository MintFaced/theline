'use client'
// components/LarpChat.tsx
import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

import { usePrivy } from '@privy-io/react-auth'

// Stream Chat React must be client-only — no SSR
const StreamChatUI = dynamic(() => import('./StreamChatUI'), { ssr: false })

export function LarpChat() {
  return <LarpChatInner />
}

function LarpChatInner() {
  const { ready, authenticated, login, user } = usePrivy()

  const [memberState, setMemberState] = useState<'idle' | 'checking' | 'member' | 'not-member'>('idle')
  const walletAddress = user?.wallet?.address?.toLowerCase() ?? null
  const shortAddress  = walletAddress ? `${walletAddress.slice(0,6)}…${walletAddress.slice(-4)}` : null

  useEffect(() => {
    if (!authenticated || !walletAddress) { setMemberState('idle'); return }
    setMemberState('checking')
    fetch(`/api/membership/check?address=${walletAddress}`)
      .then(r => r.ok ? r.json() : { isMember: false })
      .then(d => setMemberState(d.isMember ? 'member' : 'not-member'))
      .catch(() => setMemberState('not-member'))
  }, [authenticated, walletAddress])

  if (!ready) return <Shell><Spinner label="Loading…" /></Shell>

  if (!authenticated) {
    return <LarpLanding login={login} />
  }

  if (memberState === 'idle' || memberState === 'checking') {
    return <Shell><Spinner label="Verifying membership token…" /></Shell>
  }

  if (memberState === 'not-member') {
    return (
      <Shell>
        <div className="text-center max-w-xs mx-auto">
          <p className="label mb-3">Access Denied</p>
          <h1 className="font-display font-light text-3xl text-line-text mb-4">
            No LARP token found
          </h1>
          <p className="font-sans text-sm text-line-muted leading-relaxed mb-2">
            Wallet <span className="font-mono text-line-accent">{shortAddress}</span> doesn't hold a LARP token.
          </p>
          <p className="font-sans text-sm text-line-muted leading-relaxed mb-8">
            LARP is for Line Artists and Line Guardians only. Make sure you're connected with the right wallet.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/membership" className="btn-outline">Learn More</Link>
            <Link href="/artists" className="btn-ghost">Browse Artists</Link>
          </div>
        </div>
      </Shell>
    )
  }

  return (
    <Shell fullHeight>
      <StreamChatUI walletAddress={walletAddress!} shortAddress={shortAddress!} />
    </Shell>
  )
}

export function Shell({ children, fullHeight = false }: { children: React.ReactNode; fullHeight?: boolean }) {
  return (
    <div className="bg-line-bg" style={{ minHeight: '100svh', paddingTop: 'var(--nav-height)' }}>
      <div className="border-b border-line-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-mono text-[10px] text-line-muted tracking-widest hover:text-line-accent transition-colors">
            ← THE LINE
          </Link>
          <span className="text-line-border font-mono text-xs">|</span>
          <span className="font-mono text-[10px] text-line-accent tracking-widest">LARP CHAT</span>
        </div>
        <span className="font-display font-light text-sm text-line-muted hidden sm:block">
          Line Artists Rad Party
        </span>
      </div>
      <div className={
        fullHeight
          ? 'h-[calc(100svh-var(--nav-height)-49px)]'
          : 'flex items-center justify-center min-h-[calc(100svh-var(--nav-height)-49px)] px-6 py-16'
      }>
        {children}
      </div>
    </div>
  )
}

export function Spinner({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-px bg-line-border relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-8 bg-line-accent animate-pulse" />
      </div>
      <p className="font-mono text-[10px] text-line-muted tracking-widest">{label}</p>
    </div>
  )
}

function LarpLanding({ login }: { login: () => void }) {
  return (
    <div className="bg-line-bg min-h-screen" style={{ paddingTop: 'var(--nav-height)' }}>

      {/* ── Header ── */}
      <div className="border-b border-line-border">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="label mb-4">LARP</p>
            <h1 className="font-display font-light text-5xl md:text-7xl text-line-text mb-6" style={{ letterSpacing: '-0.03em' }}>
              Line Artists<br />Rad Party
            </h1>
            <p className="font-sans text-sm text-line-muted leading-relaxed max-w-lg mb-10">
              LARP Chat is private from collectors so you can say whatever you like — with one rule. What happens in LARP Chat stays in LARP Chat.
            </p>
            <button onClick={login} className="btn-primary">
              Connect Wallet to Enter →
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6">

        {/* ── NFT ── */}
        <div className="py-16 md:py-24 border-b border-line-border grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="label mb-6">The NFT</p>
            <h2 className="font-display font-light text-4xl text-line-text mb-6" style={{ letterSpacing: '-0.02em' }}>
              First 1,000 Artists<br />on The Line
            </h2>
            <div className="space-y-4 font-sans text-sm text-line-muted leading-relaxed mb-8">
              <p>All Line Artists have been airdropped a <em>'First 1,000 Artists on The Line'</em> NFT — a permanent on-chain record that you were here at the beginning.</p>
              <p>This token is your key to LARP Chat. It proves you're a Line Artist and grants access to the private community. Hold it, and the door is always open.</p>
              <p>101 positions remain. Mint yours to join the community and lock in your place on The Line.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/join" className="btn-primary">
                Join The Line →
              </Link>
              <a href="https://manifold.xyz/@mintfaced/id/3807920368"
                target="_blank" rel="noopener noreferrer" className="btn-outline">
                Mint on Manifold
              </a>
            </div>
          </div>
          {/* NFT image — click through to OpenSea */}
          <a href="https://opensea.io/item/ethereum/0x269bc803c233620506c9d25d980e979bf8bcbbf6/8"
            target="_blank" rel="noopener noreferrer"
            className="block group relative overflow-hidden border border-line-border hover:border-line-accent transition-colors">
            <img
              src="https://arweave.net/_8JjGqYPBZAk6utMDass7Iv_zq_jsDtcHfVG0_pc-iA"
              alt="First 1,000 Artists on The Line NFT"
              className="w-full object-cover group-hover:opacity-90 transition-opacity"
            />
            <div className="absolute inset-0 bg-line-bg/0 group-hover:bg-line-bg/10 transition-colors" />
          </a>
        </div>

        {/* ── How to get access ── */}
        <div className="py-16 md:py-24 border-b border-line-border grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="label mb-6">How to Get Access</p>
            <h2 className="font-display font-light text-4xl text-line-text mb-8" style={{ letterSpacing: '-0.02em' }}>
              For Line Artists only
            </h2>
            <div className="space-y-4 font-sans text-sm text-line-muted leading-relaxed">
              <p>LARP Chat is exclusively available to artists who hold a position on The Line and Line Guardians. It is not generally available to collectors or general users.</p>
              <p>If you are a Line Artist and do not yet hold an NFT, <a href="https://manifold.xyz/@mintfaced/id/3807920368" target="_blank" rel="noopener noreferrer" className="text-line-accent hover:opacity-70 transition-opacity">mint one now →</a></p>
            </div>
          </div>
          <div className="space-y-px bg-line-border">
            {[
              { step: '01', text: 'Mint The Line access NFT for artists', link: { label: 'Mint on Manifold →', href: 'https://manifold.xyz/@mintfaced/id/3807920368' } },
              { step: '02', text: 'Hold a position on The Line as a registered artist', link: null },
              { step: '03', text: 'Verify ownership of your Line wallet address', link: null },
              { step: '04', text: 'Connect your wallet above to unlock LARP Chat', link: null },
            ].map(({ step, text, link }) => (
              <div key={step} className="bg-line-bg p-6 flex items-start gap-6">
                <span className="font-mono text-[10px] text-line-accent tracking-widest shrink-0 mt-0.5">{step}</span>
                <div>
                  <p className="font-sans text-sm text-line-muted leading-relaxed">{text}</p>
                  {link && <a href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="font-mono text-[10px] text-line-accent tracking-widest hover:opacity-70 transition-opacity mt-2 block">{link.label}</a>}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/join" className="btn-primary">
              Join The Line →
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

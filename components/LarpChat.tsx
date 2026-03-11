'use client'
// components/LarpChat.tsx
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Stream Chat React must be client-only — no SSR
const StreamChatUI = dynamic(() => import('./StreamChatUI'), { ssr: false })

export function LarpChat() {
  return <LarpChatInner />
}

function LarpChatInner() {
  const { usePrivy } = require('@privy-io/react-auth')
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
    return (
      <Shell>
        <div className="text-center max-w-xs mx-auto">
          <p className="label mb-3">LARP</p>
          <h1 className="font-display font-light text-4xl text-line-text mb-4">
            Line Artists<br />Rad Party
          </h1>
          <p className="font-sans text-sm text-line-muted leading-relaxed mb-8">
            Token gated for Line Artists only.<br />
            Connect your wallet to LARP.
          </p>
          <button onClick={login} className="btn-primary w-full justify-center">
            Connect Wallet
          </button>
        </div>
      </Shell>
    )
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
            LARP is for Line Artists only. Make sure you're connected with the right wallet.
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

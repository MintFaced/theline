'use client'
// components/LarpChat.tsx
import { useState, useEffect } from 'react'
import Link from 'next/link'

export function LarpChat() {
  // Can't use Privy hooks directly here — need to be inside PrivyProvider tree
  // which Providers.tsx handles. So we just render the inner component.
  return <LarpChatInner />
}

function LarpChatInner() {
  const { usePrivy } = require('@privy-io/react-auth')
  const { ready, authenticated, login, user } = usePrivy()

  const [memberState, setMemberState] = useState<'idle' | 'checking' | 'member' | 'not-member'>('idle')

  const walletAddress = user?.wallet?.address ?? null
  const shortAddress  = walletAddress
    ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`
    : null

  // Check membership whenever wallet connects
  useEffect(() => {
    if (!authenticated || !walletAddress) {
      setMemberState('idle')
      return
    }
    setMemberState('checking')
    fetch(`/api/membership/check?address=${walletAddress}`)
      .then(r => r.ok ? r.json() : { isMember: false })
      .then(d => setMemberState(d.isMember ? 'member' : 'not-member'))
      .catch(() => setMemberState('not-member'))
  }, [authenticated, walletAddress])

  // ── Still loading Privy ──────────────────────────────────────────────────
  if (!ready) return <Shell><Spinner label="Loading…" /></Shell>

  // ── Not connected ────────────────────────────────────────────────────────
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

  // ── Checking token ───────────────────────────────────────────────────────
  if (memberState === 'idle' || memberState === 'checking') {
    return <Shell><Spinner label="Verifying membership token…" /></Shell>
  }

  // ── Not a member ─────────────────────────────────────────────────────────
  if (memberState === 'not-member') {
    return (
      <Shell>
        <div className="text-center max-w-xs mx-auto">
          <p className="label mb-3">Access Denied</p>
          <h1 className="font-display font-light text-3xl text-line-text mb-4">
            No LARP token found
          </h1>
          <p className="font-sans text-sm text-line-muted leading-relaxed mb-2">
            Wallet{' '}
            <span className="font-mono text-line-accent">{shortAddress}</span>{' '}
            doesn't hold a LARP membership token.
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

  // ── Member verified — show chat ──────────────────────────────────────────
  return (
    <Shell fullHeight>
      <StreamChatRoom walletAddress={walletAddress!} shortAddress={shortAddress!} />
    </Shell>
  )
}

// ── Stream Chat room ─────────────────────────────────────────────────────────
function StreamChatRoom({ walletAddress, shortAddress }: { walletAddress: string; shortAddress: string }) {
  const [chatReady, setChatReady] = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [ChatUI, setChatUI]       = useState<React.ReactNode>(null)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY
    if (!apiKey) { setError('Stream API key not configured'); return }

    const userId = walletAddress.toLowerCase()

    Promise.all([
      import('stream-chat'),
      import('stream-chat-react'),
    ]).then(async ([{ StreamChat }, SC]) => {
      // Get server-issued token
      const tokenRes = await fetch(`/api/members/chat-token?address=${walletAddress}`)
      if (!tokenRes.ok) { setError('Could not verify membership token'); return }
      const { token } = await tokenRes.json()

      // Connect to Stream
      const client = StreamChat.getInstance(apiKey)
      await client.connectUser({ id: userId, name: shortAddress }, token)

      // Get or create the single LARP channel
      const channel = client.channel('messaging', 'larp-main', {
        name: 'LARP — Line Artists Rad Party',
      })
      await channel.watch()

      // Build the UI
      const { Chat, Channel, Window, MessageList, MessageInput, ChannelHeader } = SC

      setChatUI(
        <div className="h-full larp-chat-theme">
          <Chat client={client} theme="str-chat__theme-dark">
            <Channel channel={channel}>
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput focus />
              </Window>
            </Channel>
          </Chat>
        </div>
      )
      setChatReady(true)

      return () => { client.disconnectUser() }
    }).catch(err => {
      console.error('Stream Chat init error:', err)
      setError('Chat failed to load — please refresh.')
    })
  }, [walletAddress, shortAddress])

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="font-mono text-xs text-line-muted tracking-widest">{error}</p>
      </div>
    )
  }

  if (!chatReady) return <Spinner label="Loading LARP chat…" />

  return <>{ChatUI}</>
}

// ── Layout shell ─────────────────────────────────────────────────────────────
function Shell({ children, fullHeight = false }: { children: React.ReactNode; fullHeight?: boolean }) {
  return (
    <div className="bg-line-bg min-h-svh" style={{ paddingTop: 'var(--nav-height)' }}>
      {/* Top bar */}
      <div className="border-b border-line-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-mono text-[10px] text-line-muted tracking-widest hover:text-line-accent transition-colors">
            ← THE LINE
          </Link>
          <span className="text-line-border font-mono text-xs">|</span>
          <span className="font-mono text-[10px] text-line-accent tracking-widest">LARP</span>
        </div>
        <span className="font-display font-light text-sm text-line-muted hidden sm:block">
          Line Artists Rad Party
        </span>
      </div>

      {/* Content */}
      <div className={
        fullHeight
          ? 'h-[calc(100svh-var(--nav-height)-49px)]'
          : 'flex items-center justify-center min-h-[calc(100svh-var(--nav-height)-49px)] px-6 py-16'
      }>
        {children}
      </div>

      {/* Stream Chat CSS */}
      <style>{`
        @import url('https://cdn.jsdelivr.net/npm/stream-chat-react@11/dist/css/v2/index.css');
        .larp-chat-theme { height: 100%; }
        .larp-chat-theme .str-chat { height: 100%; background: #0A0A0A; }
        .larp-chat-theme .str-chat__channel { background: #0A0A0A; }
        .larp-chat-theme .str-chat__message-input { background: #111111; border-top: 1px solid #1E1E1E; }
        .larp-chat-theme .str-chat__message-input-inner { background: #111111; }
        .larp-chat-theme .str-chat__message-textarea { background: #111111; color: #F0EDE6; }
        .larp-chat-theme .str-chat__list { background: #0A0A0A; }
        .larp-chat-theme .str-chat__header-livestream { background: #111111; border-bottom: 1px solid #1E1E1E; color: #F0EDE6; }
        .larp-chat-theme .str-chat__message-simple__actions { color: #C8A96E; }
      `}</style>
    </div>
  )
}

function Spinner({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-px bg-line-border relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-8 bg-line-accent animate-pulse" />
      </div>
      <p className="font-mono text-[10px] text-line-muted tracking-widest">{label}</p>
    </div>
  )
}

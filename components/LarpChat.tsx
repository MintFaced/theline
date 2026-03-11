'use client'
// components/LarpChat.tsx
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Chat, Channel, Window, MessageList, MessageInput, ChannelHeader } from 'stream-chat-react'

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
      <StreamChatRoom walletAddress={walletAddress!} shortAddress={shortAddress!} />
    </Shell>
  )
}

function StreamChatRoom({ walletAddress, shortAddress }: { walletAddress: string; shortAddress: string }) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const mountedRef = useRef(true)
  const [chatData, setChatData] = useState<{ client: any; channel: any } | null>(null)

  useEffect(() => {
    mountedRef.current = true
    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY

    if (!apiKey) {
      setErrorMsg('Stream API key not configured — add NEXT_PUBLIC_STREAM_API_KEY to Vercel')
      setStatus('error')
      return
    }

    ;(async () => {
      try {
        // 1. Get server token
        const tokenRes = await fetch(`/api/members/chat-token?address=${walletAddress}`)
        if (!tokenRes.ok) {
          const err = await tokenRes.json()
          throw new Error(err.error ?? 'Token request failed')
        }
        const { token } = await tokenRes.json()

        // 2. Load Stream Chat client only (react components are statically imported)
        const { StreamChat } = await import('stream-chat')

        if (!mountedRef.current) return

        // 3. Connect user
        const client = StreamChat.getInstance(apiKey)
        await client.connectUser({ id: walletAddress, name: shortAddress }, token)

        if (!mountedRef.current) { client.disconnectUser(); return }

        // 4. Get/create the LARP channel
        const channel = client.channel('messaging', 'larp-main', {
          name: 'LARP — Line Artists Rad Party',
        })
        await channel.watch()

        if (!mountedRef.current) { client.disconnectUser(); return }

        setChatData({ client, channel })
        setStatus('ready')
      } catch (err: any) {
        console.error('Stream Chat error:', err)
        if (mountedRef.current) {
          setErrorMsg(err.message ?? 'Chat failed to load')
          setStatus('error')
        }
      }
    })()

    return () => {
      mountedRef.current = false
      chatData?.client?.disconnectUser()
    }
  }, [walletAddress, shortAddress])

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="font-mono text-xs text-line-muted tracking-widest text-center max-w-sm">{errorMsg}</p>
        <button onClick={() => window.location.reload()} className="btn-ghost">Retry</button>
      </div>
    )
  }

  if (status === 'loading' || !chatData) {
    return <Spinner label="Loading LARP chat…" />
  }

  return (
    <>
      <style>{`
        .larp-chat { height: 100%; }
        .larp-chat .str-chat { height: 100%; }
        .larp-chat .str-chat__container { height: 100%; }
        .larp-chat .str-chat-channel { height: 100%; background: #0A0A0A; }
        .larp-chat .str-chat__main-panel { background: #0A0A0A; }
        .larp-chat .str-chat__list { background: #0A0A0A; padding: 16px; }
        .larp-chat .str-chat__message-input { background: #111111; border-top: 1px solid #1E1E1E; padding: 12px 16px; }
        .larp-chat .str-chat__message-input-inner { background: #161616; border: 1px solid #1E1E1E; border-radius: 2px; }
        .larp-chat .str-chat__textarea textarea { background: transparent; color: #F0EDE6; font-family: var(--font-sans); }
        .larp-chat .str-chat__header-livestream { background: #111111; border-bottom: 1px solid #1E1E1E; color: #F0EDE6; }
        .larp-chat .str-chat__header-livestream-left--title { color: #C8A96E; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; }
        .larp-chat .str-chat__message-text { color: #F0EDE6; }
        .larp-chat .str-chat__message-sender-name { color: #C8A96E; font-size: 11px; }
        .larp-chat .str-chat__message-simple-name { color: #C8A96E; }
        .larp-chat .str-chat__date-separator-line { border-color: #1E1E1E; }
        .larp-chat .str-chat__date-separator-date { color: #666666; background: #0A0A0A; font-size: 10px; }
        .larp-chat .str-chat__send-button { color: #C8A96E; }
      `}</style>
      <div className="larp-chat h-full">
        <Chat client={chatData.client} theme="str-chat__theme-dark">
          <Channel channel={chatData.channel}>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </Channel>
        </Chat>
      </div>
    </>
  )
}

function Shell({ children, fullHeight = false }: { children: React.ReactNode; fullHeight?: boolean }) {
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

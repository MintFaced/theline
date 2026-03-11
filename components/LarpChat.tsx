'use client'
// components/LarpChat.tsx
// Token-gated Stream Chat for LARP members
// Requires: NEXT_PUBLIC_STREAM_API_KEY env var (get from getstream.io)

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

type ChatState =
  | 'loading'       // checking wallet/privy
  | 'unauthenticated' // no wallet connected
  | 'checking'      // checking membership token
  | 'not-member'    // wallet connected but no token
  | 'ready'         // member verified, chat loading
  | 'no-stream-key' // Stream API key not configured

export function LarpChat() {
  const [state, setState] = useState<ChatState>('loading')
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>('')
  const streamRef = useRef<HTMLDivElement>(null)
  const hasPrivy = !!process.env.NEXT_PUBLIC_PRIVY_APP_ID
  const hasStream = !!process.env.NEXT_PUBLIC_STREAM_API_KEY

  useEffect(() => {
    if (!hasStream) { setState('no-stream-key'); return }
    if (!hasPrivy)  { setState('unauthenticated'); return }

    // Dynamically load Privy to check auth state
    import('@privy-io/react-auth').then(() => {
      setState('unauthenticated')
    }).catch(() => setState('unauthenticated'))
  }, [hasPrivy, hasStream])

  if (state === 'no-stream-key') {
    return <ConfigNeeded />
  }

  return (
    <PrivyChatWrapper
      state={state}
      setState={setState}
      walletAddress={walletAddress}
      setWalletAddress={setWalletAddress}
      userName={userName}
      setUserName={setUserName}
      streamRef={streamRef}
    />
  )
}

// Inner component that can use Privy hooks
function PrivyChatWrapper({
  state, setState, walletAddress, setWalletAddress, userName, setUserName, streamRef
}: {
  state: ChatState
  setState: (s: ChatState) => void
  walletAddress: string | null
  setWalletAddress: (a: string) => void
  userName: string
  setUserName: (n: string) => void
  streamRef: React.RefObject<HTMLDivElement>
}) {
  const { usePrivy } = require('@privy-io/react-auth')
  const { ready, authenticated, login, user } = usePrivy()

  useEffect(() => {
    if (!ready) return

    if (!authenticated || !user?.wallet?.address) {
      setState('unauthenticated')
      return
    }

    const address = user.wallet.address
    setWalletAddress(address)

    // Display name: ENS > wallet short
    const name = user.wallet.address.slice(0, 6) + '...' + user.wallet.address.slice(-4)
    setUserName(name)

    // Check membership token
    setState('checking')
    fetch(`/api/membership/check?address=${address}`)
      .then(r => r.ok ? r.json() : { isMember: false })
      .then(data => {
        setState(data.isMember ? 'ready' : 'not-member')
      })
      .catch(() => setState('not-member'))
  }, [ready, authenticated, user?.wallet?.address])

  // ── Unauthenticated ──────────────────────────────────────────────────────
  if (state === 'loading' || (!ready && state !== 'unauthenticated')) {
    return <ChatShell><LoadingState label="Checking wallet..." /></ChatShell>
  }

  if (state === 'unauthenticated') {
    return (
      <ChatShell>
        <div className="text-center max-w-sm mx-auto">
          <p className="label mb-4">LARP</p>
          <h1 className="font-display font-light text-3xl text-line-text mb-3">
            Line Artists Rad Party
          </h1>
          <p className="font-sans text-sm text-line-muted mb-8 leading-relaxed">
            LARP Membership is token gated for Line Artists only.
            <br />Connect your wallet to LARP.
          </p>
          <button onClick={login} className="btn-primary">
            Connect Wallet
          </button>
        </div>
      </ChatShell>
    )
  }

  if (state === 'checking') {
    return <ChatShell><LoadingState label="Verifying membership token..." /></ChatShell>
  }

  if (state === 'not-member') {
    return (
      <ChatShell>
        <div className="text-center max-w-sm mx-auto">
          <p className="label mb-4">Access Required</p>
          <h1 className="font-display font-light text-3xl text-line-text mb-3">
            No LARP token found
          </h1>
          <p className="font-sans text-sm text-line-muted mb-2 leading-relaxed">
            Your wallet <span className="font-mono text-line-accent">{walletAddress?.slice(0,6)}...{walletAddress?.slice(-4)}</span> doesn't hold a LARP membership token.
          </p>
          <p className="font-sans text-sm text-line-muted mb-8 leading-relaxed">
            LARP is for Line Artists only. If you're a Line Artist, make sure you're connected with the right wallet.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/membership" className="btn-outline">Learn More</Link>
            <Link href="/artists" className="btn-ghost">Browse Artists</Link>
          </div>
        </div>
      </ChatShell>
    )
  }

  // ── Member verified — load Stream Chat ──────────────────────────────────
  return (
    <ChatShell fullHeight>
      <StreamChatEmbed
        walletAddress={walletAddress!}
        userName={userName}
        streamRef={streamRef}
      />
    </ChatShell>
  )
}

function StreamChatEmbed({
  walletAddress,
  userName,
  streamRef,
}: {
  walletAddress: string
  userName: string
  streamRef: React.RefObject<HTMLDivElement>
}) {
  const [chatReady, setChatReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY
    if (!apiKey) { setError('Stream API key not configured'); return }

    // Dynamically import Stream Chat to avoid SSR issues
    Promise.all([
      import('stream-chat'),
      import('stream-chat-react'),
    ]).then(async ([{ StreamChat }, StreamChatReact]) => {
      const client = StreamChat.getInstance(apiKey)

      // Get a user token from our API route
      const tokenRes = await fetch(`/api/members/chat-token?address=${walletAddress}`)
      if (!tokenRes.ok) { setError('Could not get chat token'); return }
      const { token } = await tokenRes.json()

      // Connect user
      await client.connectUser(
        {
          id: walletAddress.toLowerCase(),
          name: userName,
          // Avatar: use a simple gradient placeholder
        },
        token
      )

      // Get or create the LARP channel
      const channel = client.channel('messaging', 'larp-main', {
        name: 'LARP — Line Artists Rad Party',
        members: [walletAddress.toLowerCase()],
      })
      await channel.watch()

      setChatReady(true)

      // Cleanup on unmount
      return () => { client.disconnectUser() }
    }).catch(err => {
      console.error('Stream Chat error:', err)
      setError('Chat failed to load. Please refresh.')
    })
  }, [walletAddress, userName])

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="font-mono text-xs text-line-muted">{error}</p>
      </div>
    )
  }

  if (!chatReady) {
    return <LoadingState label="Loading LARP chat..." />
  }

  // Stream Chat renders into this div via the ref
  return (
    <div ref={streamRef} className="w-full h-full" id="stream-chat-root">
      <StreamChatUI walletAddress={walletAddress} userName={userName} />
    </div>
  )
}

// Separate component for Stream Chat UI (uses their hooks)
function StreamChatUI({ walletAddress, userName }: { walletAddress: string; userName: string }) {
  const [ChatComponents, setChatComponents] = useState<any>(null)
  const [client, setClient] = useState<any>(null)
  const [channel, setChannel] = useState<any>(null)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!

    Promise.all([
      import('stream-chat'),
      import('stream-chat-react'),
      import('stream-chat-react/dist/css/v2/index.css' as any),
    ]).then(async ([{ StreamChat }, components]) => {
      const c = StreamChat.getInstance(apiKey)
      const tokenRes = await fetch(`/api/members/chat-token?address=${walletAddress}`)
      const { token } = await tokenRes.json()

      await c.connectUser({ id: walletAddress.toLowerCase(), name: userName }, token)

      const ch = c.channel('messaging', 'larp-main', {
        name: 'LARP — Line Artists Rad Party',
      })
      await ch.watch()

      setClient(c)
      setChannel(ch)
      setChatComponents(components)
    }).catch(console.error)

    return () => { client?.disconnectUser() }
  }, [walletAddress, userName])

  if (!ChatComponents || !client || !channel) {
    return <LoadingState label="Loading LARP chat..." />
  }

  const { Chat, Channel, Window, MessageList, MessageInput, ChannelHeader } = ChatComponents

  return (
    <div className="h-full" style={{ '--str-chat__primary-color': '#C8A96E', '--str-chat__active-primary-color': '#8C6F3E', '--str-chat__surface-color': '#111111', '--str-chat__secondary-surface-color': '#161616', '--str-chat__primary-surface-color': '#0A0A0A', '--str-chat__primary-text-color': '#F0EDE6', '--str-chat__secondary-text-color': '#666666', '--str-chat__disabled-color': '#1E1E1E' } as any}>
      <Chat client={client} theme="str-chat__theme-dark">
        <Channel channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
        </Channel>
      </Chat>
    </div>
  )
}

// ── Shell layouts ────────────────────────────────────────────────────────────
function ChatShell({ children, fullHeight = false }: { children: React.ReactNode; fullHeight?: boolean }) {
  return (
    <div
      className="bg-line-bg"
      style={{ minHeight: '100svh', paddingTop: 'var(--nav-height)' }}
    >
      {/* Header */}
      <div className="border-b border-line-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-mono text-[10px] text-line-muted tracking-widest hover:text-line-accent transition-colors">
            ← THE LINE
          </Link>
          <span className="text-line-border">|</span>
          <span className="font-mono text-[10px] text-line-accent tracking-widest">LARP</span>
        </div>
        <span className="font-display font-light text-sm text-line-muted">
          Line Artists Rad Party
        </span>
      </div>

      {/* Content */}
      <div className={fullHeight
        ? 'h-[calc(100svh-var(--nav-height)-57px)]'
        : 'flex items-center justify-center min-h-[calc(100svh-var(--nav-height)-57px)] px-6'
      }>
        {children}
      </div>
    </div>
  )
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-24 h-px bg-line-border relative overflow-hidden">
        <div className="absolute inset-y-0 w-1/2 bg-line-accent animate-pulse" />
      </div>
      <p className="font-mono text-[10px] text-line-muted tracking-widest">{label}</p>
    </div>
  )
}

function ConfigNeeded() {
  return (
    <ChatShell>
      <div className="text-center max-w-sm mx-auto">
        <p className="label mb-4">Configuration Required</p>
        <p className="font-sans text-sm text-line-muted leading-relaxed">
          Stream Chat API key not configured.
          <br />Add <span className="font-mono text-line-accent">NEXT_PUBLIC_STREAM_API_KEY</span> to your Vercel environment variables.
          <br /><br />Get a free key at{' '}
          <a href="https://getstream.io" target="_blank" rel="noopener noreferrer" className="text-line-accent hover:opacity-70">
            getstream.io
          </a>
        </p>
      </div>
    </ChatShell>
  )
}

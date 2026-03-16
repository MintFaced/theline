// components/StreamChatUI.tsx
// Client-only via dynamic() -- never SSR
'use client'
import { useState, useEffect, useRef } from 'react'
import { Chat, Channel, Window, MessageList, MessageInput, ChannelHeader } from 'stream-chat-react'
import 'stream-chat-react/dist/css/v2/index.css'
import { Spinner } from './LarpChat'

type Props = { walletAddress: string; shortAddress: string }

// Line badge shown instead of or alongside profile pic
function LineBadge({ user }: { user: any }) {
  const [hover, setHover] = useState(false)
  const lineNum = user?.lineNumber
  const name = user?.name
  const slug = user?.slug
  const image = user?.image

  if (!lineNum && lineNum !== 0) return null

  return (
    <div className="relative inline-block" style={{ zIndex: hover ? 9999 : 'auto' }}>
      <div
        className="cursor-pointer select-none"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Line number badge */}
        <div style={{
          fontFamily: 'monospace',
          fontSize: '10px',
          letterSpacing: '0.1em',
          color: '#C8A96E',
          background: 'rgba(200,169,110,0.12)',
          border: '1px solid rgba(200,169,110,0.3)',
          padding: '1px 5px',
          borderRadius: '2px',
          whiteSpace: 'nowrap',
        }}>
          L{lineNum}
        </div>
      </div>

      {/* Hover card */}
      {hover && (
        <div style={{
          position: 'absolute',
          bottom: '120%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#111',
          border: '1px solid #1E1E1E',
          padding: '12px',
          width: '200px',
          zIndex: 9999,
          pointerEvents: 'none',
        }}>
          {/* Gold top bar */}
          <div style={{ height: '2px', background: '#C8A96E', marginBottom: '10px' }} />

          {/* Avatar + name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            {image ? (
              <img src={image} alt={name} style={{
                width: '40px', height: '40px', objectFit: 'cover',
                border: '1px solid #1E1E1E'
              }} />
            ) : (
              <div style={{
                width: '40px', height: '40px', background: '#1A1A1A',
                border: '1px solid #1E1E1E', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'monospace', fontSize: '14px', color: '#C8A96E'
              }}>
                L{lineNum}
              </div>
            )}
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#C8A96E', letterSpacing: '0.1em' }}>
                Line {lineNum}
              </div>
              <div style={{ fontFamily: 'sans-serif', fontSize: '12px', color: '#F0EDE6', marginTop: '2px' }}>
                {name?.replace(` (Line ${lineNum})`, '') || 'Line Artist'}
              </div>
            </div>
          </div>

          {slug && (
            <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#666', letterSpacing: '0.05em' }}>
              theline.wtf/artists/{slug}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Custom message avatar showing Line badge
function LineAvatar({ user }: { user: any }) {
  const lineNum = user?.lineNumber
  const image = user?.image

  if (image) {
    return (
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <img src={image} alt={user?.name} style={{
          width: '32px', height: '32px', borderRadius: '2px', objectFit: 'cover',
          border: '1px solid #1E1E1E'
        }} />
        {(lineNum || lineNum === 0) && (
          <div style={{
            position: 'absolute', bottom: '-4px', right: '-4px',
            fontFamily: 'monospace', fontSize: '8px', color: '#0A0A0A',
            background: '#C8A96E', padding: '1px 3px', lineHeight: 1,
          }}>
            L{lineNum}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{
      width: '32px', height: '32px', background: '#1A1A1A',
      border: '1px solid rgba(200,169,110,0.4)', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'monospace', fontSize: '10px', color: '#C8A96E',
      letterSpacing: '0.05em',
    }}>
      {(lineNum || lineNum === 0) ? `L${lineNum}` : '?'}
    </div>
  )
}

export default function StreamChatUI({ walletAddress, shortAddress }: Props) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [step, setStep] = useState('Requesting token...')
  const [errorMsg, setErrorMsg] = useState('')
  const mountedRef = useRef(true)
  const clientRef = useRef<any>(null)
  const [chatData, setChatData] = useState<{ client: any; channel: any; tokenBody: any } | null>(null)

  useEffect(() => {
    mountedRef.current = true

    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY
    if (!apiKey) {
      setErrorMsg('NEXT_PUBLIC_STREAM_API_KEY not set')
      setStatus('error')
      return
    }

    const timeout = setTimeout(() => {
      if (mountedRef.current && status !== 'ready') {
        setErrorMsg(`Timed out at: ${step}`)
        setStatus('error')
      }
    }, 15000)

    ;(async () => {
      try {
        setStep('Requesting token...')
        const tokenRes = await fetch(`/api/members/chat-token?address=${walletAddress}`)
        const tokenBody = await tokenRes.json()
        if (!tokenRes.ok) throw new Error(`Token error (${tokenRes.status}): ${tokenBody.error ?? 'unknown'}`)
        const { token, displayName, userImage, lineNumber, slug } = tokenBody
        if (!mountedRef.current) return

        setStep('Connecting to Stream...')
        const { StreamChat } = await import('stream-chat')
        const client = new (StreamChat as any)(apiKey)
        clientRef.current = client

        const userProfile: any = { id: walletAddress, name: displayName || shortAddress }
        if (userImage) userProfile.image = userImage
        if (lineNumber !== null && lineNumber !== undefined) userProfile.lineNumber = lineNumber
        if (slug) userProfile.slug = slug

        await client.connectUser(userProfile, token)
        if (!mountedRef.current) { client.disconnectUser(); return }

        // Re-query user from Stream to pick up server-stored image (set by upsertUser)
        try {
          const { users } = await client.queryUsers({ id: { $eq: walletAddress } })
          if (users?.[0]?.image && !userProfile.image) {
            await client.partialUpdateUser({ id: walletAddress, set: { image: users[0].image } })
          }
        } catch {}

        setStep('Joining LARP channel...')
        const channel = client.channel('messaging', 'larp-main')
        await channel.watch()
        if (!mountedRef.current) { client.disconnectUser(); return }

        clearTimeout(timeout)
        setChatData({ client, channel, tokenBody })
        setStatus('ready')
      } catch (err: any) {
        clearTimeout(timeout)
        console.error('StreamChatUI error:', err)
        if (mountedRef.current) {
          setErrorMsg(`${step} - ${err.message ?? String(err)}`)
          setStatus('error')
        }
      }
    })()

    return () => {
      mountedRef.current = false
      clearTimeout(timeout)
      clientRef.current?.disconnectUser?.()
    }
  }, [walletAddress])

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
        <p className="font-mono text-xs text-line-muted tracking-widest text-center max-w-sm">{errorMsg}</p>
        <button onClick={() => window.location.reload()} className="btn-ghost">Retry</button>
      </div>
    )
  }

  if (status === 'loading' || !chatData) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner label={step} />
      </div>
    )
  }

  const { lineNumber, slug } = chatData.tokenBody

  return (
    <>
      <style>{`
        .larp-chat, .larp-chat .str-chat, .larp-chat .str-chat__container { height: 100%; }
        .larp-chat .str-chat-channel, .larp-chat .str-chat__main-panel { height: 100%; background: #0A0A0A; }
        .larp-chat .str-chat__list { background: #0A0A0A; padding: 16px; }
        .larp-chat .str-chat__message-input { background: #111111; border-top: 1px solid #1E1E1E; padding: 12px 16px; }
        .larp-chat .str-chat__message-input-inner { background: #161616; border: 1px solid #1E1E1E; border-radius: 2px; }
        .larp-chat .str-chat__textarea textarea { background: transparent; color: #F0EDE6; font-family: var(--font-sans); }
        .larp-chat .str-chat__header-livestream { background: #111111; border-bottom: 1px solid #1E1E1E; color: #F0EDE6; }
        .larp-chat .str-chat__header-livestream-left--title { color: #C8A96E; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; }
        .larp-chat .str-chat__message-text { color: #F0EDE6; }
        .larp-chat .str-chat__message-simple-name { color: #C8A96E; font-family: monospace; font-size: 11px; }
        .larp-chat .str-chat__date-separator-line { border-color: #1E1E1E; }
        .larp-chat .str-chat__date-separator-date { color: #666; background: #0A0A0A; font-size: 10px; }
        .larp-chat .str-chat__send-button { color: #C8A96E; }
        .larp-chat .str-chat__avatar { display: none; }
      `}</style>

      <div className="larp-chat h-full flex flex-col">
        {/* Header bar with identity */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-line-border bg-line-surface shrink-0">
          <div className="flex items-center gap-3">
            <LineAvatar user={chatData.client.user} />
            <div className="flex flex-col gap-0.5">
              <span className="font-sans text-xs text-line-text leading-none">
                {chatData.client.user?.name?.replace(` (Line ${lineNumber})`, '') || shortAddress}
              </span>
              {(lineNumber !== null && lineNumber !== undefined) && (
                <LineBadge user={{ ...chatData.client.user, lineNumber, slug }} />
              )}
            </div>
          </div>

          {/* Avatar upload */}
          <label className="font-mono text-[9px] text-line-accent tracking-widest cursor-pointer hover:opacity-70 transition-opacity">
            Update avatar
            <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file || file.size > 2 * 1024 * 1024) {
                alert('Image must be under 2MB')
                return
              }
              const reader = new FileReader()
              reader.onload = async (ev) => {
                const dataUrl = ev.target?.result as string
                const base64 = dataUrl.split(',')[1]
                try {
                  const res = await fetch('/api/members/avatar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ address: walletAddress, imageData: base64, mimeType: file.type }),
                  })
                  const data = await res.json()
                  if (data.imageUrl) {
                    await chatData.client.partialUpdateUser({
                      id: walletAddress,
                      set: { image: data.imageUrl }
                    }).catch(() => {})
                    // Force re-render by updating channel
                    window.location.reload()
                  }
                } catch (err) {
                  console.error('Avatar upload failed:', err)
                }
              }
              reader.readAsDataURL(file)
            }} />
          </label>
        </div>

        {/* Chat */}
        <div className="flex-1 min-h-0">
          <Chat client={chatData.client} theme="str-chat__theme-dark">
            <Channel channel={chatData.channel}>
              <Window>
                <ChannelHeader />
                <MessageList
                  Message={({ message }: any) => {
                    // Look up full user profile from Stream's client cache (has image)
                    const cachedUser = chatData.client.state?.users?.[message.user?.id]
                    const user = { ...message.user, ...cachedUser }
                    const msgLineNum = user?.lineNumber
                    return (
                      <div style={{ display: 'flex', gap: '10px', padding: '4px 0', alignItems: 'flex-start' }}>
                        <div style={{ position: 'relative' }}>
                          <LineAvatar user={user} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px', flexWrap: 'wrap' }}>
                            <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#C8A96E' }}>
                              {user?.name?.replace(` (Line ${msgLineNum})`, '') || user?.id?.slice(0,8) + '...'}
                            </span>
                            {(msgLineNum !== null && msgLineNum !== undefined) && (
                              <LineBadge user={user} />
                            )}
                            <span style={{ fontFamily: 'monospace', fontSize: '9px', color: '#444' }}>
                              {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div style={{ fontFamily: 'sans-serif', fontSize: '13px', color: '#F0EDE6', lineHeight: 1.5, wordBreak: 'break-word' }}>
                            {message.text}
                          </div>
                        </div>
                      </div>
                    )
                  }}
                />
                <MessageInput focus />
              </Window>
            </Channel>
          </Chat>
        </div>
      </div>
    </>
  )
}

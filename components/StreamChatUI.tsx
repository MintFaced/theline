// components/StreamChatUI.tsx
// Client-only via dynamic() - never SSR
'use client'
import { useState, useEffect, useRef } from 'react'
import { Chat, Channel, Window, MessageList, MessageInput, ChannelHeader } from 'stream-chat-react'
import 'stream-chat-react/dist/css/v2/index.css'
import { Spinner } from './LarpChat'



type Props = { walletAddress: string; shortAddress: string }

function AddPfpButton({ walletAddress, onUploaded }: { walletAddress: string; onUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  return (
    <label className={`font-mono text-[10px] tracking-widest uppercase border px-3 py-1.5 cursor-pointer transition-all ${
      uploading
        ? 'border-line-border text-line-muted opacity-50 cursor-not-allowed'
        : 'border-line-accent/40 text-line-accent hover:bg-line-accent hover:text-line-bg'
    }`}>
      {uploading ? 'Uploading...' : 'Add PFP'}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={uploading}
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (!file) return
          if (file.size > 2 * 1024 * 1024) { setError('Max 2MB'); return }
          setUploading(true)
          setError('')
          try {
            const reader = new FileReader()
            reader.onload = async (ev) => {
              const base64 = (ev.target?.result as string).split(',')[1]
              const res = await fetch('/api/members/avatar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: walletAddress, imageData: base64, mimeType: file.type }),
              })
              const data = await res.json()
              if (!res.ok) throw new Error(data.error || 'Upload failed')
              onUploaded(data.imageUrl)
            }
            reader.readAsDataURL(file)
          } catch (err: any) {
            setError(err.message)
            setUploading(false)
          }
        }}
      />
      {error && <span className="ml-2 text-red-400">{error}</span>}
    </label>
  )
}

export default function StreamChatUI({ walletAddress, shortAddress }: Props) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [step, setStep] = useState('Requesting token...')
  const [errorMsg, setErrorMsg] = useState('')
  const [pfpUrl, setPfpUrl] = useState<string | null>(null)
  const mountedRef = useRef(true)
  const clientRef = useRef<any>(null)
  const [chatData, setChatData] = useState<{ client: any; channel: any; tokenBody: any } | null>(null)

  useEffect(() => {
    mountedRef.current = true

    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY
    if (!apiKey) { setErrorMsg('Stream API key not set'); setStatus('error'); return }

    const timeout = setTimeout(() => {
      if (mountedRef.current && status !== 'ready') {
        setErrorMsg(`Timed out at: ${step}`); setStatus('error')
      }
    }, 15000)

    ;(async () => {
      try {
        setStep('Requesting token...')
        const tokenRes = await fetch(`/api/members/chat-token?address=${walletAddress}`)
        const tokenBody = await tokenRes.json()
        if (!tokenRes.ok) throw new Error(`Token error (${tokenRes.status}): ${tokenBody.error ?? 'unknown'}`)
        const { token, displayName, userImage } = tokenBody
        if (!mountedRef.current) return

        if (userImage) setPfpUrl(userImage)

        setStep('Connecting to Stream...')
        const { StreamChat } = await import('stream-chat')
        const client = new (StreamChat as any)(apiKey)
        clientRef.current = client

        const userProfile: any = { id: walletAddress, name: displayName || shortAddress }
        if (userImage) userProfile.image = userImage

        await client.connectUser(userProfile, token)
        if (!mountedRef.current) { client.disconnectUser(); return }

        setStep('Joining LARP channel...')
        const channel = client.channel('messaging', 'larp-main')
        await channel.watch()
        if (!mountedRef.current) { client.disconnectUser(); return }

        clearTimeout(timeout)
        setChatData({ client, channel, tokenBody })
        setStatus('ready')
      } catch (err: any) {
        clearTimeout(timeout)
        if (mountedRef.current) { setErrorMsg(`${step} - ${err.message ?? String(err)}`); setStatus('error') }
      }
    })()

    return () => {
      mountedRef.current = false
      clearTimeout(timeout)
      clientRef.current?.disconnectUser?.()
    }
  }, [walletAddress])

  const handlePfpUploaded = (url: string) => {
    setPfpUrl(url)
    // Server-side already updated Stream via partialUpdateUser in /api/members/avatar
    // Update local client state so header shows new image immediately
    if (chatData?.client?.user) {
      chatData.client.user.image = url
    }
  }

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

  const { lineNumber } = chatData.tokenBody

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
        .larp-chat .str-chat__avatar img { border-radius: 2px !important; border: 1px solid #1E1E1E; }
        .larp-chat .str-chat__avatar-fallback { border-radius: 2px !important; background: #1A1A1A !important; color: #C8A96E !important; font-family: monospace !important; font-size: 10px !important; border: 1px solid rgba(200,169,110,0.3); }
      `}</style>

      {/* Identity bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-line-border bg-line-surface shrink-0">
        <div className="flex items-center gap-3">
          {pfpUrl ? (
            <img src={pfpUrl} alt="pfp" className="w-8 h-8 object-cover" style={{ border: '1px solid #1E1E1E', borderRadius: '2px' }} />
          ) : (
            <div className="w-8 h-8 flex items-center justify-center bg-line-border" style={{ borderRadius: '2px' }}>
              <span className="font-mono text-[10px] text-line-accent">
                {lineNumber !== null && lineNumber !== undefined ? `L${lineNumber}` : '?'}
              </span>
            </div>
          )}
          <div>
            <p className="font-sans text-xs text-line-text leading-none">
              {chatData.client.user?.name?.replace(` (Line ${lineNumber})`, '') || shortAddress}
            </p>
            {lineNumber !== null && lineNumber !== undefined && (
              <p className="font-mono text-[9px] text-line-accent tracking-widest mt-0.5">Line {lineNumber}</p>
            )}
          </div>
        </div>
        <AddPfpButton walletAddress={walletAddress} onUploaded={handlePfpUploaded} />
      </div>

      {/* Chat */}
      <div className="larp-chat flex-1 min-h-0">
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

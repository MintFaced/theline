// components/StreamChatUI.tsx
// Client-only via dynamic() - never SSR
'use client'
import { useState, useEffect, useRef } from 'react'
import { Chat, Channel, Window, MessageList, MessageInput, ChannelHeader } from 'stream-chat-react'
import 'stream-chat-react/dist/css/v2/index.css'
import { Spinner } from './LarpChat'

type Props = { walletAddress: string; shortAddress: string }

export default function StreamChatUI({ walletAddress, shortAddress }: Props) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [step, setStep] = useState('Requesting token...')
  const [errorMsg, setErrorMsg] = useState('')
  const mountedRef = useRef(true)
  const clientRef = useRef<any>(null)
  const [chatData, setChatData] = useState<{ client: any; channel: any } | null>(null)

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
        const { token, displayName } = tokenBody
        if (!mountedRef.current) return

        setStep('Connecting to Stream...')
        const { StreamChat } = await import('stream-chat')
        const client = new (StreamChat as any)(apiKey)
        clientRef.current = client
        await client.connectUser({ id: walletAddress, name: displayName || shortAddress }, token)
        if (!mountedRef.current) { client.disconnectUser(); return }

        setStep('Joining LARP channel...')
        const channel = client.channel('messaging', 'larp-main')
        await channel.watch()
        if (!mountedRef.current) { client.disconnectUser(); return }

        clearTimeout(timeout)
        setChatData({ client, channel })
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

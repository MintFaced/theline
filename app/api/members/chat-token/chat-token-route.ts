// app/api/members/chat-token/route.ts
import { NextResponse } from 'next/server'
import { checkMembership } from '@/lib/alchemy'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')?.toLowerCase()

  if (!address) {
    return NextResponse.json({ error: 'Address required' }, { status: 400 })
  }

  const streamSecret = process.env.STREAM_SECRET_KEY
  const streamApiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY

  if (!streamSecret || !streamApiKey) {
    return NextResponse.json({ error: 'Stream not configured' }, { status: 500 })
  }

  try {
    // Call checkMembership directly — no self-referencing HTTP call
    const isMember = await checkMembership(address)
    if (!isMember) {
      return NextResponse.json({ error: 'Not a member' }, { status: 403 })
    }

    const { StreamChat } = await import('stream-chat')
    const serverClient = StreamChat.getInstance(streamApiKey, streamSecret)
    const token = serverClient.createToken(address)

    return NextResponse.json({ token })
  } catch (err) {
    console.error('Stream token error:', err)
    return NextResponse.json({ error: 'Token generation failed' }, { status: 500 })
  }
}

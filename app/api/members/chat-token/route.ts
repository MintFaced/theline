// app/api/members/chat-token/route.ts
import { NextResponse } from 'next/server'
import { checkMembership } from '@/lib/alchemy'

const CHANNEL_ID = 'larp-main'
const CHANNEL_TYPE = 'messaging'

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
    const isMember = await checkMembership(address)
    if (!isMember) {
      return NextResponse.json({ error: 'Not a member' }, { status: 403 })
    }

    const { StreamChat } = await import('stream-chat')
    const serverClient = StreamChat.getInstance(streamApiKey, streamSecret)

    // Upsert user with channel_member role so they can read/write
    await serverClient.upsertUser({
      id: address,
      role: 'user',
      name: address.slice(0, 8) + '...' + address.slice(-4),
    })

    // Get or create the channel and add this user as a member
    const channel = serverClient.channel(CHANNEL_TYPE, CHANNEL_ID, {
      name: 'LARP Chat',
      created_by_id: address,
    })

    await channel.create()

    // Add user as channel member so they have read/write access
    await channel.addMembers([address])

    const token = serverClient.createToken(address)

    return NextResponse.json({ token, channelId: CHANNEL_ID, channelType: CHANNEL_TYPE })
  } catch (err: any) {
    console.error('Stream token error:', err)
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}

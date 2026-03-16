// app/api/members/chat-token/route.ts
import { NextResponse } from 'next/server'
import { checkMembership } from '@/lib/alchemy'
import artistsData from '@/data/artists.json'

const CHANNEL_ID = 'larp-main'
const CHANNEL_TYPE = 'messaging'

// Build wallet -> artist lookup at module level (cached)
const walletMap: Record<string, { name: string; image?: string; lineNumber: number; slug: string }> = {}
for (const a of artistsData as any[]) {
  const w = a.walletAddress?.toLowerCase()
  if (w) {
    walletMap[w] = {
      name: a.name,
      image: a.galleryImage || a.heroImage || undefined,
      lineNumber: a.lineNumber,
      slug: a.slug,
    }
  }
}

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

    // Look up artist profile for this wallet
    const artist = walletMap[address]
    const shortAddr = address.slice(0, 6) + '...' + address.slice(-4)
    const displayName = artist ? `${artist.name} (Line ${artist.lineNumber})` : shortAddr

    // Upsert user with Line Artist name and gallery image
    // Only set image if we have one from our data — don't overwrite a custom one
    const userPayload: any = {
      id: address,
      name: displayName,
    }
    if (artist?.image) {
      userPayload.image = artist.image
    }

    await serverClient.upsertUser(userPayload)

    // Get or create channel and add member
    const channel = serverClient.channel(CHANNEL_TYPE, CHANNEL_ID, {
      name: 'LARP Chat',
      created_by_id: address,
    })
    await channel.create()
    await channel.addMembers([address])

    const token = serverClient.createToken(address)

    return NextResponse.json({
      token,
      channelId: CHANNEL_ID,
      channelType: CHANNEL_TYPE,
      displayName,
      hasLineProfile: !!artist,
      userImage: artist?.image || null,
    })
  } catch (err: any) {
    console.error('Stream token error:', err)
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}

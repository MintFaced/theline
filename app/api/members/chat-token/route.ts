// app/api/members/chat-token/route.ts
import { NextResponse } from 'next/server'
import { checkMembership } from '@/lib/alchemy'
import artistsData from '@/data/artists.json'

const CHANNEL_ID = 'larp-main'
const CHANNEL_TYPE = 'messaging'

// Build wallet -> artist lookup -- use LOWEST line number if wallet appears multiple times
const walletMap: Record<string, { name: string; image?: string; lineNumber: number; slug: string }> = {}
for (const a of artistsData as any[]) {
  const w = a.walletAddress?.toLowerCase()
  if (!w) continue
  const existing = walletMap[w]
  // Keep the entry with the lowest line number
  if (!existing || a.lineNumber < existing.lineNumber) {
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

    // Check if user already exists in Stream with a custom PFP
    let existingImage: string | null = null
    try {
      const { users } = await serverClient.queryUsers({ id: { $eq: address } })
      if (users?.[0]?.image) {
        existingImage = users[0].image as string
      }
    } catch {}

    // Build upsert payload -- never overwrite a custom PFP with the gallery image
    const userPayload: any = {
      id: address,
      name: displayName,
    }
    if (artist?.lineNumber !== undefined) userPayload.lineNumber = artist.lineNumber
    if (artist?.slug) userPayload.slug = artist.slug

    // Only set image if:
    // 1. No existing image (first time), OR
    // 2. Existing image is from our gallery (not a custom upload to R2 avatars bucket)
    const isCustomPfp = existingImage && existingImage.includes('theline-avatars')
    if (!isCustomPfp) {
      // Use custom PFP if set, otherwise fall back to gallery image
      userPayload.image = existingImage || artist?.image || null
    } else {
      // Keep custom PFP -- don't set image in payload, Stream keeps existing
      existingImage = existingImage // no-op, just clarity
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

    // Return the image to show -- custom PFP takes priority
    const imageToShow = isCustomPfp ? existingImage : (userPayload.image || null)

    return NextResponse.json({
      token,
      channelId: CHANNEL_ID,
      channelType: CHANNEL_TYPE,
      displayName,
      hasLineProfile: !!artist,
      userImage: imageToShow,
      lineNumber: artist?.lineNumber ?? null,
      slug: artist?.slug ?? null,
    })
  } catch (err: any) {
    console.error('Stream token error:', err)
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}

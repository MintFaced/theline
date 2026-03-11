// app/api/members/chat-token/route.ts
// Generates a Stream Chat user token for verified members

import { NextResponse } from 'next/server'

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

  // Verify membership before issuing token
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const memberRes = await fetch(`${appUrl}/api/membership/check?address=${address}`)
    const memberData = memberRes.ok ? await memberRes.json() : { isMember: false }

    if (!memberData.isMember) {
      return NextResponse.json({ error: 'Not a member' }, { status: 403 })
    }

    // Generate Stream token server-side (never expose STREAM_SECRET_KEY to client)
    const { StreamChat } = await import('stream-chat')
    const serverClient = StreamChat.getInstance(streamApiKey, streamSecret)
    const token = serverClient.createToken(address)

    return NextResponse.json({ token })
  } catch (err) {
    console.error('Stream token error:', err)
    return NextResponse.json({ error: 'Token generation failed' }, { status: 500 })
  }
}

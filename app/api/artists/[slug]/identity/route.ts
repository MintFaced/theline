// app/api/artists/[slug]/identity/route.ts
// Fetches Level and Rep from 6529 identity API using artist's wallet address or xHandle

import { NextResponse } from 'next/server'
import artistsData from '@/data/artists.json'
import type { Artist } from '@/types'

const artists = artistsData as Artist[]

export const revalidate = 3600 // 1 hour cache

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const artist = artists.find(a => a.slug === slug)

  if (!artist) return NextResponse.json(null)

  // Try wallet address first, then xHandle
  const identifiers = [
    artist.walletAddress,
    artist.xHandle?.replace('@', ''),
  ].filter(Boolean)

  for (const id of identifiers) {
    try {
      const res = await fetch(`https://api.6529.io/api/identities/${id}`, {
        next: { revalidate: 3600 },
        headers: { 'Accept': 'application/json' },
      })

      if (!res.ok) continue

      const data = await res.json()

      // Handle both array response and single object
      const identity = Array.isArray(data) ? data[0] : data

      if (!identity) continue

      const rep   = identity.rep   ?? identity.tdh_rank ?? null
      const level = identity.level ?? null

      if (rep !== null || level !== null) {
        return NextResponse.json({ rep, level })
      }
    } catch {
      continue
    }
  }

  return NextResponse.json(null)
}

// app/api/artists/[slug]/stats/route.ts
import { NextResponse } from 'next/server'
import artistsData from '@/data/artists.json'
import type { Artist } from '@/types'
import { resolveAddress, getSalesStats } from '@/lib/alchemy'

const artists = artistsData as Artist[]

export const revalidate = 3600 // 1 hour

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const artist = artists.find(a => a.slug === params.slug)
  if (!artist || !artist.walletAddress) {
    return NextResponse.json(null, { status: 404 })
  }

  try {
    const address = await resolveAddress(artist.walletAddress)
    const stats = await getSalesStats(address)
    if (!stats) return NextResponse.json(null, { status: 404 })
    return NextResponse.json(stats)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}

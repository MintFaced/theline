// app/api/artists/[slug]/stats/route.ts
import { NextResponse } from 'next/server'
import artistsData from '@/data/artists.json'
import type { Artist } from '@/types'
import { resolveAddress, getSalesStats } from '@/lib/alchemy'
import { getOpenSeaStats } from '@/lib/opensea'

const artists = artistsData as Artist[]

export const revalidate = 3600 // 1 hour

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const artist = artists.find(a => a.slug === slug)

  if (!artist || !artist.walletAddress) {
    return NextResponse.json(null, { status: 404 })
  }

  try {
    const address = await resolveAddress(artist.walletAddress)

    // Fetch from both sources in parallel
    const [alchemyStats, openSeaStats] = await Promise.all([
      getSalesStats(address),
      artist.blockchain !== 'tezos' ? getOpenSeaStats(address) : Promise.resolve(null),
    ])

    // Merge — prefer OpenSea for volume/sales (more accurate), Alchemy as fallback
    const merged = {
      totalSold:       openSeaStats?.totalSales  ?? alchemyStats?.totalSold       ?? 0,
      totalVolumeEth:  openSeaStats?.totalVolume ?? alchemyStats?.totalVolumeEth  ?? 0,
      avgPriceEth:     openSeaStats?.avgPrice    ?? alchemyStats?.avgPriceEth     ?? 0,
      floorPriceEth:   openSeaStats?.floorPrice  ?? null,
      lastSaleDate:    alchemyStats?.lastSaleDate ?? null,
      currency:        artist.blockchain === 'tezos' ? 'XTZ' : 'ETH',
    }

    return NextResponse.json(merged)
  } catch (err) {
    console.error('stats route error:', err)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}

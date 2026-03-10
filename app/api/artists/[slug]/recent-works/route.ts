// app/api/artists/[slug]/recent-works/route.ts
import { NextResponse } from 'next/server'
import artistsData from '@/data/artists.json'
import type { Artist } from '@/types'
import { resolveAddress, getCreatedNFTs } from '@/lib/alchemy'

const artists = artistsData as Artist[]

export const revalidate = 21600 // 6 hours

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const artist = artists.find(a => a.slug === params.slug)
  if (!artist || !artist.walletAddress) {
    return NextResponse.json([], { status: 200 })
  }

  try {
    const address = await resolveAddress(artist.walletAddress)
    const works = await getCreatedNFTs(address, 5)

    // Add marketplace URLs
    const withUrls = works.map(w => ({
      ...w,
      chain: artist.blockchain === 'tezos' ? 'XTZ' : 'ETH',
      marketplaceUrl: artist.blockchain === 'tezos'
        ? `https://objkt.com/profile/${artist.walletAddress}/created`
        : `https://opensea.io/assets/ethereum/${w.contractAddress}/${w.tokenId}`,
    }))

    return NextResponse.json(withUrls)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

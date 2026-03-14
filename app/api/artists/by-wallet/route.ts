// app/api/artists/by-wallet/route.ts
import { NextResponse } from 'next/server'
import artistsData from '@/data/artists.json'
import type { Artist } from '@/types'

const artists = artistsData as Artist[]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const wallet = searchParams.get('address')?.toLowerCase()

  if (!wallet) return NextResponse.json(null)

  const artist = artists.find(a =>
    a.walletAddress?.toLowerCase() === wallet
  )

  if (!artist) return NextResponse.json(null)

  // Return only the fields needed to pre-fill the form
  return NextResponse.json({
    name:          artist.name,
    lineNumber:    String(artist.lineNumber),
    xHandle:       artist.xHandle ?? '',
    bio:           artist.bioOverride ?? '',
    walletAddress: artist.walletAddress ?? '',
    collectUrl:    artist.purchaseUrl ?? '',
  })
}

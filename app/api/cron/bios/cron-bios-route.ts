// app/api/cron/bios/route.ts
import { NextResponse } from 'next/server'
import artistsData from '@/data/artists.json'
import type { Artist } from '@/types'
import { generateAndCacheBio } from '@/lib/bio'

const artists = artistsData as Artist[]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Accept secret via header OR query param (query param for browser testing)
  const headerAuth = request.headers.get('authorization')
  const querySecret = searchParams.get('secret')
  const cronSecret = process.env.CRON_SECRET

  const authorized =
    headerAuth === `Bearer ${cronSecret}` ||
    querySecret === cronSecret

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const singleSlug = searchParams.get('slug')

  if (singleSlug) {
    const artist = artists.find(a => a.slug === singleSlug)
    if (!artist) return NextResponse.json({ error: 'Artist not found' }, { status: 404 })
    if (artist.bioLocked) return NextResponse.json({ error: 'Bio is locked' }, { status: 403 })
    const bio = await generateAndCacheBio(artist)
    return NextResponse.json({ slug: singleSlug, bio, success: !!bio })
  }

  // Full run
  const eligible = artists.filter(a => !a.bioLocked)
  let generated = 0
  let failed = 0

  for (const artist of eligible) {
    try {
      const bio = await generateAndCacheBio(artist)
      if (bio) generated++
      else failed++
      await new Promise(r => setTimeout(r, 1200))
    } catch {
      failed++
    }
  }

  return NextResponse.json({ message: 'Bio cron complete', generated, failed, total: eligible.length })
}

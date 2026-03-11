// app/api/cron/bios/route.ts
// Runs weekly via Vercel Cron (Sunday 00:00 UTC)
// Can also be triggered manually:
//   curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://theline.nz/api/cron/bios
// Add ?slug=mintface to regenerate a single artist

import { NextResponse } from 'next/server'
import artistsData from '@/data/artists.json'
import type { Artist } from '@/types'
import { generateAndCacheBio } from '@/lib/bio'

const artists = artistsData as Artist[]

export async function GET(request: Request) {
  // Auth check
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Single artist mode: ?slug=mintface
  const { searchParams } = new URL(request.url)
  const singleSlug = searchParams.get('slug')

  if (singleSlug) {
    const artist = artists.find(a => a.slug === singleSlug)
    if (!artist) return NextResponse.json({ error: 'Artist not found' }, { status: 404 })
    if (artist.bioLocked) return NextResponse.json({ error: 'Bio is locked' }, { status: 403 })

    const bio = await generateAndCacheBio(artist)
    return NextResponse.json({ slug: singleSlug, bio, success: !!bio })
  }

  // Full run — skip locked bios
  const eligible = artists.filter(a => !a.bioLocked)
  let generated = 0
  let failed = 0
  const errors: string[] = []

  for (const artist of eligible) {
    try {
      const bio = await generateAndCacheBio(artist)
      if (bio) generated++
      else failed++
      // Rate limiting — X API v2 is 15 req/15min on free tier
      await new Promise(r => setTimeout(r, 1200))
    } catch (err) {
      failed++
      errors.push(`${artist.slug}: ${err}`)
    }
  }

  return NextResponse.json({
    message: 'Bio cron complete',
    generated,
    failed,
    total: eligible.length,
    errors: errors.slice(0, 10), // first 10 errors only
  })
}

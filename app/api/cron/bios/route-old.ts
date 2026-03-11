// app/api/cron/bios/route.ts
// Called weekly by Vercel Cron: Sunday 00:00 UTC
// Add to vercel.json: { "crons": [{ "path": "/api/cron/bios", "schedule": "0 0 * * 0" }] }

import { NextResponse } from 'next/server'
import artistsData from '@/data/artists.json'
import type { Artist } from '@/types'
import { generateAndCacheBio } from '@/lib/bio'

const artists = artistsData as Artist[]

export async function GET(request: Request) {
  // Verify this is a Vercel Cron call
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const eligible = artists.filter(a => !a.bioLocked)
  let generated = 0
  let failed = 0

  for (const artist of eligible) {
    try {
      await generateAndCacheBio(artist)
      generated++
      // Polite rate limiting — X API + Claude
      await new Promise(r => setTimeout(r, 500))
    } catch {
      failed++
    }
  }

  return NextResponse.json({
    message: `Bio cron complete`,
    generated,
    failed,
    total: eligible.length,
  })
}

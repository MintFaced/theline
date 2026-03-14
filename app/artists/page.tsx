// app/artists/page.tsx
import artistsData from '@/data/artists.json'
import type { Artist } from '@/types'
import { Suspense } from 'react'
import { ArtistDirectoryClient } from '@/components/ArtistDirectoryClient'

const artists = artistsData as Artist[]

export const metadata = {
  title: 'All Artists',
  description: 'Browse all 821 artists on The Line — from Line 0 to Line 899.',
}

export default function ArtistsPage() {
  return (
    <div className="bg-line-bg pt-28 pb-32 px-6">
      <div className="max-w-content mx-auto">
        <div className="mb-12">
          <p className="label mb-3">The Line</p>
          <h1 className="font-display font-light text-line-text"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '-0.02em' }}>
            All Artists
          </h1>
        </div>
        <Suspense fallback={<div className="font-mono text-xs text-line-muted py-16 text-center tracking-widest">Loading…</div>}>
          <ArtistDirectoryClient artists={artists} />
        </Suspense>
      </div>
    </div>
  )
}

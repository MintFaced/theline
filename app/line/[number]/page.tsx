// app/line/[number]/page.tsx
import { redirect, notFound } from 'next/navigation'
import artistsData from '@/data/artists.json'
import type { Artist } from '@/types'

const artists = artistsData as Artist[]

export async function generateStaticParams() {
  const lines: number[] = []
  for (const a of artists) for (const n of a.allLineNumbers) lines.push(n)
  return [...new Set(lines)].map(n => ({ number: String(n) }))
}

export default async function LinePage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params
  const lineNum = parseInt(number)
  if (isNaN(lineNum)) notFound()

  const artist = artists.find(a => a.allLineNumbers.includes(lineNum))
  if (!artist) notFound()

  redirect(`/artists/${artist.slug}`)
}

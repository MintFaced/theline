// app/map/page.tsx
import type { Metadata } from 'next'
import { CollectorMap } from '@/components/CollectorMap'

export const metadata: Metadata = {
  title: 'Collector Map — The Line',
  description: 'An interactive map of who has collected from who across all 784 artists on The Line.',
}

export default function MapPage() {
  return (
    <div className="bg-line-bg min-h-screen">
      <CollectorMap />
    </div>
  )
}

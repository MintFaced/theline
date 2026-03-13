// app/map/page.tsx
import type { Metadata } from 'next'
import { CollectorMap } from '@/components/CollectorMap'
import { Redis } from '@upstash/redis'

export const metadata: Metadata = {
  title: 'Collector Map — The Line',
  description: 'An interactive map of who has collected from who across all 784 artists on The Line.',
}

export const revalidate = 3600

async function getGraphData() {
  try {
    const redis = Redis.fromEnv()
    const raw = await redis.get<string>('graph:data')
    if (!raw) return null
    return typeof raw === 'string' ? JSON.parse(raw) : raw
  } catch {
    return null
  }
}

export default async function MapPage() {
  const graphData = await getGraphData()
  return <CollectorMap initialData={graphData} />
}

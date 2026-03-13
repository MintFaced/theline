// app/map/page.tsx
import type { Metadata } from 'next'
import { CollectorMap } from '@/components/CollectorMap'
import fs from 'fs'
import path from 'path'

export const metadata: Metadata = {
  title: 'Collector Map — The Line',
  description: 'An interactive map of who has collected from who across all 784 artists on The Line.',
}

function getGraphData() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'graph.json')
    const raw = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export default function MapPage() {
  const graphData = getGraphData()
  return <CollectorMap initialData={graphData} />
}

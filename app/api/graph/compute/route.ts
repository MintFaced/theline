// app/api/graph/compute/route.ts
// Hit this URL once to build the graph data:
// https://theline-j55m.vercel.app/api/graph/compute?secret=theline-cron-2026-ve3oe
//
// Takes 10-20 mins. Check progress at:
// https://theline-j55m.vercel.app/api/graph/compute?secret=...&status=1

import { NextResponse } from 'next/server'
import artistsData from '@/data/artists.json'
import type { Artist } from '@/types'

const artists = artistsData as Artist[]

const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY || 'v9UlBf_B4Oc0LKqLbD7KQ'
const BASE = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
const CRON_SECRET = process.env.CRON_SECRET || 'theline-cron-2026-ve3oe'

// Use Upstash Redis to store progress + result
import { Redis } from '@upstash/redis'

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

async function getTransfers(params: Record<string, string>) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 1, jsonrpc: '2.0',
      method: 'alchemy_getAssetTransfers',
      params: [{ ...params, category: ['erc721', 'erc1155'], withMetadata: false, excludeZeroValue: true, maxCount: '0x64' }]
    })
  })
  const data = await res.json()
  return data?.result?.transfers ?? []
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const statusOnly = searchParams.get('status')

  if (secret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const redis = Redis.fromEnv()

  // Status check
  if (statusOnly) {
    const progress = await redis.get<Record<string, boolean>>('graph:progress') ?? {}
    const result = await redis.get('graph:data')
    return NextResponse.json({
      processed: Object.keys(progress).length,
      total: artists.filter(a => a.walletAddress && a.blockchain !== 'tezos').length,
      complete: !!result,
    })
  }

  // Check if already complete
  const existing = await redis.get('graph:data')
  if (existing) {
    return NextResponse.json({ message: 'Graph already computed. Visit /map to view it.', done: true })
  }

  const ethArtists = artists.filter(a => a.walletAddress && a.blockchain !== 'tezos')
  const addrMap: Record<string, Artist> = {}
  for (const a of ethArtists) addrMap[a.walletAddress!.toLowerCase()] = a
  const lineAddrs = new Set(Object.keys(addrMap))

  // Load existing progress
  const progress = await redis.get<Record<string, boolean>>('graph:progress') ?? {}
  const edgeCounts = await redis.get<Record<string, number>>('graph:edges') ?? {}

  let processed = Object.keys(progress).length
  let batchCount = 0
  const BATCH_SIZE = 30 // process 30 per invocation to stay within Vercel timeout

  for (const artist of ethArtists) {
    if (batchCount >= BATCH_SIZE) break
    const addr = artist.walletAddress!.toLowerCase()
    if (progress[addr]) continue

    try {
      const [sent, received] = await Promise.all([
        getTransfers({ fromBlock: '0x0', toBlock: 'latest', fromAddress: addr }),
        getTransfers({ fromBlock: '0x0', toBlock: 'latest', toAddress: addr }),
      ])
      await sleep(250)

      for (const t of sent) {
        const to = t.to?.toLowerCase()
        if (to && lineAddrs.has(to) && to !== addr) {
          const key = `${addr}|${to}`
          edgeCounts[key] = (edgeCounts[key] ?? 0) + 1
        }
      }
      for (const t of received) {
        const from = t.from?.toLowerCase()
        if (from && lineAddrs.has(from) && from !== addr) {
          const key = `${from}|${addr}`
          edgeCounts[key] = (edgeCounts[key] ?? 0) + 1
        }
      }

      progress[addr] = true
      processed++
      batchCount++
    } catch {
      // skip and continue
    }
  }

  // Save progress
  await redis.set('graph:progress', progress)
  await redis.set('graph:edges', edgeCounts)

  const total = ethArtists.length
  const done = processed >= total

  if (done) {
    // Build final graph
    const nodes = ethArtists.map(a => ({
      id: a.walletAddress!.toLowerCase(),
      name: a.name,
      slug: a.slug,
      lineNumber: a.lineNumber,
      allLineNumbers: a.allLineNumbers,
      category: a.category,
      image: a.galleryImage ?? null,
      xHandle: a.xHandle ?? null,
    }))

    const edges = Object.entries(edgeCounts)
      .filter(([, count]) => count > 0)
      .map(([key, count]) => {
        const [source, target] = key.split('|')
        return { source, target, count }
      })

    const graph = {
      generated: new Date().toISOString(),
      nodeCount: nodes.length,
      edgeCount: edges.length,
      nodes,
      edges,
    }

    await redis.set('graph:data', JSON.stringify(graph), { ex: 60 * 60 * 24 * 30 }) // 30 days
    await redis.del('graph:progress')
    await redis.del('graph:edges')

    return NextResponse.json({ message: 'Graph complete!', nodeCount: nodes.length, edgeCount: edges.length, done: true })
  }

  return NextResponse.json({
    message: `Processing... ${processed}/${total} done. Hit this URL again to continue.`,
    processed,
    total,
    done: false,
  })
}

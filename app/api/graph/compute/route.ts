// app/api/graph/compute/route.ts
// Step 1 — resolve ENS:  /api/graph/compute?secret=...&phase=ens  (hit until done)
// Step 2 — compute:      /api/graph/compute?secret=...            (hit repeatedly ~25 batches)
// Step 3 — finish:       /api/graph/compute?secret=...&finish=1
// Status:                /api/graph/compute?secret=...&status=1
// Reset:                 /api/graph/compute?secret=...&reset=1

import { NextResponse } from 'next/server'
import artistsData from '@/data/artists.json'
import type { Artist } from '@/types'
import { Redis } from '@upstash/redis'

const artists = artistsData as Artist[]
const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY || 'v9UlBf_B4Oc0LKqLbD7KQ'
const BASE = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
const CRON_SECRET = process.env.CRON_SECRET || 'theline-cron-2026-ve3oe'

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

async function resolveENS(name: string): Promise<string | null> {
  try {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 1, jsonrpc: '2.0',
        method: 'alchemy_resolveName',
        params: [name]
      })
    })
    const data = await res.json()
    const addr = data?.result
    return addr && addr.startsWith('0x') ? addr.toLowerCase() : null
  } catch {
    return null
  }
}

async function getReceivedNFTs(toAddress: string): Promise<Array<{ from: string }>> {
  try {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 1, jsonrpc: '2.0',
        method: 'alchemy_getAssetTransfers',
        params: [{
          fromBlock: '0x0',
          toBlock: 'latest',
          toAddress,
          category: ['erc721', 'erc1155'],
          withMetadata: false,
          excludeZeroValue: true,
          maxCount: '0xC8',
        }]
      })
    })
    const data = await res.json()
    return (data?.result?.transfers ?? []).map((t: { from: string }) => ({
      from: (t.from ?? '').toLowerCase(),
    }))
  } catch {
    return []
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const redis = Redis.fromEnv()
  const ethArtists = artists.filter(a => a.walletAddress && a.blockchain !== 'tezos')

  // ── Reset ──
  if (searchParams.get('reset')) {
    await Promise.all([
      redis.del('graph:progress'),
      redis.del('graph:edges'),
      redis.del('graph:data'),
      redis.del('graph:resolved'),
    ])
    return NextResponse.json({ message: 'Reset. Start with ?phase=ens' })
  }

  // ── Status ──
  if (searchParams.get('status')) {
    const [progress, resolved, edges, done] = await Promise.all([
      redis.get<Record<string, boolean>>('graph:progress') ?? {},
      redis.get<Record<string, string>>('graph:resolved') ?? {},
      redis.get<Record<string, number>>('graph:edges') ?? {},
      redis.get('graph:data'),
    ])
    return NextResponse.json({
      ensResolved: Object.keys(resolved as object).length,
      processed: Object.keys(progress as object).length,
      total: ethArtists.length,
      edgesFound: Object.keys(edges as object).length,
      complete: !!done,
    })
  }

  // ── Phase: ENS resolution ──
  if (searchParams.get('phase') === 'ens') {
    const resolved = (await redis.get<Record<string, string>>('graph:resolved')) ?? {}
    const toResolve = ethArtists.filter(a =>
      !a.walletAddress!.startsWith('0x') && !resolved[a.walletAddress!.toLowerCase()]
    )
    let count = 0
    for (const artist of toResolve.slice(0, 50)) {
      const key = artist.walletAddress!.toLowerCase()
      const addr = await resolveENS(artist.walletAddress!)
      if (addr) { resolved[key] = addr; count++ }
      await sleep(150)
    }
    await redis.set('graph:resolved', resolved)
    const remaining = toResolve.length - count
    return NextResponse.json({
      message: remaining > 0 ? `Resolved ${count}. ${remaining} remaining — hit again.` : `All ENS resolved! Now hit without ?phase to compute edges.`,
      resolved: Object.keys(resolved).length, remaining,
    })
  }

  // ── Build final graph ──
  if (searchParams.get('finish')) {
    const [edgeCounts, resolved] = await Promise.all([
      redis.get<Record<string, number>>('graph:edges') ?? {},
      redis.get<Record<string, string>>('graph:resolved') ?? {},
    ])

    const nodes = ethArtists.map(a => {
      const raw = a.walletAddress!.toLowerCase()
      const id = raw.startsWith('0x') ? raw : ((resolved as Record<string,string>)[raw] ?? raw)
      return { id, name: a.name, slug: a.slug, lineNumber: a.lineNumber, allLineNumbers: a.allLineNumbers, category: a.category, image: a.galleryImage ?? null, xHandle: a.xHandle ?? null }
    })

    const edges = Object.entries(edgeCounts as Record<string,number>)
      .filter(([, c]) => c > 0)
      .map(([key, count]) => { const [source, target] = key.split('|'); return { source, target, count } })
      .sort((a, b) => b.count - a.count)

    const graph = { generated: new Date().toISOString(), nodeCount: nodes.length, edgeCount: edges.length, nodes, edges }
    await redis.set('graph:data', JSON.stringify(graph), { ex: 60 * 60 * 24 * 30 })
    await Promise.all([redis.del('graph:progress'), redis.del('graph:edges')])
    return NextResponse.json({ message: 'Graph built! Visit /map', nodeCount: nodes.length, edgeCount: edges.length })
  }

  // ── Main compute: who received NFTs from other Line artists ──
  const [resolved, progress, edgeCounts] = await Promise.all([
    redis.get<Record<string, string>>('graph:resolved') ?? {},
    redis.get<Record<string, boolean>>('graph:progress') ?? {},
    redis.get<Record<string, number>>('graph:edges') ?? {},
  ])

  // Build hex address set for all Line artists
  const lineAddrs = new Set<string>()
  for (const a of ethArtists) {
    const raw = a.walletAddress!.toLowerCase()
    const addr = raw.startsWith('0x') ? raw : ((resolved as Record<string,string>)[raw] ?? null)
    if (addr) lineAddrs.add(addr)
  }

  let batchCount = 0
  for (const artist of ethArtists) {
    if (batchCount >= 25) break
    const raw = artist.walletAddress!.toLowerCase()
    const addr = raw.startsWith('0x') ? raw : ((resolved as Record<string,string>)[raw] ?? null)
    const progressKey = addr ?? raw

    if ((progress as Record<string,boolean>)[progressKey]) continue
    if (!addr) { (progress as Record<string,boolean>)[progressKey] = true; continue }

    try {
      // For this artist's wallet: find all NFTs received from other Line artists
      // sender = Line artist who sold/gifted → receiver = this artist
      const received = await getReceivedNFTs(addr)
      await sleep(250)

      for (const t of received) {
        const NULL_ADDR = '0x0000000000000000000000000000000000000000'
        if (!t.from || t.from === NULL_ADDR || t.from === addr) continue
        if (!lineAddrs.has(t.from)) continue
        // Edge: from → addr (from sent NFT to this artist = a collector relationship)
        const key = `${t.from}|${addr}`
        ;(edgeCounts as Record<string,number>)[key] = ((edgeCounts as Record<string,number>)[key] ?? 0) + 1
      }

      ;(progress as Record<string,boolean>)[progressKey] = true
      batchCount++
    } catch {
      ;(progress as Record<string,boolean>)[progressKey] = true
    }
  }

  await Promise.all([
    redis.set('graph:progress', progress),
    redis.set('graph:edges', edgeCounts),
  ])

  const processed = Object.keys(progress as object).length
  const total = ethArtists.length
  const edgeCount = Object.keys(edgeCounts as object).length

  return NextResponse.json({
    message: processed >= total
      ? `All done! ${edgeCount} connections. Hit ?finish=1 to build graph.`
      : `${processed}/${total} — ${edgeCount} connections so far. Hit again to continue.`,
    processed, total, edgeCount,
  })
}

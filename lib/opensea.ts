// lib/opensea.ts
// OpenSea API v2 — sales data for ETH artists

const OPENSEA_KEY = process.env.OPENSEA_API_KEY

interface OpenSeaStats {
  floorPrice: number | null
  totalVolume: number
  totalSales: number
  avgPrice: number
  currency: 'ETH'
}

export async function getOpenSeaStats(walletAddress: string): Promise<OpenSeaStats | null> {
  if (!OPENSEA_KEY) return null

  try {
    // Fetch NFTs owned/created by this address to find their collections
    const nftsRes = await fetch(
      `https://api.opensea.io/api/v2/chain/ethereum/account/${walletAddress}/nfts?limit=50`,
      {
        headers: {
          'x-api-key': OPENSEA_KEY,
          'accept': 'application/json',
        },
        next: { revalidate: 3600 },
      }
    )
    if (!nftsRes.ok) return null
    const nftsData = await nftsRes.json()

    // Get unique contract addresses from their NFTs
    const contracts = [...new Set<string>(
      (nftsData.nfts ?? []).map((n: { contract: string }) => n.contract).filter(Boolean)
    )].slice(0, 5) // cap at 5 contracts

    if (contracts.length === 0) return null

    let totalVolume = 0
    let totalSales = 0
    let floorPrice: number | null = null

    // Fetch stats for each collection
    await Promise.all(contracts.map(async (contract) => {
      try {
        const statsRes = await fetch(
          `https://api.opensea.io/api/v2/collections/${contract}/stats`,
          {
            headers: { 'x-api-key': OPENSEA_KEY!, 'accept': 'application/json' },
            next: { revalidate: 3600 },
          }
        )
        if (!statsRes.ok) return
        const stats = await statsRes.json()
        const s = stats.total ?? {}
        totalVolume += Number(s.volume ?? 0)
        totalSales  += Number(s.sales ?? 0)
        const floor = Number(stats.intervals?.[0]?.floor_price ?? 0)
        if (floor > 0 && (floorPrice === null || floor < floorPrice)) {
          floorPrice = floor
        }
      } catch { /* skip this contract */ }
    }))

    return {
      floorPrice: floorPrice ? Math.round(floorPrice * 1000) / 1000 : null,
      totalVolume: Math.round(totalVolume * 100) / 100,
      totalSales,
      avgPrice: totalSales > 0 ? Math.round((totalVolume / totalSales) * 1000) / 1000 : 0,
      currency: 'ETH',
    }
  } catch (err) {
    console.error('getOpenSeaStats error:', err)
    return null
  }
}

// Fetch recent sales activity for Recent Works section
export async function getRecentSales(walletAddress: string, limit = 5) {
  if (!OPENSEA_KEY) return []

  try {
    const res = await fetch(
      `https://api.opensea.io/api/v2/events/accounts/${walletAddress}?event_type=sale&limit=${limit}`,
      {
        headers: { 'x-api-key': OPENSEA_KEY, 'accept': 'application/json' },
        next: { revalidate: 3600 },
      }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.asset_events ?? []
  } catch {
    return []
  }
}

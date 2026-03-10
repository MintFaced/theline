// lib/alchemy.ts
// Gracefully handles missing API keys — returns null/empty rather than crashing

const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY
const MEMBERSHIP_CONTRACT = process.env.MEMBERSHIP_CONTRACT_ADDRESS

export async function resolveAddress(address: string): Promise<string> {
  // If it's an ENS name, resolve it
  if (!address.startsWith('0x') && address.endsWith('.eth')) {
    if (!ALCHEMY_KEY) return address // can't resolve without key
    try {
      const res = await fetch(
        `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_call',
            params: [{ to: address }, 'latest'],
          }),
        }
      )
      const data = await res.json()
      return data.result ?? address
    } catch {
      return address
    }
  }
  return address
}

interface SalesStats {
  totalSold: number
  avgPriceEth: number
  avgPriceUsd: number
  totalVolumeEth: number
  totalVolumeUsd: number
  lastSaleDate: string | null
}

export async function getSalesStats(address: string): Promise<SalesStats | null> {
  if (!ALCHEMY_KEY) return null

  try {
    // Fetch NFT sales activity from Alchemy
    const res = await fetch(
      `https://eth-mainnet.g.alchemy.com/nft/v3/${ALCHEMY_KEY}/getNFTSales?fromAddress=${address}&limit=100&order=desc`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return null

    const data = await res.json()
    const sales: Array<{ sellerFee: { amount: string; decimals: number }; blockTimestamp: string }> = data.nftSales ?? []

    if (sales.length === 0) return null

    let totalVolumeWei = BigInt(0)
    let lastSaleDate: string | null = null

    for (const sale of sales) {
      const amount = BigInt(sale.sellerFee?.amount ?? '0')
      totalVolumeWei += amount
      if (!lastSaleDate && sale.blockTimestamp) {
        lastSaleDate = sale.blockTimestamp
      }
    }

    const totalVolumeEth = Number(totalVolumeWei) / 1e18
    const avgPriceEth = totalVolumeEth / sales.length

    // Rough USD estimate (no live price — would need price oracle)
    const ethUsd = 3200 // approximate; replace with live price if desired
    const totalVolumeUsd = Math.round(totalVolumeEth * ethUsd)
    const avgPriceUsd = Math.round(avgPriceEth * ethUsd)

    return {
      totalSold: sales.length,
      avgPriceEth: Math.round(avgPriceEth * 1000) / 1000,
      avgPriceUsd,
      totalVolumeEth: Math.round(totalVolumeEth * 100) / 100,
      totalVolumeUsd,
      lastSaleDate,
    }
  } catch (err) {
    console.error('getSalesStats error:', err)
    return null
  }
}

interface NFTWork {
  tokenId: string
  contractAddress: string
  title: string
  imageUrl: string
  animationUrl: string | null
  mintDate: string
  edition: string
}

export async function getCreatedNFTs(address: string, limit = 5): Promise<NFTWork[]> {
  if (!ALCHEMY_KEY) return []

  try {
    const res = await fetch(
      `https://eth-mainnet.g.alchemy.com/nft/v3/${ALCHEMY_KEY}/getNFTsForOwner?owner=${address}&withMetadata=true&pageSize=${limit}`,
      { next: { revalidate: 21600 } }
    )
    if (!res.ok) return []

    const data = await res.json()
    const nfts: Array<{
      tokenId: string
      contract: { address: string }
      name: string
      image: { cachedUrl?: string; originalUrl?: string }
      raw: { metadata: { animation_url?: string; attributes?: Array<{ trait_type: string; value: string }> } }
      timeLastUpdated: string
    }> = data.ownedNfts ?? []

    return nfts.slice(0, limit).map(nft => ({
      tokenId: nft.tokenId,
      contractAddress: nft.contract?.address ?? '',
      title: nft.name ?? 'Untitled',
      imageUrl: nft.image?.cachedUrl ?? nft.image?.originalUrl ?? '',
      animationUrl: nft.raw?.metadata?.animation_url ?? null,
      mintDate: nft.timeLastUpdated ?? '',
      edition: '1/1',
    }))
  } catch (err) {
    console.error('getCreatedNFTs error:', err)
    return []
  }
}

export async function checkMembership(address: string): Promise<boolean> {
  if (!ALCHEMY_KEY || !MEMBERSHIP_CONTRACT) return false

  try {
    const res = await fetch(
      `https://eth-mainnet.g.alchemy.com/nft/v3/${ALCHEMY_KEY}/isHolderOfContract?wallet=${address}&contractAddress=${MEMBERSHIP_CONTRACT}`,
      { next: { revalidate: 300 } }
    )
    if (!res.ok) return false
    const data = await res.json()
    return data.isHolderOfContract === true
  } catch {
    return false
  }
}

// lib/alchemy.ts

const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY!
const ETH_BASE = `https://eth-mainnet.g.alchemy.com/nft/v3/${ALCHEMY_KEY}`

export interface NFTItem {
  tokenId: string
  title: string
  imageUrl: string
  animationUrl: string | null
  mintDate: string
  edition: string
  contractAddress: string
}

export interface SalesStats {
  totalSold: number
  avgPriceEth: number
  avgPriceUsd: number
  totalVolumeEth: number
  totalVolumeUsd: number
  lastSaleDate: string | null
}

// Resolve ENS to 0x address
export async function resolveAddress(wallet: string): Promise<string> {
  if (wallet.startsWith('0x')) return wallet

  const res = await fetch(
    `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_call',
        params: [{
          to: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e', // ENS registry
          data: `0x0178b8bf${Buffer.from(wallet.replace('.eth', '')).toString('hex').padStart(64, '0')}`,
        }, 'latest'],
      }),
    }
  )
  const data = await res.json()
  return data.result || wallet
}

// Get NFTs created by this address (recent mints)
export async function getCreatedNFTs(address: string, limit = 5): Promise<NFTItem[]> {
  try {
    const res = await fetch(
      `${ETH_BASE}/getNFTsForOwner?owner=${address}&orderBy=transferTime&limit=${limit * 3}`,
      { next: { revalidate: 21600 } } // 6 hour ISR
    )
    if (!res.ok) return []
    const data = await res.json()

    // Filter to mints (from = zero address)
    const mints = (data.ownedNfts ?? [])
      .filter((nft: any) => nft.mint?.mintAddress === address)
      .slice(0, limit)

    return mints.map((nft: any) => ({
      tokenId: nft.tokenId,
      title: nft.name || nft.title || 'Untitled',
      imageUrl: nft.image?.cachedUrl || nft.image?.originalUrl || '',
      animationUrl: nft.animation?.cachedUrl || null,
      mintDate: nft.mint?.timestamp || nft.timeLastUpdated || '',
      edition: nft.tokenType === 'ERC721' ? '1/1' : `1/${nft.totalSupply || '?'}`,
      contractAddress: nft.contract?.address || '',
    }))
  } catch {
    return []
  }
}

// Get sales stats from OpenSea
export async function getSalesStats(address: string): Promise<SalesStats | null> {
  try {
    const OPENSEA_KEY = process.env.OPENSEA_API_KEY!
    const res = await fetch(
      `https://api.opensea.io/api/v2/accounts/${address}/stats`,
      {
        headers: { 'X-API-KEY': OPENSEA_KEY },
        next: { revalidate: 3600 }, // 1 hour ISR
      }
    )
    if (!res.ok) return null
    const data = await res.json()

    // Fetch ETH price for USD conversion
    const ethPrice = await getEthPrice()

    const totalVolumeEth = parseFloat(data.total?.volume ?? 0)
    const totalSold = parseInt(data.total?.num_sales ?? 0)
    const avgPriceEth = totalSold > 0 ? totalVolumeEth / totalSold : 0

    return {
      totalSold,
      avgPriceEth: Math.round(avgPriceEth * 1000) / 1000,
      avgPriceUsd: Math.round(avgPriceEth * ethPrice),
      totalVolumeEth: Math.round(totalVolumeEth * 100) / 100,
      totalVolumeUsd: Math.round(totalVolumeEth * ethPrice),
      lastSaleDate: data.last_sale?.event_timestamp ?? null,
    }
  } catch {
    return null
  }
}

// Check if address holds membership token
export async function checkMembership(address: string): Promise<boolean> {
  const contract = process.env.MEMBERSHIP_CONTRACT!
  try {
    const res = await fetch(
      `${ETH_BASE}/isHolderOfContract?wallet=${address}&contractAddress=${contract}`,
      { next: { revalidate: 0 } }
    )
    if (!res.ok) return false
    const data = await res.json()
    return data.isHolderOfContract === true
  } catch {
    return false
  }
}

// ETH/USD price from CoinGecko (no key needed)
export async function getEthPrice(): Promise<number> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      { next: { revalidate: 300 } } // 5 min cache
    )
    const data = await res.json()
    return data.ethereum?.usd ?? 3000
  } catch {
    return 3000 // fallback
  }
}

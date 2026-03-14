// lib/alchemy.ts
// Gracefully handles missing API keys — returns null/empty rather than crashing

const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY
const MEMBERSHIP_CONTRACT = process.env.MEMBERSHIP_CONTRACT_ADDRESS
const ALCHEMY_BASE = `https://eth-mainnet.g.alchemy.com`

export async function resolveAddress(address: string): Promise<string> {
  if (!address.startsWith('0x') && address.endsWith('.eth')) {
    if (!ALCHEMY_KEY) return address
    try {
      const res = await fetch(`${ALCHEMY_BASE}/v2/${ALCHEMY_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0', id: 1,
          method: 'eth_call',
          params: [{ to: address }, 'latest'],
        }),
      })
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
    const url = new URL(`${ALCHEMY_BASE}/nft/v3/${ALCHEMY_KEY}/getNFTSales`)
    url.searchParams.set('sellerAddress', address)
    url.searchParams.set('limit', '100')
    url.searchParams.set('order', 'desc')

    const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
    if (!res.ok) return null

    const data = await res.json()
    const sales: Array<{
      sellerFee: { amount: string; decimals: number }
      buyerFee: { amount: string; decimals: number }
      royaltyFee: { amount: string; decimals: number }
      blockTimestamp: string
    }> = data.nftSales ?? []

    if (sales.length === 0) return null

    let totalVolumeWei = BigInt(0)
    let lastSaleDate: string | null = null

    for (const sale of sales) {
      // Total sale price = sellerFee + buyerFee + royaltyFee
      const seller  = BigInt(sale.sellerFee?.amount  ?? '0')
      const buyer   = BigInt(sale.buyerFee?.amount   ?? '0')
      const royalty = BigInt(sale.royaltyFee?.amount ?? '0')
      totalVolumeWei += seller + buyer + royalty
      if (!lastSaleDate && sale.blockTimestamp) {
        lastSaleDate = sale.blockTimestamp
      }
    }

    const totalVolumeEth = Number(totalVolumeWei) / 1e18
    const avgPriceEth    = totalVolumeEth / sales.length
    const ethUsd         = 3200 // approximate — replace with live oracle if needed
    const totalVolumeUsd = Math.round(totalVolumeEth * ethUsd)
    const avgPriceUsd    = Math.round(avgPriceEth * ethUsd)

    return {
      totalSold:      sales.length,
      avgPriceEth:    Math.round(avgPriceEth * 1000) / 1000,
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
    const SKIP_CONTRACTS = [
      '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85', // ENS
      '0x22c1f6050e56d2876009903609a2cc3fef83b415', // POAP
      '0x495f947276749ce646f68ac8c248420045cb7b5e', // OpenSea shared storefront
    ]

    type AlchemyNFT = {
      tokenId: string
      contract: { address: string }
      name: string
      image: { cachedUrl?: string; originalUrl?: string; thumbnailUrl?: string }
      raw: { metadata: { animation_url?: string } }
      timeLastUpdated: string
      tokenType: string
    }

    let nfts: AlchemyNFT[] = []

    // Step 1: Get all NFTs owned by this address
    const ownedUrl = new URL(`${ALCHEMY_BASE}/nft/v3/${ALCHEMY_KEY}/getNFTsForOwner`)
    ownedUrl.searchParams.set('owner', address)
    ownedUrl.searchParams.set('withMetadata', 'true')
    ownedUrl.searchParams.set('pageSize', '50')
    ownedUrl.searchParams.set('excludeFilters[]', 'SPAM')
    const ownedRes = await fetch(ownedUrl.toString(), { next: { revalidate: 21600 } })
    const ownedData = ownedRes.ok ? await ownedRes.json() : { ownedNfts: [] }
    const allOwned: AlchemyNFT[] = ownedData.ownedNfts ?? []

    // Step 2: Check each contract to find ones where this wallet is the deployer
    const contractsChecked = new Map<string, boolean>()
    for (const nft of allOwned) {
      const contractAddr = nft.contract?.address?.toLowerCase()
      if (!contractAddr || SKIP_CONTRACTS.includes(contractAddr)) continue
      if (contractsChecked.has(contractAddr)) continue

      try {
        const metaUrl = `${ALCHEMY_BASE}/nft/v3/${ALCHEMY_KEY}/getContractMetadata?contractAddress=${contractAddr}`
        const metaRes = await fetch(metaUrl, { next: { revalidate: 86400 } })
        if (metaRes.ok) {
          const meta = await metaRes.json()
          const deployer = meta.contractDeployer?.toLowerCase()
          contractsChecked.set(contractAddr, deployer === address.toLowerCase())
        }
      } catch {
        contractsChecked.set(contractAddr, false)
      }
    }

    // Step 3: Keep only NFTs from contracts the artist deployed
    nfts = allOwned.filter(nft => {
      const addr = nft.contract?.address?.toLowerCase()
      return addr && contractsChecked.get(addr) === true
    })

    return nfts
      .filter(n => n.image?.cachedUrl || n.image?.originalUrl || n.image?.thumbnailUrl)
      .filter(n => n.name && n.name !== 'Unnamed' && !/^#?\d+$/.test(n.name))
      .slice(0, limit)
      .map(nft => ({
        tokenId:         nft.tokenId,
        contractAddress: nft.contract?.address ?? '',
        title:           nft.name ?? 'Untitled',
        imageUrl:        nft.image?.cachedUrl ?? nft.image?.thumbnailUrl ?? nft.image?.originalUrl ?? '',
        animationUrl:    nft.raw?.metadata?.animation_url ?? null,
        mintDate:        nft.timeLastUpdated ?? '',
        edition:         nft.tokenType === 'ERC1155' ? 'Edition' : '1/1',
      }))
  } catch (err) {
    console.error('getCreatedNFTs error:', err)
    return []
  }
}

const DEV_WALLETS = ['0xdd6b80649e8d472eb8fb52eb7eecfd2dc219ace7']

// All contracts that grant LARP chat access
// MEMBERSHIP_CONTRACT_ADDRESS = original LARP airdrop
// MANIFOLD_LARP_CONTRACT      = new Manifold mint contract (set in Vercel env)
async function holdsContract(address: string, contractAddress: string): Promise<boolean> {
  if (!ALCHEMY_KEY) return false
  try {
    const res = await fetch(
      `${ALCHEMY_BASE}/nft/v3/${ALCHEMY_KEY}/isHolderOfContract?wallet=${address}&contractAddress=${contractAddress}`,
      { next: { revalidate: 300 } }
    )
    if (!res.ok) return false
    const data = await res.json()
    return data.isHolderOfContract === true
  } catch {
    return false
  }
}

export async function checkMembership(address: string): Promise<boolean> {
  if (DEV_WALLETS.includes(address.toLowerCase())) return true
  if (!ALCHEMY_KEY) return false

  const contracts = [
    process.env.MEMBERSHIP_CONTRACT_ADDRESS,          // The Line contract (original + new mints)
  ].filter(Boolean) as string[]

  const results = await Promise.all(contracts.map(c => holdsContract(address, c)))
  return results.some(Boolean)
}

// Guardians contract: 0x36efbe5bfdd000a9149779f1c3f3adfba469b2ee
export async function checkGuardian(address: string): Promise<boolean> {
  if (DEV_WALLETS.includes(address.toLowerCase())) return true
  if (!ALCHEMY_KEY) return false
  const contract = process.env.MANIFOLD_GUARDIANS_CONTRACT_ADDRESS ?? '0x36efbe5bfdd000a9149779f1c3f3adfba469b2ee'
  return holdsContract(address, contract)
}

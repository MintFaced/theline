// app/api/artists/[slug]/ncm-lite/route.ts
// Discovers the artist's primary deployed contract and returns basic holder data.
// Used by the NcmLiteWidget on artist profile pages.
// Cached 24h — holder counts don't need to be real-time for the lite widget.

import { NextResponse } from 'next/server'
import artistsData from '@/data/artists.json'
import type { Artist } from '@/types'
import { resolveAddress } from '@/lib/alchemy'

const artists = artistsData as Artist[]

export const revalidate = 86400 // 24 hours

const ALCHEMY_KEY  = process.env.ALCHEMY_API_KEY
const ALCHEMY_BASE = 'https://eth-mainnet.g.alchemy.com'

// Contracts to ignore — shared infrastructure, not artist-owned collections
const SKIP_CONTRACTS = new Set([
  '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85', // ENS
  '0x22c1f6050e56d2876009903609a2cc3fef83b415', // POAP
  '0x495f947276749ce646f68ac8c248420045cb7b5e', // OpenSea shared storefront
  '0xd07dc4262bcdbf85190c01c996b4c06a461d2430', // Rarible ERC1155
  '0x60f80121c31a0d46b5279700f9df786054aa5ee5', // Rarible ERC721
])

interface ContractInfo {
  address: string
  name: string
  symbol: string
  tokenType: string
  totalSupply: string | null
  holderCount: number
}

async function getArtistContracts(walletAddress: string): Promise<ContractInfo[]> {
  if (!ALCHEMY_KEY) return []

  // Get NFTs owned by the artist to find their contract addresses
  const url = new URL(`${ALCHEMY_BASE}/nft/v3/${ALCHEMY_KEY}/getNFTsForOwner`)
  url.searchParams.set('owner', walletAddress)
  url.searchParams.set('withMetadata', 'false')
  url.searchParams.set('pageSize', '100')
  url.searchParams.set('excludeFilters[]', 'SPAM')

  const res  = await fetch(url.toString(), { next: { revalidate: 86400 } })
  if (!res.ok) return []
  const data = await res.json()
  const nfts: Array<{ contract: { address: string } }> = data.ownedNfts ?? []

  // Unique contract addresses
  const contractAddrs = [...new Set(
    nfts
      .map(n => n.contract?.address?.toLowerCase())
      .filter((a): a is string => !!a && !SKIP_CONTRACTS.has(a))
  )]

  // Check each contract — keep only those deployed by this wallet
  const results: ContractInfo[] = []
  await Promise.all(contractAddrs.map(async (contractAddr) => {
    try {
      const metaUrl  = `${ALCHEMY_BASE}/nft/v3/${ALCHEMY_KEY}/getContractMetadata?contractAddress=${contractAddr}`
      const metaRes  = await fetch(metaUrl, { next: { revalidate: 86400 } })
      if (!metaRes.ok) return
      const meta = await metaRes.json()

      const deployer = meta.contractDeployer?.toLowerCase()
      if (deployer !== walletAddress.toLowerCase()) return

      // Get owner/holder count
      const ownersUrl = new URL(`${ALCHEMY_BASE}/nft/v3/${ALCHEMY_KEY}/getOwnersForContract`)
      ownersUrl.searchParams.set('contractAddress', contractAddr)
      ownersUrl.searchParams.set('withTokenBalances', 'false')
      const ownersRes = await fetch(ownersUrl.toString(), { next: { revalidate: 86400 } })
      const ownersData = ownersRes.ok ? await ownersRes.json() : {}
      const holderCount = (ownersData.owners ?? []).length

      results.push({
        address:     contractAddr,
        name:        meta.name ?? 'Untitled Collection',
        symbol:      meta.symbol ?? '',
        tokenType:   meta.tokenType ?? 'ERC721',
        totalSupply: meta.totalSupply ?? null,
        holderCount,
      })
    } catch {
      // Skip contracts that error
    }
  }))

  // Sort by holder count desc — biggest collection first
  return results.sort((a, b) => b.holderCount - a.holderCount)
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const artist = artists.find(a => a.slug === slug)

  if (!artist || !artist.walletAddress || artist.blockchain !== 'ethereum') {
    return NextResponse.json(null, { status: 404 })
  }

  // Skip artists who already have a full NCM
  if (artist.ncm) {
    return NextResponse.json(null, { status: 404 })
  }

  try {
    const address   = await resolveAddress(artist.walletAddress)
    const contracts = await getArtistContracts(address)

    if (!contracts.length) {
      return NextResponse.json(null, { status: 404 })
    }

    // Return the primary collection (most holders)
    const primary = contracts[0]
    return NextResponse.json({
      contract:     primary.address,
      name:         primary.name,
      holderCount:  primary.holderCount,
      totalSupply:  primary.totalSupply,
      tokenType:    primary.tokenType,
      otherCount:   contracts.length - 1, // how many more collections exist
    })
  } catch (err) {
    console.error('ncm-lite error:', err)
    return NextResponse.json(null, { status: 500 })
  }
}

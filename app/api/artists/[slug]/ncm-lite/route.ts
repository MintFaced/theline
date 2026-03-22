// app/api/artists/[slug]/ncm-lite/route.ts
// Finds the artist's primary deployed contract and returns holder data.
// Uses getContractsForOwner — returns contracts deployed by the wallet
// regardless of whether the artist currently holds any tokens.

import { NextResponse } from 'next/server'
import artistsData from '@/data/artists.json'
import type { Artist } from '@/types'
import { resolveAddress } from '@/lib/alchemy'

const artists = artistsData as Artist[]

export const revalidate = 86400 // 24 hours

const ALCHEMY_KEY  = process.env.ALCHEMY_API_KEY
const ALCHEMY_BASE = 'https://eth-mainnet.g.alchemy.com'

// Shared/infrastructure contracts to ignore
const SKIP_CONTRACTS = new Set([
  '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
  '0x22c1f6050e56d2876009903609a2cc3fef83b415',
  '0x495f947276749ce646f68ac8c248420045cb7b5e',
  '0xd07dc4262bcdbf85190c01c996b4c06a461d2430',
  '0x60f80121c31a0d46b5279700f9df786054aa5ee5',
])

async function getDeployedContracts(walletAddress: string) {
  if (!ALCHEMY_KEY) return []

  // getContractsForOwner returns contracts deployed by this wallet
  const url = new URL(`${ALCHEMY_BASE}/nft/v3/${ALCHEMY_KEY}/getContractsForOwner`)
  url.searchParams.set('owner', walletAddress)
  url.searchParams.set('withMetadata', 'true')
  url.searchParams.set('pageSize', '20')
  url.searchParams.set('excludeFilters[]', 'SPAM')

  const res = await fetch(url.toString(), { next: { revalidate: 86400 } })
  if (!res.ok) return []
  const data = await res.json()

  const contracts: Array<{
    address: string
    contractDeployer: string
    name: string | null
    totalSupply: string | null
    tokenType: string
  }> = data.contracts ?? []

  // Filter to only contracts this wallet deployed, skip spam/shared
  return contracts.filter(c =>
    c.contractDeployer?.toLowerCase() === walletAddress.toLowerCase() &&
    !SKIP_CONTRACTS.has(c.address?.toLowerCase())
  )
}

async function getHolderCount(contractAddress: string): Promise<number> {
  if (!ALCHEMY_KEY) return 0
  try {
    const url = new URL(`${ALCHEMY_BASE}/nft/v3/${ALCHEMY_KEY}/getOwnersForContract`)
    url.searchParams.set('contractAddress', contractAddress)
    url.searchParams.set('withTokenBalances', 'false')
    const res  = await fetch(url.toString(), { next: { revalidate: 86400 } })
    const data = res.ok ? await res.json() : {}
    return (data.owners ?? []).length
  } catch {
    return 0
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug }   = await params
  const artist     = artists.find(a => a.slug === slug)

  if (!artist?.walletAddress || artist.blockchain !== 'ethereum') {
    return NextResponse.json(null, { status: 404 })
  }

  // Artists with a full NCM don't need the lite widget
  if (artist.ncm) {
    return NextResponse.json(null, { status: 404 })
  }

  if (!ALCHEMY_KEY) {
    return NextResponse.json(null, { status: 503 })
  }

  try {
    const address   = await resolveAddress(artist.walletAddress)
    const contracts = await getDeployedContracts(address)

    if (!contracts.length) {
      return NextResponse.json(null, { status: 404 })
    }

    // Get holder counts in parallel for all contracts
    const withHolders = await Promise.all(
      contracts.map(async c => ({
        ...c,
        holderCount: await getHolderCount(c.address),
      }))
    )

    // Sort by holder count, pick the biggest
    withHolders.sort((a, b) => b.holderCount - a.holderCount)
    const primary = withHolders[0]

    if (!primary.holderCount) {
      return NextResponse.json(null, { status: 404 })
    }

    return NextResponse.json({
      contract:    primary.address,
      name:        primary.name ?? 'Collection',
      holderCount: primary.holderCount,
      totalSupply: primary.totalSupply,
      tokenType:   primary.tokenType,
      otherCount:  contracts.length - 1,
    })
  } catch (err) {
    console.error('ncm-lite error:', err)
    return NextResponse.json(null, { status: 500 })
  }
}

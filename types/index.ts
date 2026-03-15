// types/index.ts

export interface Artist {
  lineNumber: number
  allLineNumbers: number[]
  slug: string
  name: string
  category: string
  blockchain: 'ethereum' | 'tezos' | string
  featured: boolean
  verified: boolean
  galleryImage: string | null
  galleryImageFile?: string
  oncyberUrl?: string | null
  oncyberUrls: string[]
  artworksDisplayed: number | null
  purchaseUrl: string | null
  description: string | null
  walletAddress: string | null
  walletType: 'eth' | 'ens' | 'tezos' | null
  xHandle: string | null
  bioOverride: string | null
  bioLocked: boolean
  heroImage: string | null
  lastActiveX?: string | null
  curations?: Array<{ key: string; label: string; url: string }>
}

export interface CollectorStats {
  totalSold: number
  avgPriceEth: number
  avgPriceUsd: number
  totalVolumeEth: number
  totalVolumeUsd: number
  lastSaleDate: string | null
  loading: boolean
  error: boolean
}

export interface RecentWork {
  tokenId: string
  title: string
  imageUrl: string
  animationUrl: string | null
  mintDate: string
  edition: string
  chain: string
  marketplaceUrl: string
}

export interface Article {
  slug: string
  title: string
  excerpt: string
  date: string
  imageUrl: string
  content?: string
}

export type ArtCategory =
  | 'lens-based'
  | 'illustration'
  | 'glitch'
  | 'ai'
  | 'generative'
  | '3d'
  | 'painting'
  | 'pure'
  | 'uncategorised'

export const CATEGORY_LABELS: Record<string, string> = {
  'lens-based':    'Lens Based',
  'illustration':  'Illustration',
  'glitch':        'Glitch',
  'ai':            'AI',
  'generative':    'Generative',
  '3d':            '3D',
  'painting':      'Painting',
  'pure':          'Pure',
  'uncategorised': 'Other',
}

export const LINE_MILESTONES = [0, 69, 100, 500, 900, 1000]
export const LINE_MAX = 1000
export const LINE_OCCUPIED = 899

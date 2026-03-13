// lib/bio.ts
import type { Artist } from '@/types'

export async function getBio(artist: Artist): Promise<string | null> {
  if (artist.bioLocked && artist.bioOverride) return artist.bioOverride
  if (artist.bioOverride) return artist.bioOverride

  // Try Upstash Redis cache
  if (process.env.UPSTASH_REDIS_REST_URL) {
    try {
      const { Redis } = await import('@upstash/redis')
      const redis = Redis.fromEnv()
      const cached = await redis.get<string>(`bio:${artist.slug}`)
      if (cached) return cached
    } catch { }
  }

  return artist.description ?? null
}

export async function generateAndCacheBio(artist: Artist): Promise<string | null> {
  if (!process.env.ANTHROPIC_API_KEY) return artist.description ?? null

  try {
    const bio = await generateWithClaude(artist)
    if (!bio) return artist.description ?? null

    // Cache in Upstash if available
    if (process.env.UPSTASH_REDIS_REST_URL) {
      try {
        const { Redis } = await import('@upstash/redis')
        const redis = Redis.fromEnv()
        await redis.set(`bio:${artist.slug}`, bio, { ex: 8 * 24 * 60 * 60 })
      } catch { }
    }

    return bio
  } catch (err) {
    console.error(`Bio generation failed for ${artist.slug}:`, err)
    return artist.description ?? null
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  'ai':               'AI and generative art',
  'glitch':           'glitch and digital manipulation',
  'lens-based':       'photography and lens-based work',
  'photography':      'photography',
  '3d':               '3D and digital sculpture',
  'animation':        'animation and motion art',
  'illustration':     'illustration and digital painting',
  'pixel':            'pixel art',
  'abstract':         'abstract digital art',
  'generative':       'generative and algorithmic art',
  'video':            'video and moving image',
  'collage':          'digital collage',
  'mixed-media':      'mixed media',
}

const CHAIN_LABELS: Record<string, string> = {
  'ethereum': 'Ethereum',
  'tezos':    'Tezos',
  'polygon':  'Polygon',
  'solana':   'Solana',
  'base':     'Base',
}

async function generateWithClaude(artist: Artist): Promise<string | null> {
  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const category    = CATEGORY_LABELS[artist.category] ?? artist.category ?? 'digital art'
  const chain       = CHAIN_LABELS[artist.blockchain ?? ''] ?? artist.blockchain ?? 'blockchain'
  const lineNumbers = artist.allLineNumbers.join(', ')
  const artworks    = artist.artworksDisplayed
  const xHandle     = artist.xHandle ? `@${artist.xHandle} on X/Twitter` : null
  const marketplace = artist.purchaseUrl ?? null

  // Build context from everything we have
  const contextLines = [
    `Name: ${artist.name}`,
    `Medium: ${category}`,
    `Chain: ${chain}`,
    `Line position(s): ${lineNumbers} of 1,000`,
    artworks    ? `Artworks displayed: ${artworks}` : null,
    xHandle     ? `Social: ${xHandle}` : null,
    marketplace ? `Sells on: ${marketplace}` : null,
    artist.description && artist.description.length > 20
      ? `Existing description (may be used as source): "${artist.description}"`
      : null,
  ].filter(Boolean).join('\n')

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    system: `You write wall text for a world-class digital art museum called The Line in Hawke's Bay, New Zealand.
The Line is a physical gallery displaying 1,000 cryptoartists — each given a numbered position on a 1,000-metre wall.
Tone: authoritative, warm, art-world calibre. Treat every artist as significant.
Rules:
- Exactly 3–4 sentences. No more, no less.
- No crypto slang ("web3", "space", "journey", "excited to share", "NFT artist").
- No fabricated specific facts (exhibitions, awards, prices, locations) unless in the source description.
- Write as if this artist's work belongs in a serious institution.
- If the existing description contains biographical facts, use them.
- End on something that places them within the broader context of digital art history.`,
    messages: [{
      role: 'user',
      content: `Write a 3–4 sentence museum wall text biography for this artist.\n\n${contextLines}`,
    }],
  })

  return message.content[0].type === 'text' ? message.content[0].text.trim() : null
}

// lib/bio.ts
import type { Artist } from '@/types'

export async function getBio(artist: Artist): Promise<string | null> {
  if (artist.bioLocked && artist.bioOverride) return artist.bioOverride
  if (artist.bioOverride) return artist.bioOverride

  // Try KV cache
  if (process.env.KV_REST_API_URL) {
    try {
      const { kv } = await import('@vercel/kv')
      const cached = await kv.get<string>(`bio:${artist.slug}`)
      if (cached) return cached
    } catch { }
  }

  return artist.description ?? null
}

export async function generateAndCacheBio(artist: Artist): Promise<string | null> {
  try {
    // Step 1 — fetch tweets if X handle exists
    let tweetContext = ''
    if (artist.xHandle) {
      try {
        tweetContext = await fetchRecentTweets(artist.xHandle)
      } catch { }
    }

    // Step 2 — build bio text
    let bio: string | null = null

    if (process.env.ANTHROPIC_API_KEY && tweetContext) {
      // Full mode — Claude generates polished bio from tweets
      bio = await generateWithClaude(artist, tweetContext)
    } else if (tweetContext) {
      // Fallback — use tweets directly as bio source (no Claude needed)
      bio = formatTweetsAsBio(artist, tweetContext)
    } else if (artist.description) {
      // Last resort — use existing description
      bio = artist.description
    }

    if (!bio) return null

    // Cache in KV if available
    if (process.env.KV_REST_API_URL) {
      try {
        const { kv } = await import('@vercel/kv')
        await kv.set(`bio:${artist.slug}`, bio, { ex: 8 * 24 * 60 * 60 })
      } catch { }
    }

    return bio
  } catch (err) {
    console.error(`Bio generation failed for ${artist.slug}:`, err)
    return null
  }
}

async function generateWithClaude(artist: Artist, tweetContext: string): Promise<string | null> {
  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const chainContext = [
    artist.blockchain ? `Blockchain: ${artist.blockchain}` : '',
    artist.artworksDisplayed ? `Artworks displayed: ${artist.artworksDisplayed}` : '',
    artist.category ? `Medium: ${artist.category}` : '',
  ].filter(Boolean).join('. ')

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 400,
    system: `You are writing wall text for a world-class digital art museum.
Tone: authoritative, warm, art-world calibre.
No crypto slang. No "journey". No "space". No "excited to share". No hype.
Write as if this artist's work sells for $60,000–$100,000 per piece.
Never fabricate specific facts. If uncertain, write with appropriate generality.`,
    messages: [{
      role: 'user',
      content: `Write a biography for ${artist.name}, a ${artist.category} artist. Position: The Line ${artist.allLineNumbers.join(', ')}.

Format: EXACTLY 4 sentences, then ONE blank line, then EXACTLY 3 sentences. No other format.

${chainContext}
Existing description: ${artist.description ?? 'None provided.'}
Recent posts: ${tweetContext}`,
    }],
  })

  return message.content[0].type === 'text' ? message.content[0].text : null
}

function formatTweetsAsBio(artist: Artist, tweetContext: string): string {
  // Without Claude, just use description + note tweets were found
  const base = artist.description ?? `${artist.name} is a ${artist.category} artist on The Line.`
  return base
}

async function fetchRecentTweets(handle: string): Promise<string> {
  const bearer = process.env.X_BEARER_TOKEN
  if (!bearer) return ''

  const userRes = await fetch(
    `https://api.twitter.com/2/users/by/username/${handle}`,
    { headers: { Authorization: `Bearer ${bearer}` } }
  )
  if (!userRes.ok) return ''
  const userData = await userRes.json()
  const userId = userData.data?.id
  if (!userId) return ''

  const tweetsRes = await fetch(
    `https://api.twitter.com/2/users/${userId}/tweets?max_results=20&exclude=retweets,replies&tweet.fields=text`,
    { headers: { Authorization: `Bearer ${bearer}` } }
  )
  if (!tweetsRes.ok) return ''
  const tweetsData = await tweetsRes.json()
  const tweets: string[] = (tweetsData.data ?? [])
    .map((t: { text: string }) => t.text)
    .filter((t: string) => t.length > 30)
    .slice(0, 12)

  return tweets.join('\n')
}

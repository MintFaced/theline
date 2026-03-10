// lib/bio.ts
import type { Artist } from '@/types'

export async function getBio(artist: Artist): Promise<string | null> {
  // Return override if locked
  if (artist.bioLocked && artist.bioOverride) return artist.bioOverride
  if (artist.bioOverride) return artist.bioOverride

  // Try KV cache
  try {
    const { kv } = await import('@vercel/kv')
    const cached = await kv.get<string>(`bio:${artist.slug}`)
    if (cached) return cached
  } catch {
    // KV not configured in dev — fall through
  }

  // Fall back to CSV description
  return artist.description ?? null
}

// Called by the weekly cron job — not used on page render
export async function generateAndCacheBio(artist: Artist): Promise<string | null> {
  try {
    const Anthropic = (await import('@anthropic-ai/sdk')).default
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    // Gather tweets if X handle exists
    let tweetContext = 'No social posts available.'
    if (artist.xHandle) {
      try {
        tweetContext = await fetchRecentTweets(artist.xHandle)
      } catch { /* silently skip */ }
    }

    // On-chain context
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

    const bio = message.content[0].type === 'text' ? message.content[0].text : null
    if (!bio) return null

    // Cache in KV
    try {
      const { kv } = await import('@vercel/kv')
      await kv.set(`bio:${artist.slug}`, bio, { ex: 8 * 24 * 60 * 60 }) // 8 days
    } catch { /* KV not available */ }

    return bio
  } catch (err) {
    console.error(`Bio generation failed for ${artist.slug}:`, err)
    return null
  }
}

async function fetchRecentTweets(handle: string): Promise<string> {
  const bearer = process.env.X_BEARER_TOKEN
  if (!bearer) return 'No Twitter/X credentials configured.'

  // Look up user ID
  const userRes = await fetch(
    `https://api.twitter.com/2/users/by/username/${handle}`,
    { headers: { Authorization: `Bearer ${bearer}` } }
  )
  if (!userRes.ok) return 'Could not fetch tweets.'
  const userData = await userRes.json()
  const userId = userData.data?.id
  if (!userId) return 'User not found.'

  // Fetch tweets
  const tweetsRes = await fetch(
    `https://api.twitter.com/2/users/${userId}/tweets?max_results=20&exclude=retweets,replies&tweet.fields=text`,
    { headers: { Authorization: `Bearer ${bearer}` } }
  )
  if (!tweetsRes.ok) return 'Could not fetch tweets.'
  const tweetsData = await tweetsRes.json()
  const tweets: string[] = (tweetsData.data ?? [])
    .map((t: { text: string }) => t.text)
    .filter((t: string) => t.length > 30) // filter out short engagement tweets
    .slice(0, 12)

  return tweets.length > 0 ? tweets.join('\n') : 'No substantial posts found.'
}

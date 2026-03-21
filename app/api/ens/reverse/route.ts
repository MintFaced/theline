// app/api/ens/reverse/route.ts
// Server-side ENS reverse lookup proxy.
// The browser can't call Ethereum RPCs directly (CORS). This route runs
// server-side where there are no CORS restrictions, then returns the result.
//
// POST /api/ens/reverse
// Body: { addresses: string[] }   — up to 50 addresses per call
// Returns: { results: Record<string, string | null> }

import { NextResponse } from 'next/server'

// Use Alchemy if available (already in env), otherwise fall back to public RPCs
const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY
const RPC_URL     = ALCHEMY_KEY
  ? `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
  : 'https://eth.llamarpc.com'

const ENS_REGISTRY = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'

// ── Minimal namehash (no deps needed server-side) ─────────────────────────
import { createHash } from 'crypto'

function keccak256(data: Buffer): Buffer {
  // Node.js crypto doesn't have keccak256 natively — use a fallback
  // We import from viem on the server side where it's safe
  return data // placeholder — see below
}

// Use viem server-side (fine — no browser/CORS constraints here)
import { namehash } from 'viem'

// ── RPC helper ────────────────────────────────────────────────────────────
async function ethCall(to: string, data: string): Promise<string> {
  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0', id: 1, method: 'eth_call',
      params: [{ to, data }, 'latest']
    })
  })
  const json = await res.json()
  if (json.error) throw new Error(json.error.message)
  return json.result ?? '0x'
}

function decodeAddress(hex: string): string | null {
  if (!hex || hex === '0x' || hex.length < 42) return null
  const addr = '0x' + hex.slice(-40)
  if (addr === '0x' + '0'.repeat(40)) return null
  return addr
}

function decodeString(hex: string): string | null {
  if (!hex || hex === '0x') return null
  const h      = hex.slice(2)
  const offset = parseInt(h.slice(0, 64), 16) * 2
  const len    = parseInt(h.slice(offset, offset + 64), 16) * 2
  if (!len) return null
  const bytes  = h.slice(offset + 64, offset + 64 + len)
  let out = ''
  for (let i = 0; i < bytes.length; i += 2) {
    const code = parseInt(bytes.slice(i, i + 2), 16)
    if (code >= 32 && code < 127) out += String.fromCharCode(code)
  }
  return out.trim() || null
}

async function resolveOne(addr: string): Promise<string | null> {
  try {
    const reversed = addr.slice(2).toLowerCase() + '.addr.reverse'
    const node     = namehash(reversed)
    const nodeHex  = node.slice(2)

    // Step 1: Registry → resolver address for this reverse node
    const resolverRaw  = await ethCall(ENS_REGISTRY, '0x0178b8bf' + nodeHex)
    const resolverAddr = decodeAddress(resolverRaw)
    if (!resolverAddr) return null

    // Step 2: resolver → name
    const nameRaw = await ethCall(resolverAddr, '0x691f3431' + nodeHex)
    return decodeString(nameRaw)
  } catch {
    return null
  }
}

// ── Route handler ─────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const { addresses } = await request.json() as { addresses: string[] }

    if (!Array.isArray(addresses) || addresses.length === 0) {
      return NextResponse.json({ error: 'addresses array required' }, { status: 400 })
    }

    // Cap at 50 per request to keep response times reasonable
    const batch   = addresses.slice(0, 50)
    const settled = await Promise.allSettled(batch.map(resolveOne))

    const results: Record<string, string | null> = {}
    settled.forEach((r, i) => {
      results[batch[i]] = r.status === 'fulfilled' ? r.value : null
    })

    return NextResponse.json({ results })
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

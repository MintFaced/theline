// lib/sheets.ts
// Appends a row to a named sheet tab in the configured Google Spreadsheet.
// Requires three Vercel env vars:
//   GOOGLE_SHEETS_CLIENT_EMAIL   — service account email
//   GOOGLE_SHEETS_PRIVATE_KEY    — service account private key (with \n escaped)
//   GOOGLE_SHEETS_SPREADSHEET_ID — the Sheet ID from the URL

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
const CLIENT_EMAIL   = process.env.GOOGLE_SHEETS_CLIENT_EMAIL
const PRIVATE_KEY    = (() => {
  const key = process.env.GOOGLE_SHEETS_PRIVATE_KEY
  if (!key) return undefined
  // Handle both literal \n and already-newlined versions
  return key.includes('\\n') ? key.replace(/\\n/g, '\n') : key
})()

// ── JWT auth ──────────────────────────────────────────────────────────────────

async function getAccessToken(): Promise<string> {
  if (!CLIENT_EMAIL || !PRIVATE_KEY) throw new Error('Missing Google Sheets credentials')

  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const payload = {
    iss: CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }

  const encode = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString('base64url')

  const unsigned = `${encode(header)}.${encode(payload)}`

  // Sign with RS256 using Web Crypto API (available in Edge + Node)
  const keyData = PRIVATE_KEY!
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '')

  const binaryKey = Buffer.from(keyData, 'base64')

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    Buffer.from(unsigned)
  )

  const jwt = `${unsigned}.${Buffer.from(signature).toString('base64url')}`

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  const data = await res.json()
  if (!data.access_token) throw new Error(`Auth failed: ${JSON.stringify(data)}`)
  return data.access_token
}

// ── Append row ─────────────────────────────────────────────────────────────────

export async function appendRow(sheet: string, values: string[]): Promise<void> {
  if (!SPREADSHEET_ID) throw new Error('Missing GOOGLE_SHEETS_SPREADSHEET_ID')

  const token = await getAccessToken()

  const range = encodeURIComponent(`${sheet}!A1`)
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: [values] }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Sheets append failed: ${err}`)
  }
}

export async function readSheet(sheet: string): Promise<string[][]> {
  const token = await getAccessToken()
  const range = encodeURIComponent(`${sheet}!A:Z`)
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) return []
  const data = await res.json()
  return data.values || []
}

// app/api/members/avatar/route.ts
// Uploads avatar to R2 using direct HTTP (no AWS SDK needed)

import { NextResponse } from 'next/server'
import { createHmac, createHash } from 'crypto'

function sha256(data: Buffer | string): string {
  return createHash('sha256').update(data).digest('hex')
}

function hmacSha256(key: Buffer | string, data: string): Buffer {
  return createHmac('sha256', key).update(data).digest()
}

function getSignatureKey(secretKey: string, dateStamp: string, region: string, service: string): Buffer {
  const kDate    = hmacSha256(Buffer.from('AWS4' + secretKey), dateStamp)
  const kRegion  = hmacSha256(kDate, region)
  const kService = hmacSha256(kRegion, service)
  const kSigning = hmacSha256(kService, 'aws4_request')
  return kSigning
}

async function uploadToR2(
  buffer: Buffer,
  key: string,
  contentType: string,
  accountId: string,
  accessKey: string,
  secretKey: string,
  bucket: string
): Promise<string> {
  const region = 'auto'
  const service = 's3'
  const endpoint = `https://${accountId}.r2.cloudflarestorage.com`
  const host = `${accountId}.r2.cloudflarestorage.com`

  const now = new Date()
  const amzDate = now.toISOString().replace(/[:\-]|\.\d{3}/g, '').slice(0, 15) + 'Z'
  const dateStamp = amzDate.slice(0, 8)

  const payloadHash = sha256(buffer)

  const canonicalHeaders = `content-type:${contentType}\nhost:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`
  const signedHeaders = 'content-type;host;x-amz-content-sha256;x-amz-date'
  const canonicalRequest = [
    'PUT',
    `/${bucket}/${key}`,
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n')

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`
  const stringToSign = ['AWS4-HMAC-SHA256', amzDate, credentialScope, sha256(Buffer.from(canonicalRequest))].join('\n')

  const signingKey = getSignatureKey(secretKey, dateStamp, region, service)
  const signature = createHmac('sha256', signingKey).update(stringToSign).digest('hex')
  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

  const url = `${endpoint}/${bucket}/${key}`
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
      'Host': host,
      'x-amz-content-sha256': payloadHash,
      'x-amz-date': amzDate,
      'Authorization': authorization,
    },
    body: new Uint8Array(buffer) as unknown as BodyInit,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`R2 upload failed: ${res.status} ${text}`)
  }

  return key
}

export async function POST(request: Request) {
  try {
    const { address, imageData, mimeType } = await request.json()

    if (!address || !imageData) {
      return NextResponse.json({ error: 'address and imageData required' }, { status: 400 })
    }

    const R2_ACCOUNT   = process.env.R2_ACCOUNT_ID
    const R2_ACCESS    = process.env.R2_ACCESS_KEY_ID
    const R2_SECRET    = process.env.R2_SECRET_ACCESS_KEY
    const R2_BUCKET    = process.env.R2_BUCKET_NAME || 'theline-avatars'
    const R2_PUB_URL   = process.env.R2_AVATAR_PUBLIC_URL || process.env.R2_PUBLIC_URL || ''
    const streamApiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY
    const streamSecret = process.env.STREAM_SECRET_KEY

    if (!streamApiKey || !streamSecret) {
      return NextResponse.json({ error: 'Stream not configured' }, { status: 500 })
    }

    const imageBuffer = Buffer.from(imageData, 'base64')
    const ext = mimeType?.includes('png') ? 'png' : 'jpg'
    const key = `avatars/${address.toLowerCase()}.${ext}`
    let imageUrl = ''

    if (R2_ACCOUNT && R2_ACCESS && R2_SECRET) {
      await uploadToR2(imageBuffer, key, mimeType || 'image/jpeg', R2_ACCOUNT, R2_ACCESS, R2_SECRET, R2_BUCKET)
      imageUrl = `${R2_PUB_URL}/${key}`
    } else {
      // Fallback: store as Stream CDN upload isn't possible without SDK
      return NextResponse.json({ error: 'R2 not configured' }, { status: 500 })
    }

    // Update Stream user with the new image URL
    const { StreamChat } = await import('stream-chat')
    const serverClient = StreamChat.getInstance(streamApiKey, streamSecret)
    await serverClient.partialUpdateUser({
      id: address.toLowerCase(),
      set: { image: imageUrl },
    })

    return NextResponse.json({ imageUrl })
  } catch (err: any) {
    console.error('Avatar upload error:', err)
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}

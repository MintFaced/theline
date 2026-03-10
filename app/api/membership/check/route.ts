// app/api/membership/check/route.ts
import { NextResponse } from 'next/server'
import { checkMembership } from '@/lib/alchemy'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')

  if (!address) return NextResponse.json({ isMember: false })

  const isMember = await checkMembership(address)
  return NextResponse.json({ isMember }, {
    headers: { 'Cache-Control': 'private, max-age=300' }, // 5 min cache per user
  })
}

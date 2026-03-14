// app/api/forms/update/route.ts
import { NextResponse } from 'next/server'
import { appendRow } from '@/lib/sheets'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, lineNumber, xHandle, bio, walletAddress, collectUrl, availableWorks, notes } = body

    if (!name || !email || !lineNumber) {
      return NextResponse.json({ error: 'Name, email and line number required' }, { status: 400 })
    }

    const timestamp = new Date().toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland' })

    await appendRow('Update Bio', [
      timestamp,
      name,
      email,
      lineNumber      || '',
      xHandle         || '',
      bio             || '',
      walletAddress   || '',
      collectUrl      || '',
      availableWorks  || '',
      notes           || '',
    ])

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Update form error:', err)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}

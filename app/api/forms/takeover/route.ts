// app/api/forms/takeover/route.ts
import { NextResponse } from 'next/server'
import { appendRow } from '@/lib/sheets'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, lineNumber, xHandle, workDescription, workUrl, format, preferredWeek, notes } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email required' }, { status: 400 })
    }

    const timestamp = new Date().toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland' })

    await appendRow('Takeover', [
      timestamp,
      name,
      email,
      lineNumber      || '',
      xHandle         || '',
      workDescription || '',
      workUrl         || '',
      format          || '',
      preferredWeek   || '',
      notes           || '',
    ])

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Takeover form error:', err)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}

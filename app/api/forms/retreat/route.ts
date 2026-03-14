// app/api/forms/retreat/route.ts
import { NextResponse } from 'next/server'
import { appendRow } from '@/lib/sheets'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, lineNumber, xHandle, medium, whyAttend, dietary } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email required' }, { status: 400 })
    }

    const timestamp = new Date().toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland' })

    await appendRow('Retreat', [
      timestamp,
      name,
      email,
      lineNumber  || '',
      xHandle     || '',
      medium      || '',
      whyAttend   || '',
      dietary     || '',
    ])

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Retreat form error:', err)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}

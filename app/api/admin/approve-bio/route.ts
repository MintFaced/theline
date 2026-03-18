// app/api/admin/approve-bio/route.ts
// Approves a bio update submission from the Google Sheet
// POST with { lineNumber, secret } to approve
// GET with ?secret=xxx to list pending submissions

import { NextResponse } from 'next/server'
import { appendRow, readSheet } from '@/lib/sheets'

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'theline-admin-2026'

// GET — list pending bio updates from the Update Bio sheet
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const rows = await readSheet('Update Bio')
    // Skip header row, return all submissions
    // Columns: Date | Name | Email | Line | X Handle | Bio | Wallet | Collect Link | # Works
    const submissions = rows.slice(1).map((row, i) => ({
      index: i + 2,
      timestamp: row[0] || '',
      lineNumber: isApproved ? row[1] || '' : row[3] || '',
      handle:     isApproved ? row[2] || '' : row[4] || '',
      bio:        isApproved ? row[3] || '' : row[5] || '',
      wallet:     isApproved ? row[4] || '' : row[6] || '',
      collectLink:isApproved ? row[5] || '' : row[7] || '',
      name:       isApproved ? '' : row[1] || '',
      email:      isApproved ? '' : row[2] || '',
      worksAvailable: isApproved ? '' : row[8] || '',
    })).filter(s => s.lineNumber)

    return NextResponse.json({ submissions, total: submissions.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST — approve a specific submission by line number
export async function POST(request: Request) {
  const { secret, lineNumber, bio, handle, wallet, collectLink } = await request.json()

  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!lineNumber) {
    return NextResponse.json({ error: 'lineNumber required' }, { status: 400 })
  }

  try {
    // Store approval in a separate Approved sheet for audit trail
    await appendRow('Approved Bios', [
      new Date().toISOString(),
      String(lineNumber),
      handle || '',
      bio || '',
      wallet || '',
      collectLink || '',
    ])

    return NextResponse.json({ ok: true, approved: { lineNumber, bio, handle, wallet, collectLink } })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

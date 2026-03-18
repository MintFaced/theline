'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || ''

type Submission = {
  index: number
  timestamp: string
  email: string
  lineNumber: string
  handle: string
  bio: string
  wallet: string
  superrare: string
  selfVerified: string
}

export default function AdminPage() {
  const [secret, setSecret] = useState('')
  const [authed, setAuthed] = useState(false)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(false)
  const [approving, setApproving] = useState<number | null>(null)
  const [approved, setApproved] = useState<Set<string>>(new Set())
  const [msg, setMsg] = useState('')

  const load = async (s: string) => {
    setLoading(true)
    const res = await fetch(`/api/admin/approve-bio?secret=${s}`)
    const data = await res.json()
    if (res.ok) {
      setSubmissions(data.submissions)
      setAuthed(true)
    } else {
      setMsg('Wrong password')
    }
    setLoading(false)
  }

  const approve = async (s: Submission) => {
    setApproving(s.index)
    const res = await fetch('/api/admin/approve-bio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret,
        lineNumber: s.lineNumber,
        bio: s.bio,
        handle: s.handle,
        wallet: s.wallet,
        superrare: s.superrare,
      }),
    })
    const data = await res.json()
    if (res.ok) {
      setApproved(prev => new Set([...prev, s.lineNumber]))
      setMsg(`Line ${s.lineNumber} approved! Now update artists.json manually or run the update script.`)
    } else {
      setMsg(`Error: ${data.error}`)
    }
    setApproving(null)
  }

  if (!authed) {
    return (
      <div className="bg-line-bg min-h-screen flex items-center justify-center" style={{ paddingTop: 'var(--nav-height)' }}>
        <div className="max-w-sm w-full px-6">
          <p className="label mb-6">Admin</p>
          <input
            type="password"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && load(secret)}
            placeholder="Admin password"
            className="w-full bg-line-bg border border-line-border px-4 py-3 font-mono text-sm text-line-text mb-3 focus:outline-none focus:border-line-accent"
          />
          <button onClick={() => load(secret)} disabled={loading} className="btn-primary w-full">
            {loading ? 'Loading...' : 'Sign in'}
          </button>
          {msg && <p className="font-mono text-[10px] text-red-400 mt-3">{msg}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-line-bg min-h-screen" style={{ paddingTop: 'var(--nav-height)' }}>
      <div className="max-w-content mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="label mb-2">Admin</p>
            <h1 className="font-display font-light text-4xl text-line-text" style={{ letterSpacing: '-0.02em' }}>
              Bio Update Submissions
            </h1>
          </div>
          <span className="font-mono text-[10px] text-line-muted tracking-widest">
            {submissions.length} pending
          </span>
        </div>

        {msg && (
          <div className="border border-line-accent/30 bg-line-surface px-6 py-4 mb-8">
            <p className="font-mono text-[11px] text-line-accent tracking-widest">{msg}</p>
          </div>
        )}

        {submissions.length === 0 && (
          <p className="font-mono text-sm text-line-muted">No submissions yet.</p>
        )}

        <div className="space-y-px bg-line-border">
          {submissions.map(s => {
            const isApproved = approved.has(s.lineNumber)
            return (
              <div key={s.index} className={`bg-line-bg p-8 ${isApproved ? 'opacity-40' : ''}`}>
                <div className="flex items-start justify-between gap-8 mb-6">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[10px] text-line-accent tracking-widest">Line {s.lineNumber}</span>
                    {s.selfVerified && <span className="font-mono text-[9px] text-line-accent/60 tracking-widest border border-line-accent/30 px-2 py-0.5">SELF VERIFIED</span>}
                    <a href={`/artists/${String(s.lineNumber)}`} target="_blank" rel="noopener noreferrer"
                      className="font-mono text-[9px] text-line-muted hover:text-line-accent tracking-widest transition-colors">
                      View profile
                    </a>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => approve(s)}
                      disabled={!!approving || isApproved}
                      className="font-mono text-[10px] tracking-widest uppercase border border-line-accent/40 text-line-accent px-4 py-2 hover:bg-line-accent hover:text-line-bg transition-all disabled:opacity-30"
                    >
                      {approving === s.index ? 'Approving...' : isApproved ? 'Approved' : 'Approve'}
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {s.email && (
                      <div>
                        <p className="font-mono text-[9px] text-line-muted/60 tracking-widest uppercase mb-1">Email</p>
                        <p className="font-sans text-sm text-line-muted">{s.email}</p>
                      </div>
                    )}
                    {s.handle && (
                      <div>
                        <p className="font-mono text-[9px] text-line-muted/60 tracking-widest uppercase mb-1">X Handle</p>
                        <p className="font-mono text-sm text-line-text">{s.handle}</p>
                      </div>
                    )}
                    {s.wallet && (
                      <div>
                        <p className="font-mono text-[9px] text-line-muted/60 tracking-widest uppercase mb-1">Wallet</p>
                        <p className="font-mono text-xs text-line-muted break-all">{s.wallet}</p>
                      </div>
                    )}
                    {s.superrare && (
                      <div>
                        <p className="font-mono text-[9px] text-line-muted/60 tracking-widest uppercase mb-1">SuperRare</p>
                        <a href={s.superrare} target="_blank" rel="noopener noreferrer"
                          className="font-mono text-xs text-line-accent hover:opacity-70 transition-opacity break-all">
                          {s.superrare}
                        </a>
                      </div>
                    )}
                    <div>
                      <p className="font-mono text-[9px] text-line-muted/60 tracking-widest uppercase mb-1">Submitted</p>
                      <p className="font-mono text-xs text-line-muted">{s.timestamp}</p>
                    </div>
                  </div>

                  {s.bio && (
                    <div>
                      <p className="font-mono text-[9px] text-line-muted/60 tracking-widest uppercase mb-2">Bio</p>
                      <p className="font-sans text-sm text-line-muted leading-relaxed">{s.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

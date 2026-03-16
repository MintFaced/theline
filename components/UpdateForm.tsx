'use client'
// components/UpdateForm.tsx
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

type Status = 'idle' | 'sending' | 'sent' | 'error'

interface FormData {
  name: string
  email: string
  lineNumber: string
  xHandle: string
  bio: string
  walletAddress: string
  collectUrl: string
  availableWorks: string
  notes: string
}

const DEFAULT_FORM: FormData = {
  name: '', email: '', lineNumber: '', xHandle: '',
  bio: '', walletAddress: '', collectUrl: '', availableWorks: '', notes: '',
}

// Inner form — receives pre-filled data and selfVerified flag
function UpdateFormInner({ prefill, selfVerified }: { prefill: Partial<FormData>, selfVerified: boolean }) {
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState<FormData>({ ...DEFAULT_FORM, ...prefill })

  // Re-fill if prefill changes (wallet connects after mount)
  useEffect(() => {
    setForm(prev => ({ ...prev, ...prefill }))
  }, [JSON.stringify(prefill)])

  const set = (k: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.lineNumber) return
    setStatus('sending')
    try {
      const res = await fetch('/api/forms/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, selfVerified }),
      })
      if (res.ok) {
        setStatus('sent')
      } else {
        console.error('Form error:', res.status)
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="border border-line-border p-8">
        <p className="font-mono text-[10px] text-line-accent tracking-widest uppercase mb-3">Received</p>
        <p className="font-display font-light text-2xl text-line-text mb-3" style={{ letterSpacing: '-0.01em' }}>
          We&apos;ll get that updated
        </p>
        <p className="font-sans text-sm text-line-muted leading-relaxed">
          Thanks {form.name}. Your update request has been sent — we&apos;ll apply the changes to your profile within a few days.
        </p>
      </div>
    )
  }

  const inputClass = "w-full bg-line-surface border border-line-border px-4 py-3 font-sans text-sm text-line-text placeholder:text-line-muted focus:outline-none focus:border-line-accent transition-colors"
  const lockedClass = "w-full bg-line-bg border border-line-border/50 px-4 py-3 font-sans text-sm text-line-muted cursor-not-allowed"
  const labelClass = "font-mono text-[10px] text-line-muted tracking-widest uppercase mb-2 block"
  const hintClass = "font-mono text-[9px] text-line-muted tracking-wide mt-1.5 block"

  return (
    <div className="space-y-8">

      {/* Verified badge */}
      {selfVerified && (
        <div className="flex items-center gap-3 border border-line-accent/20 bg-line-accent/5 px-4 py-3">
          <div className="w-1.5 h-1.5 rounded-full bg-line-accent shrink-0" />
          <p className="font-mono text-[10px] text-line-accent tracking-widest uppercase">
            Wallet verified — profile pre-filled from your Line data
          </p>
        </div>
      )}

      {/* Identity */}
      <div>
        <p className="font-mono text-[10px] text-line-accent tracking-widest uppercase mb-5">Who are you</p>
        <div className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Name *</label>
              {selfVerified ? (
                <div className={lockedClass}>{form.name}</div>
              ) : (
                <input type="text" value={form.name} onChange={set('name')} placeholder="Your name" className={inputClass} />
              )}
            </div>
            <div>
              <label className={labelClass}>Email *</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" className={inputClass} />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Line Number *</label>
              {selfVerified ? (
                <div className={lockedClass}>{form.lineNumber} <span className="text-line-accent/60 text-[9px] ml-2">auto-filled</span></div>
              ) : (
                <input
                  type="text"
                  value={form.lineNumber}
                  onChange={set('lineNumber')}
                  placeholder="e.g. 42"
                  className={inputClass}
                />
              )}
            </div>
            <div>
              <label className={labelClass}>X / Twitter handle</label>
              <input type="text" value={form.xHandle} onChange={set('xHandle')} placeholder="@handle" className={inputClass} />
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="border-t border-line-border pt-8">
        <p className="font-mono text-[10px] text-line-accent tracking-widest uppercase mb-5">Bio</p>
        <div>
          <label className={labelClass}>Updated bio</label>
          <textarea
            value={form.bio}
            onChange={set('bio')}
            placeholder="Write your bio here — 2–4 sentences works best."
            rows={5}
            className={inputClass + " resize-none"}
          />
          <span className={hintClass}>Leave blank if no change needed.</span>
        </div>
      </div>

      {/* Wallet & Collection */}
      <div className="border-t border-line-border pt-8">
        <p className="font-mono text-[10px] text-line-accent tracking-widest uppercase mb-5">Wallet &amp; Collection</p>
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Wallet address you mint from</label>
            <input
              type="text"
              value={form.walletAddress}
              onChange={set('walletAddress')}
              placeholder="0x… or yourname.eth or tz1…"
              className={inputClass}
            />
            <span className={hintClass}>ETH, ENS, or Tezos address. Used to pull your on-chain stats.</span>
          </div>
          <div>
            <label className={labelClass}>Collect link — where should &ldquo;Collect [Your Name]&rdquo; point?</label>
            <input
              type="url"
              value={form.collectUrl}
              onChange={set('collectUrl')}
              placeholder="https://opensea.io/yourname  or  https://objkt.com/profile/yourname"
              className={inputClass}
            />
            <span className={hintClass}>Your OpenSea, Objkt, Foundation, or any marketplace profile URL.</span>
          </div>
          <div>
            <label className={labelClass}>Approximately how many works do you have available to collect right now?</label>
            <select value={form.availableWorks} onChange={set('availableWorks')} className={inputClass}>
              <option value="">Select range</option>
              <option value="0">None at the moment</option>
              <option value="1-5">1–5 works</option>
              <option value="6-20">6–20 works</option>
              <option value="21-50">21–50 works</option>
              <option value="50+">50+ works</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="border-t border-line-border pt-8">
        <p className="font-mono text-[10px] text-line-accent tracking-widest uppercase mb-5">Anything else</p>
        <div>
          <label className={labelClass}>Other changes or corrections</label>
          <textarea
            value={form.notes}
            onChange={set('notes')}
            placeholder="Wrong category? Image broken? Name spelled incorrectly? Tell us here."
            rows={3}
            className={inputClass + " resize-none"}
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={status === 'sending' || !form.name || !form.email || !form.lineNumber}
        className="btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? 'Sending…' : 'Submit update'}
      </button>

      {status === 'error' && (
        <p className="font-mono text-[10px] text-red-400 tracking-widest">
          Something went wrong. Email us directly at mintface@digitalartisteconomy.com
        </p>
      )}
    </div>
  )
}

// Privy wallet detector — wraps the form
function UpdateFormWithWallet() {
  const { usePrivy } = require('@privy-io/react-auth')
  const { ready, authenticated, login, user } = usePrivy()
  const [prefill, setPrefill] = useState<Partial<FormData>>({})
  const [selfVerified, setSelfVerified] = useState(false)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    const wallet = user?.wallet?.address
    if (!authenticated || !wallet) {
      setPrefill({})
      setSelfVerified(false)
      return
    }
    setChecking(true)
    fetch(`/api/artists/by-wallet?address=${wallet}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setPrefill(data)
          setSelfVerified(true)
        }
        setChecking(false)
      })
      .catch(() => setChecking(false))
  }, [authenticated, user?.wallet?.address])

  return (
    <div>
      {/* Wallet connect prompt */}
      {!authenticated && (
        <div className="mb-8 border border-line-border p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] text-line-accent tracking-widest uppercase mb-1">Line Artist?</p>
            <p className="font-sans text-sm text-line-muted">
              Connect your wallet and we&apos;ll pre-fill this form from your profile.
            </p>
          </div>
          <button onClick={login} className="btn-outline shrink-0">
            Connect wallet →
          </button>
        </div>
      )}

      {checking && (
        <p className="font-mono text-[10px] text-line-muted tracking-widest mb-8">Checking wallet…</p>
      )}

      {authenticated && !selfVerified && !checking && (
        <div className="mb-8 border border-line-border/50 p-6">
          <p className="font-mono text-[10px] text-line-muted tracking-widest uppercase mb-1">Wallet not matched</p>
          <p className="font-sans text-sm text-line-muted">
            This wallet isn&apos;t linked to a Line artist profile. Fill in your details below.
          </p>
        </div>
      )}

      <UpdateFormInner prefill={prefill} selfVerified={selfVerified} />
    </div>
  )
}

// Top-level export — uses dynamic import to avoid SSR issues with Privy
const UpdateFormWithWalletDynamic = dynamic(
  () => Promise.resolve(UpdateFormWithWallet),
  { ssr: false, loading: () => <UpdateFormInner prefill={{}} selfVerified={false} /> }
)

export function UpdateForm() {
  const hasPrivy = !!process.env.NEXT_PUBLIC_PRIVY_APP_ID
  if (!hasPrivy) return <UpdateFormInner prefill={{}} selfVerified={false} />
  return <UpdateFormWithWalletDynamic />
}

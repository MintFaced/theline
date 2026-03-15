'use client'
// components/JoinButtons.tsx
import { useState } from 'react'

export function JoinButtons({ manifoldUrl }: { manifoldUrl: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleStripe = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Something went wrong')
        setLoading(false)
      }
    } catch {
      setError('Something went wrong. Try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Fiat — Stripe */}
      <button
        onClick={handleStripe}
        disabled={loading}
        className="btn-primary text-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Redirecting…' : 'Subscribe $10 / month →'}
      </button>

      {/* ETH — Manifold */}
      <a
        href={manifoldUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-outline text-center"
      >
        Mint with ETH on Manifold →
      </a>

      {error && (
        <p className="font-mono text-[10px] text-red-400 tracking-widest text-center">{error}</p>
      )}

      <p className="font-mono text-[9px] text-line-muted tracking-widest text-center">
        Both options include LARP Chat access
      </p>
    </div>
  )
}

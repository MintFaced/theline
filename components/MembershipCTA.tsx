'use client'
// components/MembershipCTA.tsx
import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Artist } from '@/types'

export function MembershipCTA({ artist }: { artist: Artist }) {
  const hasPrivy = !!process.env.NEXT_PUBLIC_PRIVY_APP_ID

  return (
    <div className="grid md:grid-cols-2 gap-px bg-line-border">
      <div className="bg-line-bg p-8 md:p-10">
        <p className="label mb-6">Profile</p>
        {hasPrivy ? (
          <PrivyMembershipPanel artistName={artist.name} />
        ) : (
          <div>
            <Link href="/update" className="font-mono text-[11px] text-line-muted hover:text-line-accent transition-colors tracking-widest uppercase">
              Update your profile →
            </Link>
            <p className="font-sans text-xs text-line-muted/60 mt-3 leading-relaxed">
              Let collectors meet the 2026 you.
            </p>
          </div>
        )}
      </div>
      <div className="bg-line-bg p-8 md:p-10 flex flex-col justify-between">
        <div>
          <p className="label mb-6">Collect</p>
          <p className="font-sans text-sm text-line-muted mb-6 leading-relaxed">
            Collect {artist.name}&apos;s work directly on the blockchain.
            {artist.artworksDisplayed && (
              <> {artist.artworksDisplayed} artworks available.</>
            )}
          </p>
        </div>
        <a
          href={artist.purchaseUrl ?? 'https://opensea.io'}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Collect {artist.name}&apos;s Work →
        </a>
      </div>
    </div>
  )
}

function PrivyMembershipPanel({ artistName }: { artistName: string }) {
  const { usePrivy } = require('@privy-io/react-auth')
  const { ready, authenticated, login, user } = usePrivy()
  const [isMember, setIsMember] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    if (!authenticated || !user?.wallet?.address) return
    setChecking(true)
    fetch(`/api/membership/check?address=${user.wallet.address}`)
      .then(r => r.ok ? r.json() : { isMember: false })
      .then(data => { setIsMember(data.isMember); setChecking(false) })
      .catch(() => { setIsMember(false); setChecking(false) })
  }, [authenticated, user?.wallet?.address])

  if (!ready || checking) {
    return <div className="skeleton h-4 w-48 rounded" />
  }

  if (!authenticated) {
    return (
      <div>
        <Link href="/update" className="font-mono text-[11px] text-line-muted hover:text-line-accent transition-colors tracking-widest uppercase">
          Update your profile →
        </Link>
        <p className="font-sans text-xs text-line-muted/60 mt-3 leading-relaxed">
          Let collectors meet the 2026 you.
        </p>
      </div>
    )
  }

  if (isMember) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-line-accent" />
          <p className="font-mono text-xs text-line-accent tracking-widest">LARP member verified</p>
        </div>
        <p className="font-sans text-sm text-line-muted mb-6 leading-relaxed">
          Welcome to the party. One room, all Line Artists.
        </p>
        <Link href="/members/chat" className="btn-primary">Enter LARP Chat →</Link>
      </div>
    )
  }

  return (
    <div>
      <Link href="/update" className="font-mono text-[11px] text-line-muted hover:text-line-accent transition-colors tracking-widest uppercase">
        Update your profile →
      </Link>
      <p className="font-sans text-xs text-line-muted/60 mt-3 leading-relaxed">
        Let collectors meet the 2026 you.
      </p>
    </div>
  )
}

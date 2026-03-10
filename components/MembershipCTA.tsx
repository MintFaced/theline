'use client'
// components/MembershipCTA.tsx
import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Artist } from '@/types'

export function MembershipCTA({ artist }: { artist: Artist }) {
  const [privyState, setPrivyState] = useState<{
    ready: boolean
    authenticated: boolean
    isMember: boolean | null
    checking: boolean
  }>({ ready: false, authenticated: false, isMember: null, checking: false })

  const hasPrivy = !!process.env.NEXT_PUBLIC_PRIVY_APP_ID

  useEffect(() => {
    if (!hasPrivy) {
      setPrivyState(s => ({ ...s, ready: true }))
      return
    }

    import('@privy-io/react-auth').then(({ usePrivy: _usePrivy }) => {
      // Privy state is read in the PrivyMembership subcomponent
      setPrivyState(s => ({ ...s, ready: true }))
    }).catch(() => {
      setPrivyState(s => ({ ...s, ready: true }))
    })
  }, [hasPrivy])

  const CollectButton = () => (
    <a
      href={artist.purchaseUrl ?? 'https://opensea.io'}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-primary"
    >
      Collect {artist.name}&apos;s Work →
    </a>
  )

  return (
    <div className="grid md:grid-cols-2 gap-px bg-line-border">
      <div className="bg-line-bg p-8 md:p-10">
        <p className="label mb-6">Membership</p>
        {hasPrivy ? (
          <PrivyMembershipPanel artist={artist} />
        ) : (
          <div>
            <p className="font-sans text-sm text-line-muted mb-6 leading-relaxed">
              Connect your wallet to check your Line membership status and access the artist community.
            </p>
            <Link href="/membership" className="btn-outline">
              Get a Token
            </Link>
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
        <CollectButton />
      </div>
    </div>
  )
}

function PrivyMembershipPanel({ artist }: { artist: Artist }) {
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
        <p className="font-sans text-sm text-line-muted mb-6 leading-relaxed">
          Connect your wallet to check your Line membership status and access the artist community.
        </p>
        <button onClick={login} className="btn-outline">Connect Wallet</button>
      </div>
    )
  }

  if (isMember) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-line-accent" />
          <p className="font-mono text-xs text-line-accent tracking-widest">You&apos;re a Line member</p>
        </div>
        <p className="font-sans text-sm text-line-muted mb-6 leading-relaxed">
          Access the private artist community — one room, all Line members.
        </p>
        <Link href="/members" className="btn-primary">Enter The Artist Chat →</Link>
      </div>
    )
  }

  return (
    <div>
      <p className="font-sans text-sm text-line-muted mb-6 leading-relaxed">
        Hold a Line membership token to join the artist community, access gallery retreats and screen takeovers.
      </p>
      <Link href="/membership" className="btn-outline">Get a Token</Link>
    </div>
  )
}

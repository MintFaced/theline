'use client'
// components/StickyIdentityBar.tsx
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Artist } from '@/types'
import { CATEGORY_LABELS } from '@/types'

export function StickyIdentityBar({ artist }: { artist: Artist }) {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)
  const primaryLine = artist.allLineNumbers[0]

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const copyWallet = () => {
    if (artist.walletAddress) {
      navigator.clipboard.writeText(artist.walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shortWallet = artist.walletAddress
    ? artist.walletAddress.startsWith('0x')
      ? `${artist.walletAddress.slice(0, 8)}…${artist.walletAddress.slice(-6)}`
      : artist.walletAddress.length > 20
        ? `${artist.walletAddress.slice(0, 10)}…`
        : artist.walletAddress
    : null

  return (
    <div className={`
      fixed top-[56px] left-0 right-0 z-40
      bg-line-surface/95 backdrop-blur-sm border-b border-line-border
      transition-all duration-300 ease-out
      ${visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
    `} style={{ height: '56px' }}>
      <div className="max-w-content mx-auto h-full px-6 flex items-center justify-between gap-4">
        {/* Left: avatar + name + line */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-line-border shrink-0">
            {artist.galleryImage && (
              <Image src={artist.galleryImage} alt={artist.name} width={32} height={32} className="w-full h-full object-cover" />
            )}
          </div>
          <span className="font-sans text-sm text-line-text truncate">{artist.name}</span>
          <span className="font-mono text-[10px] text-line-muted hidden sm:block">·</span>
          <span className="font-mono text-[11px] text-line-accent hidden sm:block tracking-wider shrink-0">
            {artist.allLineNumbers.length > 1
              ? `LINES ${artist.allLineNumbers.join(' · ')}`
              : `THE LINE ${primaryLine}`}
          </span>
        </div>

        {/* Centre: social + wallet */}
        <div className="hidden md:flex items-center gap-5">
          {artist.xHandle && (
            <a href={`https://x.com/${artist.xHandle}`} target="_blank" rel="noopener noreferrer"
              className="font-mono text-[10px] text-line-muted hover:text-line-accent transition-colors tracking-wider">
              𝕏
            </a>
          )}
          {artist.purchaseUrl && (
            <a href={artist.purchaseUrl} target="_blank" rel="noopener noreferrer"
              className="font-mono text-[10px] text-line-muted hover:text-line-accent transition-colors tracking-widest uppercase">
              {artist.purchaseUrl.includes('opensea') ? 'OpenSea' :
               artist.purchaseUrl.includes('objkt') ? 'Objkt' :
               artist.purchaseUrl.includes('foundation') ? 'Foundation' : 'Collect'}
            </a>
          )}
          {shortWallet && (
            <button onClick={copyWallet}
              className="font-mono text-[10px] text-line-muted hover:text-line-accent transition-colors tracking-wider">
              {copied ? 'Copied ✓' : shortWallet}
            </button>
          )}
        </div>

        {/* Right: Enter gallery */}
        {artist.oncyberUrls[0] && (
          <a href={artist.oncyberUrls[0]} target="_blank" rel="noopener noreferrer"
            className="font-mono text-[10px] text-line-accent border border-line-accent px-3 py-1.5 hover:bg-line-accent hover:text-line-bg transition-all tracking-widest uppercase shrink-0">
            Enter The Line →
          </a>
        )}
      </div>
    </div>
  )
}

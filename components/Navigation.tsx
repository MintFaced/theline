'use client'
// components/Navigation.tsx
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePrivy } from '@privy-io/react-auth'
import { LiveSearch } from './LiveSearch'

const NAV_LINKS = [
  { label: 'Artists',    href: '/artists' },
  { label: 'Storyline',  href: '/storyline' },
  { label: 'Gallery',    href: '/gallery' },
  { label: 'Collect',    href: '/collect' },
  { label: 'Membership', href: '/membership' },
]

export function Navigation() {
  const { ready, authenticated, login, logout, user } = usePrivy()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const walletAddress = user?.wallet?.address
  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`
    : null

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled
            ? 'bg-line-bg/95 backdrop-blur-sm border-b border-line-border'
            : 'bg-transparent'}
        `}
        style={{ height: 'var(--nav-height)' }}
      >
        <div className="max-w-content mx-auto h-full px-6 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link
            href="/"
            className="font-mono text-xs tracking-[0.3em] uppercase text-line-text hover:text-line-accent transition-colors shrink-0"
          >
            THE LINE
          </Link>

          {/* Mini rail indicator — desktop only */}
          <div className="hidden lg:flex items-center gap-3 text-line-muted">
            <span className="font-mono text-[10px] tracking-widest">0</span>
            <div className="relative w-32 h-px bg-line-border">
              {/* Current position marker — gold tick at ~82% (821/1000) */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-px h-3 bg-line-accent"
                style={{ left: '82%' }}
              />
              <div className="absolute inset-0 bg-line-accent"
                style={{ width: '82%', height: '1px' }}
              />
            </div>
            <span className="font-mono text-[10px] tracking-widest">1000</span>
            <span className="font-mono text-[10px] text-line-accent ml-1">· 821</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="font-mono text-[11px] tracking-widest uppercase text-line-muted hover:text-line-text transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="text-line-muted hover:text-line-accent transition-colors p-1"
              aria-label="Search artists"
            >
              <SearchIcon />
            </button>

            {/* Wallet connect */}
            {ready && (
              authenticated && shortAddress ? (
                <button
                  onClick={logout}
                  className="font-mono text-[11px] tracking-widest text-line-accent border border-line-accent px-3 py-1.5 hover:bg-line-accent hover:text-line-bg transition-all"
                >
                  {shortAddress}
                </button>
              ) : (
                <button
                  onClick={login}
                  className="font-mono text-[11px] tracking-widest uppercase text-line-bg bg-line-accent px-4 py-1.5 hover:opacity-85 transition-opacity"
                >
                  Connect
                </button>
              )
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-line-muted hover:text-line-text transition-colors p-1"
              aria-label="Menu"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-line-bg flex flex-col pt-24 pb-12 px-8">
          <nav className="flex flex-col gap-8 flex-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="font-display text-4xl font-light text-line-text hover:text-line-accent transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-line-border pt-8">
            <p className="font-mono text-xs text-line-muted tracking-widest">
              THE LINE · NAPIER, NEW ZEALAND
            </p>
            <p className="font-mono text-xs text-line-muted mt-1">
              821 artists · 179 positions remain
            </p>
          </div>
        </div>
      )}

      {/* Search overlay */}
      {searchOpen && (
        <LiveSearch onClose={() => setSearchOpen(false)} />
      )}
    </>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="10.5" y1="10.5" x2="14.5" y2="14.5" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
      <line x1="0" y1="1" x2="20" y2="1" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="0" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="0" y1="13" x2="20" y2="13" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <line x1="1" y1="1" x2="15" y2="15" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="15" y1="1" x2="1" y2="15" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  )
}

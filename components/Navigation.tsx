'use client'
// components/Navigation.tsx
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { LiveSearch } from './LiveSearch'
import artistsData from '@/data/artists.json'
import type { Artist } from '@/types'

const artists = artistsData as Artist[]
const maxOccupied = Math.max(...artists.flatMap((a: Artist) => a.allLineNumbers))
const artistCount = artists.length

const PrivyButton = dynamic(() => import('./PrivyButton'), {
  ssr: false,
  loading: () => (
    <button className="font-mono text-[11px] tracking-widest uppercase text-line-bg bg-line-accent px-4 py-1.5 opacity-50">
      Connect Wallet
    </button>
  ),
})

const NAV_LINKS = [
  { label: 'Artists',   href: '/artists' },
  { label: 'Storyline', href: '/storyline' },
  { label: 'Gallery',   href: '/gallery',  dropdown: [
    { label: 'Retreat',   href: '/retreat' },
    { label: 'Takeover',  href: '/takeover' },
  ]},
  { label: 'Collect',   href: '/collect',  dropdown: [
    { label: 'Map',      href: '/map' },
  ]},
  { label: 'About',   href: '/vision',  dropdown: [
    { label: 'Guardians', href: '/guardians' },
    { label: 'Vision',    href: '/vision' },
    { label: 'FAQ',       href: '/faq' },
  ]},
  { label: 'LARP Chat', href: '/members/chat', dropdown: [
    { label: 'Update Bio', href: '/update' },
  ]},
]

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-line-bg/95 backdrop-blur-sm border-b border-line-border' : 'bg-transparent'
        }`}
        style={{ height: 'var(--nav-height)' }}
      >
        <div className="max-w-content mx-auto h-full px-6 flex items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-mono text-xs tracking-[0.3em] uppercase text-line-text hover:text-line-accent transition-colors shrink-0">
              THE LINE
            </Link>

            <nav className="hidden md:flex items-center gap-8" ref={dropdownRef}>
            {NAV_LINKS.map(({ label, href, dropdown }) =>
              dropdown ? (
                <div key={href} className="relative"
                  onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current); setOpenDropdown(label) }}
                  onMouseLeave={() => {
                    closeTimer.current = setTimeout(() => setOpenDropdown(null), 1200)
                  }}
                >
                  <Link href={href}
                    className="font-mono text-[11px] tracking-widest uppercase text-line-muted hover:text-line-text transition-colors">
                    {label}
                  </Link>
                  {openDropdown === label && (
                    <div className="absolute top-full left-0 pt-2 z-50"
                        onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current) }}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <div className="bg-line-bg border border-line-border min-w-[140px]">
                        {dropdown.map((item) => (
                          <Link key={item.href} href={item.href}
                            onClick={() => setOpenDropdown(null)}
                            className="block px-4 py-3 font-mono text-[11px] tracking-widest uppercase text-line-muted hover:text-line-text hover:bg-line-surface transition-colors border-b border-line-border last:border-0">
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link key={href} href={href} className="font-mono text-[11px] tracking-widest uppercase text-line-muted hover:text-line-text transition-colors">
                  {label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-4 shrink-0">
            <button onClick={() => setSearchOpen(true)} className="text-line-muted hover:text-line-accent transition-colors p-1" aria-label="Search artists">
              <SearchIcon />
            </button>
            <PrivyButton />
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-line-muted hover:text-line-text transition-colors p-1" aria-label="Menu">
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-line-bg flex flex-col pt-24 pb-12 px-8">
          <nav className="flex flex-col gap-6 flex-1">
            {NAV_LINKS.map(({ label, href, dropdown }) => (
              <div key={href}>
                <Link href={href} onClick={() => setMenuOpen(false)}
                  className="font-display text-4xl font-light text-line-text hover:text-line-accent transition-colors block">
                  {label}
                </Link>
                {dropdown && (
                  <div className="flex gap-6 mt-2 ml-1">
                    {dropdown.map((item) => (
                      <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                        className="font-mono text-[10px] text-line-muted hover:text-line-accent transition-colors tracking-widest uppercase">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="border-t border-line-border pt-8">
            <p className="font-mono text-xs text-line-muted tracking-widest uppercase">The Line · Hastings, New Zealand</p>
            <p className="font-mono text-xs text-line-muted mt-1">{artistCount} artists · 1,000 positions · {1000 - maxOccupied - 1} remain</p>
          </div>
        </div>
      )}

      {searchOpen && <LiveSearch onClose={() => setSearchOpen(false)} />}
    </>
  )
}

function SearchIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/><line x1="10.5" y1="10.5" x2="14.5" y2="14.5" stroke="currentColor" strokeWidth="1.2"/></svg>
}
function MenuIcon() {
  return <svg width="20" height="14" viewBox="0 0 20 14" fill="none"><line x1="0" y1="1" x2="20" y2="1" stroke="currentColor" strokeWidth="1.2"/><line x1="0" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="1.2"/><line x1="0" y1="13" x2="20" y2="13" stroke="currentColor" strokeWidth="1.2"/></svg>
}
function CloseIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><line x1="1" y1="1" x2="15" y2="15" stroke="currentColor" strokeWidth="1.2"/><line x1="15" y1="1" x2="1" y2="15" stroke="currentColor" strokeWidth="1.2"/></svg>
}

// app/hot-buys/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Hot Buys — The Line',
  description: 'Recent ETH purchases from the digital art scene. Curated by The Line.',
}

interface Sale {
  artist: string
  piece: string
  date?: string
  priceUsd?: number
  priceEth?: number
  artLink: string
  writeupLink?: string
  lineSlug?: string
  lineNumber?: number
}

const TOTAL_ETH = 48.4
const TOTAL_USD = 8354
const ETHERSCAN = 'https://etherscan.io/tx/0x123433872041e46414bbc5949a5df320e15d63f384c42f814bdf2824d1bca4f4'

const SALES: Sale[] = [
  {
    artist: 'Yudhoxyz',
    piece: 'Together in the Glitch',
    date: '2 Feb 2026',
    priceUsd: 395,
    priceEth: 0.190,
    artLink: 'https://superrare.com/artwork/eth/0x7C1bd459dae8eC0Bb45FE3172Fd58A2B53972e5C/59',
    writeupLink: 'https://x.com/musicalnetta/status/2028903408313524575?s=20',
  },
  {
    artist: 'Kamand Kavand',
    piece: 'For every moment I smiled',
    date: '18 Feb 2026',
    priceUsd: 157,
    priceEth: 0.080,
    artLink: 'https://foundation.app/mint/eth/0xa29326d3934ABFeF75dB138a441AC44F5d262995/28',
  },
  {
    artist: 'Birddog',
    piece: 'Split Frequencies',
    priceUsd: 196,
    artLink: 'https://opensea.io/item/ethereum/0x092420e4dab5cfb03a8ca916e44420def89b72bd/9',
  },
  {
    artist: 'Alex Kittoe',
    piece: 'Nothing Was The Same',
    date: '18 Feb 2026',
    priceUsd: 393,
    priceEth: 0.200,
    artLink: 'https://superrare.com/artwork/eth/0xA1Eb5C4F5313dD9dBbcDCBBA7e4D6ecfB32d34F9/30',
  },
  {
    artist: 'Ilya Bliznetс',
    piece: 'Unfinished Form',
    priceUsd: 424,
    artLink: 'https://opensea.io/item/ethereum/0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0/54250',
  },
  {
    artist: 'Pixelord',
    piece: 'King of Cats',
    priceUsd: 225,
    artLink: 'https://opensea.io/item/ethereum/0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0/46111',
  },
  {
    artist: 'Heather N. Stout',
    piece: 'All Avianting',
    date: '18 Feb 2026',
    priceUsd: 31,
    priceEth: 0.015,
    artLink: 'https://opensea.io/item/ethereum/0x1897a9287820ba3f937ba921faa23d91aae2c5c6/1',
    lineSlug: 'heather-stout',
    lineNumber: 132,
  },
  {
    artist: 'Lykai',
    piece: 'Make A Wish',
    priceUsd: 284,
    artLink: 'https://opensea.io/item/ethereum/0x2959ddc60c5a43a0ff0d8b69e7555f373c9a3e8d/6',
  },
  {
    artist: 'Christine Clue',
    piece: 'To My Little Empath',
    priceUsd: 591,
    artLink: 'https://foundation.app/mint/eth/0xe292754A4992432a81a79b071e5F3b5Ae3366aFB/1',
  },
  {
    artist: 'Adam Carity',
    piece: 'A Walk In The Rain',
    priceUsd: 485,
    artLink: 'https://opensea.io/item/ethereum/0xa871d50050ae79bfc9b1315dbe3604c853af07a4/6',
  },
  {
    artist: 'Num1Crush',
    piece: 'Awakening',
    priceUsd: 799,
    artLink: 'https://opensea.io/item/ethereum/0x4a84a82df73f1a12c31efcf423bbdaefa6b4cc14/32',
  },
  {
    artist: 'Gül Yildiz',
    piece: 'Memories',
    priceUsd: 120,
    artLink: 'https://opensea.io/item/ethereum/0x9d506869fa46a70b7ed7f4b4e52f983ddd09b6d6/14',
  },
  {
    artist: 'Ashton Tekno',
    piece: 'Together',
    priceUsd: 330,
    artLink: 'https://opensea.io/item/ethereum/0x7e716bdc75c4e98967be76e01a581f077b43a98e/2',
    lineSlug: 'ashton-tekno',
    lineNumber: 580,
  },
  {
    artist: 'Ni Petrov',
    piece: 'Crosswalk_04',
    priceUsd: 64,
    artLink: 'https://superrare.com/artwork/eth/0x9218C286aDFB85e66AEdf7ba4427E0eBc03798FC/60',
  },
  {
    artist: 'Treeshe',
    piece: 'The Tea Party',
    priceUsd: 373,
    artLink: 'https://foundation.app/mint/eth/0xF32BfBf14a6a77B30f6C5Cc651bBB41a104a0543/1',
  },
  {
    artist: 'Cydr and Noper',
    piece: 'Rare Fish Market - Xenobalis lunaris',
    priceUsd: 588,
    artLink: 'https://opensea.io/item/ethereum/0xd87bd2057518d830dd8cd86abf51e39347989cf8/10',
  },
  {
    artist: '1dontknows',
    piece: 'The Gaze',
    priceUsd: 334,
    artLink: 'https://manifold.xyz/@1dontknows/id/4086626544',
  },
  {
    artist: 'Qubibi',
    piece: 'We Gather Her Noon Rust',
    priceUsd: 522,
    priceEth: 0.280,
    artLink: 'https://manifold.xyz/@qubibi/id/4089399536',
  },
  {
    artist: 'Astrowurld',
    piece: 'Coming Through',
    priceUsd: 94,
    priceEth: 0.050,
    artLink: 'https://www.transient.xyz/nfts/ethereum/0xf0e2cd017b140e2735af0a5804db481d9f539ac0/6',
  },
  {
    artist: 'Karen Jerzyk',
    piece: 'Sweet and Sour Sauce',
    priceUsd: 206,
    priceEth: 0.100,
    artLink: 'https://opensea.io/item/ethereum/0x7f45daaff9aa68415e797e9e64fa1899339b69f2/15',
  },
  {
    artist: 'Schauermann',
    piece: 'OH, HE HE full set of 7',
    priceUsd: 1741,
    priceEth: 0.844,
    artLink: 'https://www.schauermann.art/ohhehe',
  },
]

function marketplaceName(url: string) {
  if (url.includes('superrare'))   return 'SuperRare'
  if (url.includes('foundation'))  return 'Foundation'
  if (url.includes('opensea'))     return 'OpenSea'
  if (url.includes('manifold'))    return 'Manifold'
  if (url.includes('transient'))   return 'Transient'
  if (url.includes('schauermann')) return 'schauermann.art'
  return 'View'
}

export default function HotBuysPage() {
  return (
    <div className="bg-line-bg min-h-screen" style={{ paddingTop: 'var(--nav-height)' }}>

      {/* ── Hero ── */}
      <div className="border-b border-line-border">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="label mb-4">The Line</p>
            <h1 className="font-display font-light text-5xl md:text-7xl text-line-text mb-6" style={{ letterSpacing: '-0.03em' }}>
              Hot Buys
            </h1>
            <p className="font-sans text-sm text-line-muted leading-relaxed max-w-md mb-8">
              Recent acquisitions from the digital art scene. Curated by The Line.
            </p>
            {/* Summary bar */}
            <div className="flex items-center gap-8">
              <div>
                <p className="font-mono text-[10px] text-line-muted tracking-widest uppercase mb-1">Total spent</p>
                <p className="font-display font-light text-3xl text-line-text" style={{ letterSpacing: '-0.02em' }}>
                  Ξ{TOTAL_ETH} <span className="font-mono text-sm text-line-muted">${TOTAL_USD.toLocaleString()}</span>
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-line-muted tracking-widest uppercase mb-1">Works acquired</p>
                <p className="font-display font-light text-3xl text-line-text" style={{ letterSpacing: '-0.02em' }}>{SALES.length}</p>
              </div>
              <a href={ETHERSCAN} target="_blank" rel="noopener noreferrer"
                className="font-mono text-[10px] text-line-muted tracking-widest uppercase hover:text-line-accent transition-colors self-end pb-1">
                Etherscan →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sales list ── */}
      <div className="max-w-content mx-auto px-6 py-12 md:py-20">

        {/* Column headers */}
        <div className="hidden md:grid grid-cols-[2fr_3fr_1.5fr_1fr_1fr_1fr] gap-4 pb-4 border-b border-line-border mb-px">
          {['Artist', 'Piece', 'Date', 'USD', 'ETH', 'Links'].map(h => (
            <p key={h} className="font-mono text-[9px] text-line-muted tracking-widest uppercase">{h}</p>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-line-border">
          {SALES.map((sale, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-[2fr_3fr_1.5fr_1fr_1fr_1fr] gap-2 md:gap-4 py-5 md:py-4 items-center group hover:bg-line-surface/30 transition-colors px-0 -mx-0">

              {/* Artist */}
              <div>
                {sale.lineSlug ? (
                  <div className="flex items-center gap-2">
                    <Link href={`/artists/${sale.lineSlug}`}
                      className="font-sans text-sm text-line-text hover:text-line-accent transition-colors">
                      {sale.artist}
                    </Link>
                    <span className="font-mono text-[9px] text-line-accent tracking-widest border border-line-accent/30 px-1.5 py-0.5">
                      LINE {sale.lineNumber}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-sm text-line-muted">{sale.artist}</span>
                    <Link href="/members/chat"
                      className="font-mono text-[9px] text-line-muted/50 hover:text-line-accent tracking-widest transition-colors whitespace-nowrap">
                      + Apply
                    </Link>
                  </div>
                )}
              </div>

              {/* Piece */}
              <p className="font-sans text-sm text-line-text italic">{sale.piece}</p>

              {/* Date */}
              <p className="font-mono text-[10px] text-line-muted tracking-wide">
                {sale.date || '—'}
              </p>

              {/* USD */}
              <p className="font-mono text-[11px] text-line-text">
                {sale.priceUsd ? `$${sale.priceUsd.toLocaleString()}` : '—'}
              </p>

              {/* ETH */}
              <p className="font-mono text-[11px] text-line-muted">
                {sale.priceEth ? `Ξ${sale.priceEth}` : '—'}
              </p>

              {/* Links */}
              <div className="flex items-center gap-3">
                <a href={sale.artLink} target="_blank" rel="noopener noreferrer"
                  className="font-mono text-[10px] text-line-accent hover:opacity-70 transition-opacity tracking-widest uppercase">
                  {marketplaceName(sale.artLink)}
                </a>
                {sale.writeupLink && (
                  <a href={sale.writeupLink} target="_blank" rel="noopener noreferrer"
                    className="font-mono text-[10px] text-line-muted hover:text-line-accent transition-colors tracking-widest uppercase">
                    X
                  </a>
                )}
              </div>

            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-16 pt-8 border-t border-line-border flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <p className="font-mono text-[10px] text-line-muted tracking-widest">
            Artists marked LINE are on The Line. Not on The Line yet?
          </p>
          <Link href="/members/chat" className="btn-outline text-xs">
            Apply to join →
          </Link>
        </div>

      </div>
    </div>
  )
}

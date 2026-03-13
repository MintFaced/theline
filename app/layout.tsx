// app/layout.tsx
import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from 'next/font/google'
import '../styles/globals.css'
import { Navigation } from '@/components/Navigation'
import { Providers } from '@/components/Providers'
import artistsData from '@/data/artists.json'
import type { Artist } from '@/types'

const _artists = artistsData as Artist[]
const _maxLine = Math.max(..._artists.flatMap(a => a.allLineNumbers))
const _artistCount = _artists.length
const _remain = 1000 - _maxLine - 1

// Display serif — replaces Canela
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

// UI sans — replaces Söhne
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

// Mono — data, wallets, line numbers
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'The Line — 1,000 Artists. One Permanent Line.',
    template: '%s | The Line',
  },
  description:
    'The Line is a permanent directory of 1,000 cryptoartists, each holding a fixed position from The Line 0 to The Line 1000. A world-class digital art museum.',
  metadataBase: new URL('https://theline.nz'),
  openGraph: {
    type: 'website',
    locale: 'en_NZ',
    url: 'https://theline.nz',
    siteName: 'The Line',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@thelinenz',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${cormorant.variable} ${dmSans.variable} ${jetbrainsMono.variable} bg-line-bg text-line-text font-sans antialiased`}>
        <Providers>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

function Footer() {
  return (
    <footer className="border-t border-line-border mt-32 py-12 px-6">
      <div className="max-w-content mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <p className="font-mono text-xs text-line-muted tracking-widest uppercase">
            THE LINE HAWKE&apos;S BAY, NEW ZEALAND
          </p>
          <p className="font-mono text-xs text-line-muted mt-1">
            {_artistCount} artists · 1,000 positions · {_remain} remain
          </p>
          {/* Socials */}
          <div className="flex items-center gap-5 mt-4">
            <a
              href="https://www.instagram.com/thelinegallery"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-line-muted/40 hover:text-line-muted transition-colors duration-300"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a
              href="https://x.com/thelinegallery"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="text-line-muted/40 hover:text-line-muted transition-colors duration-300"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.843L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
        <nav className="flex flex-wrap gap-6">
          {[
            ['Artists', '/artists'],
            ['Storyline', '/storyline'],
            ['Gallery', '/gallery'],
            ['Collect', '/collect'],
            ['Guardians', '/guardians'],
            ['FAQ', '/faq'],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="font-mono text-xs text-line-muted hover:text-line-accent transition-colors tracking-widest uppercase"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}

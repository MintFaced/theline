// app/layout.tsx
import type { Metadata } from 'next'
import '../styles/globals.css'
import { Navigation } from '@/components/Navigation'
import { Providers } from '@/components/Providers'

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
        <link rel="preload" href="/fonts/Canela-Light.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Sohne-Buch.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/JetBrainsMono-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="bg-line-bg text-line-text font-sans antialiased">
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
      <div className="max-w-content mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <p className="font-mono text-xs text-line-muted tracking-widest uppercase">
            The Line · Napier, New Zealand
          </p>
          <p className="font-mono text-xs text-line-muted mt-1">
            821 artists · 1,000 positions · 179 remain
          </p>
        </div>
        <nav className="flex flex-wrap gap-6">
          {[
            ['Artists', '/artists'],
            ['Storyline', '/storyline'],
            ['Gallery', '/gallery'],
            ['Membership', '/membership'],
            ['Collect', '/collect'],
            ['About', '/about'],
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

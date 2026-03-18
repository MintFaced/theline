// app/books/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cryptoart Books - The Line',
  description: 'Cryptoart books published by UmPrint Publishing, the publishing house of MintFace. MINTED, Nouns Almanac, Pebbles, !Seized, and The Magic Internet Points Handbook.',
}

const BOOKS = [
  {
    id: 'minted',
    title: 'MINTED',
    year: '2022',
    subtitle: 'Artists on the Blockchain',
    isbn: '978-0-4736081-7-0',
    pages: 176,
    published: 'February 28, 2022',
    amazonUrl: 'https://www.amazon.com/Minted-Mint-Face/dp/0473608170',
    image: 'https://pub-40df8e6473b14a10a093ecf8c80c2f92.r2.dev/migrated/wp-content/uploads/2024/11/minted-book-hardcover.jpg',
    description: 'The first crypto book to document the 2021 explosion in artists minting on the blockchain. MINTED captures the energy, the artists, and the movement that redefined digital ownership. Crypto books get you into the mindset of a crypto native art collectooor - explore the wealth of art available in a traditional printed format.',
    tag: 'Minted Book',
    tagHref: '/artists?curation=MINTED',
  },
  {
    id: 'nouns-almanac',
    title: 'Nouns Almanac',
    year: '2022',
    subtitle: 'Every Day a New Nouns is Born',
    isbn: '978-0-4736302-5-6',
    pages: 312,
    published: 'May 16, 2022',
    amazonUrl: 'https://www.amazon.com/Nouns-Almanac-Every-Noun-born/dp/0473630257',
    image: 'https://pub-40df8e6473b14a10a093ecf8c80c2f92.r2.dev/migrated/wp-content/uploads/2024/11/nouns-hardcover-med-res-1024x678.png',
    description: 'Nouns are characters created pixel by pixel into beautifully complex yet simple forms. On first glance of a Noun, your eyes will construct a character identity from their 1,024 pixels. The brilliance of the Nouns you will meet in the Noun Almanac originates from four simple layers based on people, places and things, fused together almost randomly, every day for eternity.',
    tag: null,
    tagHref: null,
  },
  {
    id: 'pebbles',
    title: 'Pebbles',
    year: '2024',
    subtitle: 'A MintFace Generative Art Guide',
    isbn: '978-1-0670257-0-0',
    pages: 420,
    published: 'June 30, 2024',
    amazonUrl: 'https://www.amazon.com/Pebbles-MintFace-Generative-Art-Guide/dp/1067025707/',
    image: 'https://pub-40df8e6473b14a10a093ecf8c80c2f92.r2.dev/migrated/wp-content/uploads/2024/11/Pebbles-book.png',
    description: 'Our lives continue on an arc towards more digitisation, not less, making ownership of our own digital lives central to our digital being. Each Pebble is the first generative output built on a smart contract that acknowledged the sovereignty of individual identities. Over the course of the Pebbles book you will learn how to spot all the Pebble traits - from the obvious to those hidden in plain sight.',
    tag: null,
    tagHref: null,
  },
  {
    id: 'seized',
    title: '!Seized',
    year: '2024',
    subtitle: 'Own or be Pwned',
    isbn: '978-1-0670257-2-4',
    pages: 446,
    published: 'September 5, 2024',
    amazonUrl: 'https://www.amazon.com/Seized-Own-be-Pwned/dp/1067025723',
    image: 'https://pub-40df8e6473b14a10a093ecf8c80c2f92.r2.dev/migrated/wp-content/uploads/2024/11/seized.jpg',
    description: '!Seized documents the first four Seasons of Memes that power a new Digital Nation. Over 10,000 residents own digital property in the form of memes. Over 150 memes across 12 meme thematics are published as a reference guide - use it wen considering what you might build on top of a meme card, or simply marvel at the rich texture of memetic culture tokenized for a collective purpose.',
    tag: '6529 Memes',
    tagHref: '/artists?curation=6529',
  },
  {
    id: 'magic-internet-points',
    title: 'The Magic Internet Points Handbook',
    year: '2024',
    subtitle: 'Your crypto estate plan',
    isbn: '978-1-0670257-6-2',
    pages: 169,
    published: 'December 1, 2024',
    amazonUrl: 'https://www.amazon.com/dp/1067025766/',
    image: 'https://pub-40df8e6473b14a10a093ecf8c80c2f92.r2.dev/migrated/wp-content/uploads/2024/11/magic-internet-points-handbook-1024x785.jpg',
    description: 'A printed guide you write in for family, loved ones and next of kin on how to access your digital and crypto assets. Includes step-by-step instructions on how to recover your digital wealth in case an unforeseen event affects you. Covers seed phrases, hardware wallets, multi-signature vaults, 6529 Network Identity, and more.',
    tag: null,
    tagHref: null,
    toc: [
      'Introduction', 'Key Information for Access', 'Logins and Passwords',
      'Two Factor Authentication (2FA)', 'Seed Phrases', 'Master Password',
      'Names of Websites and Platforms', 'Hardware Wallet Information',
      'Multi-Signature Vault', '6529 Network Identity', 'Trusted Technical Help',
      'List of Digital and Crypto Assets', 'Backup Locations',
      'Will and Testament', 'Additional Notes', 'The Very Last Chapter',
    ],
  },
]

export default function BooksPage() {
  return (
    <div className="bg-line-bg min-h-screen" style={{ paddingTop: 'var(--nav-height)' }}>

      {/* -- Header -- */}
      <div className="border-b border-line-border">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="label mb-4">Collect</p>
              <h1 className="font-display font-light text-5xl md:text-7xl text-line-text mb-6" style={{ letterSpacing: '-0.03em' }}>
                Cryptoart<br />Books
              </h1>
              <p className="font-sans text-sm text-line-muted leading-relaxed max-w-lg">
                Published by{' '}
                <span className="text-line-text">UmPrint Publishing</span>
                {' '}- the publishing house of MintFace. Physical books for the crypto-native collector.
              </p>
            </div>
            <a
              href="https://www.amazon.com/stores/Mint-Face/author/B0B1WF3MLF"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline shrink-0"
            >
              All books on Amazon -
            </a>
          </div>
        </div>
      </div>

      {/* -- Books -- */}
      <div className="max-w-content mx-auto px-6 py-16 md:py-24 space-y-px">
        {BOOKS.map((book, i) => (
          <div key={book.id} className="bg-line-surface border-b border-line-border">
            <div className="p-8 md:p-12 grid md:grid-cols-[280px_1fr] gap-10 md:gap-16 items-start">

              {/* Cover */}
              <div className="relative aspect-square md:aspect-auto md:h-72 bg-line-border overflow-hidden shrink-0">
                <img
                  src={book.image}
                  alt={`${book.title} cover`}
                  className="w-full h-full object-contain bg-white p-2"
                />
                <div className="absolute top-3 left-3">
                  <span className="font-mono text-[9px] tracking-widest text-line-muted bg-line-bg/80 px-2 py-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <div>
                    <span className="font-mono text-[10px] text-line-accent tracking-widest">{book.year}</span>
                    <h2 className="font-display font-light text-3xl md:text-4xl text-line-text mt-1" style={{ letterSpacing: '-0.02em' }}>
                      {book.title}
                    </h2>
                  </div>
                  {book.tag && book.tagHref && (
                    <Link
                      href={book.tagHref}
                      className="font-mono text-[9px] tracking-widest uppercase border border-line-accent/40 text-line-accent px-3 py-1.5 hover:bg-line-accent hover:text-line-bg transition-all shrink-0 mt-1"
                    >
                      {book.tag}
                    </Link>
                  )}
                </div>

                <p className="font-mono text-[10px] text-line-muted tracking-widest mb-6">
                  {book.subtitle}
                </p>

                <p className="font-sans text-sm text-line-muted leading-relaxed mb-8 flex-1">
                  {book.description}
                </p>

                {/* TOC if present */}
                {book.toc && (
                  <div className="mb-8">
                    <p className="font-mono text-[10px] text-line-muted tracking-widest uppercase mb-3">Contents</p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                      {book.toc.map((item, j) => (
                        <div key={j} className="flex items-baseline gap-2">
                          <span className="font-mono text-[9px] text-line-accent/60 shrink-0">{String(j + 1).padStart(2, '0')}</span>
                          <span className="font-mono text-[10px] text-line-muted">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meta + CTA */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-6 border-t border-line-border">
                  <div className="space-y-1">
                    <p className="font-mono text-[9px] text-line-muted/60 tracking-widest">
                      {book.pages} pages - {book.published}
                    </p>
                    <p className="font-mono text-[9px] text-line-muted/40 tracking-widest">
                      ISBN {book.isbn}
                    </p>
                  </div>
                  <a
                    href={book.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Buy on Amazon -
                  </a>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* -- UmPrint footer -- */}
      <div className="border-t border-line-border">
        <div className="max-w-content mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] text-line-muted tracking-widest uppercase mb-1">Publisher</p>
            <p className="font-sans text-sm text-line-text">UmPrint Publishing</p>
            <p className="font-mono text-[10px] text-line-muted/60 tracking-widest">The publishing house of MintFace</p>
          </div>
          <a
            href="https://www.amazon.com/stores/Mint-Face/author/B0B1WF3MLF"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            View all on Amazon -
          </a>
        </div>
      </div>

    </div>
  )
}

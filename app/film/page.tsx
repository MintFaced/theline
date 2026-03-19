// app/film/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { SendEthButton } from '@/components/SendEthButton'

export const metadata: Metadata = {
  title: 'Off The Charts -- The Line',
  description: 'A film about six New Zealand cryptoartists who built an international audience on the blockchain and connected the edge of the world to the epicentre of cryptoart in New York.',
}

const ARTISTS = [
  { name: 'MintFace', line: 0, slug: 'mintface', location: 'Hawke\'s Bay', role: 'Painter  /  Founder of The Line' },
  { name: 'Dom Baker', line: 203, slug: 'dom-baker', location: 'Bay of Islands', role: 'Carver  /  Founder NFT Aotearoa' },
  { name: 'Little Art', line: 43, slug: 'little-art', location: 'Auckland', role: 'Macro liquid photography' },
  { name: 'Sarah C', line: 261, slug: 'sarah-c', location: 'Auckland', role: 'AI architecture  /  Former Air NZ pilot' },
  { name: 'Zoe Louise', line: 398, slug: 'melzie-q', location: 'Hamilton', role: 'Painting on Bitcoin' },
  { name: '328', line: 482, slug: '328-lad', location: 'Dunedin', role: 'B&W photography on Tezos' },
]

export default function FilmPage() {
  return (
    <main className="min-h-screen bg-line-bg">

      {/*  Hero  */}
      <div className="border-b border-line-border">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-32">
          <p className="label mb-6">The Line  /  Documentary</p>
          <h1 className="font-display font-light text-5xl md:text-7xl text-line-text mb-6" style={{ letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            Off The Charts
          </h1>
          <p className="font-sans text-lg text-line-muted max-w-2xl leading-relaxed mb-10">
            How a blockchain-underpinned art community formed in the cloud, landed in New Zealand, and connected six artists from the edge of the world to the epicentre of cryptoart in New York.
          </p>
          <div className="flex flex-wrap gap-6 font-mono text-[11px] text-line-muted tracking-widest uppercase">
            <span>25-30 minutes</span>
            <span> / </span>
            <span>Production 2026-27</span>
            <span> / </span>
            <span>Premiere NFTNYC 2027</span>
          </div>
        </div>
      </div>

      {/*  Treatment  */}
      <div className="border-b border-line-border">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-3 gap-16">
            <div className="md:col-span-1">
              <p className="label mb-4">Treatment</p>
              <p className="font-mono text-[11px] text-line-muted tracking-widest leading-relaxed">
                A documentary. Not a promo. Not a recap of the bull run. A film about artists who made a decision -- and what happened next.
              </p>
            </div>
            <div className="md:col-span-2 space-y-5 font-sans text-sm text-line-muted leading-relaxed">
              <p>
                <em>Off The Charts</em> follows six New Zealand artists who chose a different path. No gallery jury. No waiting to be discovered. Beginning in 2022, they built an international audience on the blockchain and then brought that community back to physical ground in Aotearoa.
              </p>
              <p>
                The film visits each artist across three locations: their studio, the landscape that shapes their work, and a nearby New Zealand destination that anchors them to place. The pacing is observational. Long takes. Natural light. The land does as much talking as the artists.
              </p>
              <p>
                Threaded through the portraits is the story of{' '}
                <Link href="/gallery" className="text-line-accent hover:opacity-70 transition-opacity">The Line</Link>
                {' '}-- a tokenized gallery in Hawke's Bay that formed digitally before it ever had walls. Cloud first, land last. The film makes that philosophy concrete and human.
              </p>
              <p>
                The second half travels to the United States. Vox pops with American crypto artists on both coasts... candid, unscripted... establish what the scene looks like from inside, and why New Zealand's 'touching grass' reality feels both peripheral and essential to it. The contrast is the point.
              </p>
              <p>
                Read the full{' '}
                <Link href="/storyline/new-zealand-pioneers" className="text-line-accent hover:opacity-70 transition-opacity">
                  New Zealand Pioneers article
                </Link>
                {' '}for the background on the artists and the movement behind the film.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/*  Artists  */}
      <div className="border-b border-line-border">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <p className="label mb-10">Six Artists  /  Three Locations Each</p>
          <div className="grid md:grid-cols-2 gap-px bg-line-border">
            {ARTISTS.map((artist) => (
              <Link
                key={artist.slug}
                href={`/artists/${artist.slug}`}
                className="bg-line-bg p-6 hover:bg-line-surface transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="font-mono text-[10px] text-line-accent tracking-widest">LINE {artist.line}</span>
                  <span className="font-mono text-[10px] text-line-muted tracking-widest">{artist.location}</span>
                </div>
                <h3 className="font-display font-light text-2xl text-line-text mb-1 group-hover:text-line-accent transition-colors" style={{ letterSpacing: '-0.02em' }}>
                  {artist.name}
                </h3>
                <p className="font-sans text-xs text-line-muted">{artist.role}</p>
                <div className="mt-5 space-y-1 font-mono text-[10px] text-line-muted tracking-widest">
                  <div className="flex gap-3"><span className="text-line-accent">01</span><span>Studio</span></div>
                  <div className="flex gap-3"><span className="text-line-accent">02</span><span>Inspiring landscape</span></div>
                  <div className="flex gap-3"><span className="text-line-accent">03</span><span>Epic Kiwi destination</span></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/*  Cloud to Land  */}
      <div className="border-b border-line-border">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-3 gap-16">
            <div>
              <p className="label mb-4">Cloud to Land</p>
              <p className="font-mono text-[11px] text-line-muted tracking-widest leading-relaxed uppercase">
                The backbone of the film
              </p>
            </div>
            <div className="md:col-span-2 space-y-5 font-sans text-sm text-line-muted leading-relaxed">
              <p>
                900 artists. 82 countries. A physical gallery in Hastings that opened after the community did. The blockchain is not explained in the film -- it is shown: a timestamp, a wallet address, a transaction confirming. The on-screen visual language of The Line becomes the grammar of the film itself.
              </p>
              <p>
                The Line is a live example of Balaji Srinivasan's Network State model: organise online first, acquire land later. <em>Off The Charts</em> is the document of that process -- not the theory, but what it looks like when real artists live it.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/*  Funding  */}
      <div className="border-b border-line-border">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <p className="label mb-10">Funding -- 4 to 6 ETH  /  2 to 3 Producers</p>
          <div className="grid md:grid-cols-2 gap-px bg-line-border mb-12">
            {[
              {
                tier: 'Lead Producer',
                eth: '2-3 ETH',
                defaultAmount: '3',
                benefits: [
                  'Credit as Lead Producer',
                  'Minted 1/1 of the completed film',
                  'Two invites to NFTNYC 2027, New York',
                ]
              },
              {
                tier: 'Associate Producer',
                eth: '1-2 ETH',
                defaultAmount: '2',
                benefits: [
                  'Credit as Associate Producer',
                  'Minted limited edition of the film',
                  'One invite to NFTNYC 2027, New York',
                ]
              },
            ].map((tier) => (
              <div key={tier.tier} className="bg-line-bg p-8">
                <p className="font-mono text-[10px] text-line-accent tracking-widest mb-2">{tier.eth}</p>
                <h3 className="font-display font-light text-2xl text-line-text mb-6" style={{ letterSpacing: '-0.02em' }}>{tier.tier}</h3>
                <ul className="space-y-3 mb-0">
                  {tier.benefits.map((b) => (
                    <li key={b} className="flex gap-3 font-sans text-sm text-line-muted">
                      <span className="text-line-accent mt-0.5">--</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <SendEthButton defaultAmount={tier.defaultAmount} label={tier.tier} />
              </div>
            ))}
          </div>
          <p className="font-sans text-sm text-line-muted max-w-2xl leading-relaxed">
            The film itself will be minted -- a Line artwork in its own right. Producers are not sponsors. They are contributors to a document of a scene that deserves to exist beyond the domestic US narrative that has defined cryptoart until now.
          </p>
        </div>
      </div>

      {/*  Why Now  */}
      <div className="border-b border-line-border">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-3 gap-16">
            <div>
              <p className="label mb-4">Why This  /  Why Now</p>
            </div>
            <div className="md:col-span-2">
              <p className="font-sans text-sm text-line-muted leading-relaxed mb-8">
                The dominant narrative of cryptoart has been American, urban, and male. <em>Off The Charts</em> documents what the scene has never seen clearly... what it looks like when artists build from the most remote corners of the world, grounded in landscape and culture, and meet the centre on their own terms.
              </p>
              <p>
                That story deserves to exist. September 2027 -- NFTNYC is when it premieres.
              </p>
              <Link
                href="/storyline/new-zealand-pioneers"
                className="btn-primary inline-block"
              >
                Read: New Zealand Pioneers 
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/*  Contact  */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <p className="font-mono text-[11px] text-line-muted tracking-widest uppercase mb-2">Interested in producing?</p>
        <p className="font-sans text-sm text-line-muted">
          Reach out to{' '}
          <a href="https://x.com/mintfaced" target="_blank" rel="noopener noreferrer" className="text-line-accent hover:opacity-70 transition-opacity">
            @mintfaced
          </a>
          {' '}on X or connect via{' '}
          <Link href="/join" className="text-line-accent hover:opacity-70 transition-opacity">
            The Line
          </Link>.
        </p>
      </div>

    </main>
  )
}

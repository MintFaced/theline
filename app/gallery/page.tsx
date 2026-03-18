// app/gallery/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { RevealSection } from '@/components/RevealSection'

export const metadata: Metadata = {
  title: 'Gallery — The Line',
  description: 'Visit The Line gallery at 318 Heretaunga Street West, Hastings, Hawke\'s Bay, New Zealand.',
}

const HOURS = [
  { day: 'Mon – Tue',   hours: 'Rarely' },
  { day: 'Wed – Sun',   hours: '10 – 6' },
  { day: 'TheL​ine.nz', hours: 'Always' },
]

export default function GalleryPage() {
  return (
    <div className="bg-line-bg min-h-screen" style={{ paddingTop: 'var(--nav-height)' }}>

      {/* ── Hero — Exterior day shot ────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden" style={{ height: 'clamp(480px, 65vw, 780px)' }}>
        <Image
          src="/images/gallery/gallery-exterior.jpg"
          alt="The Line gallery, 318 Heretaunga Street West, Hastings"
          fill
          priority
          className="object-cover"
          style={{ objectPosition: 'center 60%' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.2) 50%, transparent 100%)' }} />
        <div className="absolute bottom-0 left-0 px-6 pb-10 md:px-12 md:pb-14">
          <p className="label mb-3">Physical Gallery</p>
          <h1 className="font-display font-light text-5xl md:text-7xl text-line-text" style={{ letterSpacing: '-0.03em' }}>
            The Line<br />Hawke's Bay
          </h1>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6">

        {/* ── Location + Hours ─────────────────────────────────────────────── */}
        <RevealSection className="py-16 md:py-24 border-b border-line-border">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            <div>
              <p className="label mb-6">Location</p>
              <address className="not-italic">
                <p className="font-display font-light text-3xl text-line-text mb-1" style={{ letterSpacing: '-0.01em' }}>
                  318 Heretaunga Street West
                </p>
                <p className="font-display font-light text-3xl text-line-text mb-8" style={{ letterSpacing: '-0.01em' }}>
                  Hastings, New Zealand
                </p>
              </address>
              <p className="font-sans text-sm text-line-muted leading-relaxed mb-8">
                The Line occupies a CBD space in Hastings, Hawke's Bay. The gallery features primarily MintFace paintings, and select works from cryptoartists on The Line.
              </p>
              <a
                href="https://maps.google.com/?q=318+Heretaunga+Street+West+Hastings+New+Zealand"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                Get Directions →
              </a>
            </div>

            <div>
              <p className="label mb-6">Opening Hours</p>
              <div className="space-y-px bg-line-border">
                {HOURS.map(({ day, hours }) => (
                  <div key={day} className="bg-line-bg py-5 flex items-center justify-between">
                    <span className="font-sans text-sm text-line-muted">{day}</span>
                    <span className="font-mono text-sm text-line-text tracking-wide">{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealSection>

        {/* ── The Line IRL ─────────────────────────────────────────────────── */}
        <RevealSection className="py-16 md:py-24 border-b border-line-border">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="label mb-6">The Line IRL</p>
              <h2 className="font-display font-light text-4xl text-line-text mb-8" style={{ letterSpacing: '-0.02em' }}>
                A wall that stretches<br />to 1,000
              </h2>
              <div className="space-y-4 font-sans text-sm text-line-muted leading-relaxed">
                <p>
                  Each of the 1,000 positions on The Line is a permanent home for a cryptoartist's work. The physical gallery makes visible what exists on-chain... a continuous, ordered archive of digital art history.
                </p>
                <p>
                  Visitors can walk the full length of The Line digitally, or ask to browse the collection at The Line gallery. The gallery hosts random events — artist talks, collector evenings, and open studio sessions... creating a meeting point between the digital and physical art worlds.
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <Image
                src="/images/gallery/gallery-founder.jpg"
                alt="MintFace, founder of The Line"
                fill
                className="object-cover"
                style={{ objectPosition: 'center 20%' }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 100%)' }}>
                <p className="font-mono text-[10px] text-line-accent tracking-widest mb-1">Founder</p>
                <p className="font-display font-light text-xl text-line-text">MintFace · The Line 0</p>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* ── Art Cloud to Landed Gallery ──────────────────────────────────── */}
        <RevealSection className="py-16 md:py-24 border-b border-line-border">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img
                src="/images/art-cloud-to-land.jpg"
                alt="New Zealand connected to the world — The Line art cloud to landed gallery"
                className="w-full"
              />
            </div>
            <div>
              <p className="label mb-6">From Art Cloud to Landed Gallery</p>
              <h2 className="font-display font-light text-4xl text-line-text mb-8" style={{ letterSpacing: '-0.02em' }}>
                Cloud first,<br />land last
              </h2>
              <div className="space-y-5 font-sans text-sm text-line-muted leading-relaxed">
                <p>
                  The Line community formed digitally in October 2022 by exhibiting a single line of culture through tokenized digital art. The Line existed on-chain first with 1,000 positions. Artists from 82+ countries built The Line in the cloud, secured by blockchain.
                </p>
                <p>
                  From cloud to land is a core tenet of <a href="https://balajis.com/p/the-network-state-2021" target="_blank" rel="noopener noreferrer" className="text-line-accent hover:opacity-70 transition-opacity">Balaji Srinivasan{'\''}s Network State theory</a>... a strategy for building new societies by organising online first and acquiring a physical presence next. The Line is living proof of that process.
                </p>
                <p>
                  Traditional galleries start with walls and find artists to fill them. In a digital first era, that seems backwards. The Line inverted the sequence so the artists came first. The space followed. That is a blueprint that will slowly transform our cities into places we love to live again.
                </p>
                <blockquote className="border-l-2 border-line-accent pl-4 italic text-line-text">
                  "We moved The Line from the digital realm into the physical as the first node of a Network State with shared values of cryptoart. It won{'\''}t be the last." — MintFace
                </blockquote>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* ── Wide interior panorama ────────────────────────────────────────── */}
        <RevealSection className="border-b border-line-border">
          <div className="relative w-full overflow-hidden" style={{ height: 'clamp(260px, 35vw, 520px)' }}>
            <Image
              src="/images/gallery/gallery-interior-7.jpg"
              alt="The Line gallery panorama"
              fill
              className="object-cover"
              style={{ objectPosition: 'center 40%' }}
            />
          </div>
        </RevealSection>

        {/* ── Visit info ───────────────────────────────────────────────────── */}
        <RevealSection className="py-16 md:py-24 border-b border-line-border">
          <div className="grid md:grid-cols-3 gap-px bg-line-border">
            {[
              {
                label: 'Admission',
                heading: 'Free Entry',
                body: 'The Line is free and open to the public. No booking required for general visits.',
              },
              {
                label: 'Groups',
                heading: 'Group Visits',
                body: 'School groups, art societies, and collectors\' groups are welcome. Please contact us to arrange a guided visit.',
              },
              {
                label: 'Events',
                heading: 'Private Events',
                body: 'The gallery is available for private hire — collector evenings, openings, and corporate events.',
              },
            ].map(({ label, heading, body }) => (
              <div key={label} className="bg-line-bg p-8 md:p-10">
                <p className="label mb-4">{label}</p>
                <h3 className="font-display font-light text-2xl text-line-text mb-4">{heading}</h3>
                <p className="font-sans text-sm text-line-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </RevealSection>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <RevealSection className="py-16 md:py-24 text-center">
          <p className="label mb-6">Hawke's Bay, New Zealand</p>
          <h2 className="font-display font-light text-4xl md:text-5xl text-line-text mb-8" style={{ letterSpacing: '-0.02em' }}>
            Come and walk The Line
          </h2>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="https://maps.google.com/?q=318+Heretaunga+Street+West+Hastings+New+Zealand"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Get Directions
            </a>
            <Link href="/artists" className="btn-outline">
              Browse Artists
            </Link>
          </div>
        </RevealSection>

      </div>
    </div>
  )
}

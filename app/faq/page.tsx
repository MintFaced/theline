// app/faq/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FAQ — The Line',
  description: 'Frequently asked questions about The Line — the world\'s first permanent directory of 1,000 cryptoartists.',
}

const FAQS = [
  {
    q: 'What is The Line?',
    a: 'The Line is an artist-centric community of 1,000 artists who exhibit their work digitally in a single, continuous line. It serves as a digital space for creative expression, collaboration, and the preservation of cultural value through art.'
  },
  {
    q: 'How does The Line work?',
    a: 'Artists nominate which collections are to be displayed on The Line. The platform uses blockchain technology to securely display each piece, ensuring transparency and authenticity. Visitors can explore the artworks seamlessly by walking the continuous digital exhibit.'
  },
  {
    q: 'Who can contribute art to The Line?',
    a: 'The Line is open to all artists, from established professionals to emerging creatives. The only requirement is that the art is tokenized on the blockchain.'
  },
  {
    q: 'How many segments on The Line?',
    a: 'The Line is being rounded off to 1,000 artists to represent the canon era of 2021–2026. No more artists will be allocated a 3D space once The Line reaches its 1,000th artist.'
  },
  {
    q: 'Is there a cost to join The Line?',
    a: 'Yes, artists must hold a specific NFT to gain access. This covers the operational costs of maintaining the platform and infrastructure. Organisations, crypto funds, or galleries may apply and pay on behalf of artists.'
  },
  {
    q: 'What types of art can be submitted?',
    a: 'The Line supports a wide range of art forms, including digital paintings, photography, generative art, 3D renderings, AI prompt art, glitch, and mixed media. All submissions must be in tokenized digital formats compatible with The Line.'
  },
  {
    q: 'How is The Line different from other online art galleries?',
    a: 'Unlike traditional galleries, The Line focuses on creating a continuous narrative through its unique linear display format. It emphasizes community-driven curation, transparency through blockchain, and the collective goal of showcasing the canon era of cryptoart.'
  },
  {
    q: 'How is the authenticity of artwork ensured?',
    a: 'The Line uses blockchain technology to tokenize each artwork, assigning it a unique digital signature. This process prevents duplication, verifies ownership, and ensures authenticity.'
  },
  {
    q: 'Can visitors purchase artworks displayed on The Line?',
    a: 'Yes, visitors can purchase select artworks directly through The Line Gift Shop. Each sale is secured by blockchain transactions, providing a seamless and trustworthy purchasing experience.'
  },
  {
    q: 'How does The Line support artists financially?',
    a: 'The Line provides promotional opportunities at the physical Line gallery, as well as articles, book features, and community support on The Line and MintFace social feeds to help artists gain visibility.'
  },
  {
    q: 'What is the long-term vision of The Line?',
    a: 'The ultimate goal of The Line is to create a living archive of human creativity, preserving artistic contributions for future generations and fostering a thriving, interconnected crypto artist community.'
  },
  {
    q: 'How can I explore The Line?',
    a: 'Visitors can explore The Line through its immersive web platform or virtual reality experiences. Navigation tools allow users to browse, search, or discover new artists and themes.'
  },
  {
    q: 'How can I get involved beyond submitting art?',
    a: 'You can support The Line by joining its community, becoming a patron (DM MintFaced), sharing your expertise as a curator, or volunteering to help curate Lines for artists. Organizing regular events and exhibitions on The Line provides opportunities for artists and collectors to engage with the project.'
  },
]

export default function FAQPage() {
  return (
    <div className="bg-line-bg min-h-screen" style={{ paddingTop: 'var(--nav-height)' }}>

      {/* ── Header ── */}
      <div className="border-b border-line-border px-6 py-16 md:py-24 max-w-content mx-auto">
        <p className="label mb-4">FAQ</p>
        <div className="flex items-end justify-between gap-6">
          <h1 className="font-display font-light text-5xl md:text-7xl text-line-text" style={{ letterSpacing: '-0.03em', lineHeight: 1 }}>
            Questions<br />answered
          </h1>
          <p className="font-sans text-sm text-line-muted max-w-xs leading-relaxed hidden md:block">
            Everything you need to know about The Line, membership, and how it all works.
          </p>
        </div>
      </div>

      {/* ── FAQ list ── */}
      <div className="max-w-content mx-auto px-6 py-16">
        <div className="max-w-3xl">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-line-border py-8 grid md:grid-cols-[1fr_2fr] gap-6 md:gap-16">
              <div>
                <span className="font-mono text-[9px] text-line-muted tracking-widest">0{i + 1}</span>
                <h2 className="font-display font-light text-lg text-line-text mt-2 leading-snug" style={{ letterSpacing: '-0.01em' }}>
                  {faq.q}
                </h2>
              </div>
              <p className="font-sans text-sm text-line-muted leading-relaxed self-center">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="border-t border-line-border max-w-content mx-auto px-6 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p className="font-display font-light text-2xl text-line-text mb-2" style={{ letterSpacing: '-0.02em' }}>Still have questions?</p>
          <p className="font-sans text-sm text-line-muted">DM MintFaced on X or explore the membership page.</p>
        </div>
        <div className="flex gap-4">
          <a href="https://x.com/mintface" target="_blank" rel="noopener noreferrer" className="btn-primary">DM on X</a>
          <Link href="/membership" className="btn-outline">Membership</Link>
        </div>
      </div>

    </div>
  )
}

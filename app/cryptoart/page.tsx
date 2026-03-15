import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cryptoart - A New Era',
  description: '2,500 years of art history leading to the Crypto Art era. From Classical antiquity to blockchain-native digital art.',
}

const ERAS = [
  {
    id: 'crypto',
    year: '2020',
    period: '2020 Ongoing',
    title: 'Crypto Art Era',
    subtitle: 'The Tokenized Era',
    count: '50,000+ artworks on The Line',
    style: 'Blockchain-enabled digital art, NFTs, generative art, and metaverse exhibitions.',
    gallery: 'The Line',
    galleryHref: '/artists',
    galleryLocation: 'Global, decentralized',
    galleryDetail: 'A decentralized digital gallery aiming to showcase one million artworks in a singular virtual space.',
    image: '/images/cryptoart-gallery.png',
    imageCredit: null,
    accent: '#C8A96E',
    isFeatured: true,
  },
  {
    id: 'postmodern',
    year: '1960',
    period: 'c. 1960 2020',
    title: 'Postmodernism',
    subtitle: 'Contemporary Art',
    count: '78,000+ artworks at the Tate',
    style: 'Conceptual art, minimalism, pop art, and multimedia experiments blurred boundaries.',
    gallery: 'Tate Modern',
    galleryHref: 'https://www.tate.org.uk',
    galleryLocation: 'London, UK',
    galleryDetail: 'Iconic for Warhol, Hockney, and installation art.',
    image: 'https://theline.wtf/wp-content/uploads/2024/11/Screenshot-2024-11-20-at-12.42.59%20PM-1536x1086.png',
    imageCredit: 'Photo: Noah Kalina',
    accent: '#8B9EB7',
    isFeatured: false,
  },
  {
    id: 'modernism',
    year: '1900',
    period: 'c. 1900 1960',
    title: 'Modernism',
    subtitle: 'Abstraction and Experiment',
    count: '200,000+ artworks at MoMA',
    style: 'Abstract, surrealism, cubism, and expressionism challenged traditional forms.',
    gallery: 'Museum of Modern Art',
    galleryHref: 'https://www.moma.org',
    galleryLocation: 'New York, USA',
    galleryDetail: 'Features Picasso, Kandinsky, and Duchamp.',
    image: 'https://theline.wtf/wp-content/uploads/2024/11/pexels-muffinlandge-28377088-1536x1024.jpg',
    imageCredit: 'Photo by Muffin Land',
    accent: '#B07C6E',
    isFeatured: false,
  },
  {
    id: 'romanticism',
    year: '1800',
    period: 'c. 1800 1880',
    title: 'Romanticism',
    subtitle: 'and Realism',
    count: '80,000+ artworks at Musee d Orsay',
    style: 'Romanticism embraced emotion, nature, and sublime landscapes, while Realism depicted ordinary life and social issues.',
    gallery: 'Musee d Orsay',
    galleryHref: 'https://www.musee-orsay.fr',
    galleryLocation: 'Paris, France',
    galleryDetail: 'Houses works by Delacroix, Courbet, and Millet.',
    image: 'https://theline.wtf/wp-content/uploads/2024/11/pexels-jibarofoto-14631022-1536x1024.jpg',
    imageCredit: 'Photo by Luis Quintero',
    accent: '#7A8C6E',
    isFeatured: false,
  },
  {
    id: 'baroque',
    year: '1600',
    period: 'c. 1600 1750',
    title: 'Baroque Era',
    subtitle: 'Drama and Devotion',
    count: '21,600+ artworks at The Prado',
    style: 'Dramatic lighting, movement, and emotional intensity in religious and royal themes.',
    gallery: 'The Prado Museum',
    galleryHref: 'https://www.museodelprado.es/en',
    galleryLocation: 'Madrid, Spain',
    galleryDetail: 'Highlights Baroque masters like Velazquez and Rubens.',
    image: 'https://theline.wtf/wp-content/uploads/2024/11/pexels-jasinto-shabani-1609538378-27517283-768x1024.jpg',
    imageCredit: 'Photo by Jasinto Shabani',
    accent: '#9B7E5A',
    isFeatured: false,
  },
  {
    id: 'renaissance',
    year: '1400',
    period: 'c. 1400 1600',
    title: 'Renaissance Era',
    subtitle: 'Rebirth of Classicism',
    count: '10,000+ artworks at The Uffizi',
    style: 'Revival of Classical ideals, humanism, perspective, and naturalism.',
    gallery: 'Uffizi Gallery',
    galleryHref: 'https://www.uffizi.it/',
    galleryLocation: 'Florence, Italy',
    galleryDetail: 'Renowned for works by Leonardo da Vinci, Michelangelo, and Botticelli.',
    image: 'https://theline.wtf/wp-content/uploads/2024/11/pexels-tommymila-2704910-1229x1536.jpg',
    imageCredit: 'Photo by Tommy Milanese',
    accent: '#C4A882',
    isFeatured: false,
  },
  {
    id: 'medieval',
    year: '500 CE',
    period: 'c. 500 1400 CE',
    title: 'Medieval Era',
    subtitle: 'Faith in Form',
    count: '480,000+ artworks at The Louvre',
    style: 'Religious art, illuminated manuscripts, Gothic cathedrals, and iconography.',
    gallery: 'The Louvre',
    galleryHref: 'https://www.louvre.fr',
    galleryLocation: 'Paris, France',
    galleryDetail: 'Features Medieval Christian art and Gothic artifacts.',
    image: 'https://theline.wtf/wp-content/uploads/2024/11/pexels-pixabay-210249-1536x1027.jpg',
    imageCredit: null,
    accent: '#6B7B8E',
    isFeatured: false,
  },
  {
    id: 'classical',
    year: '500 BCE',
    period: 'c. 500 BCE 500 CE',
    title: 'Classical Era',
    subtitle: 'The Human Ideal',
    count: '70,000+ artworks at the Vatican',
    style: 'Ancient Greek and Roman art focused on idealized human forms, mythology, and architecture.',
    gallery: 'Vatican Museums',
    galleryHref: 'https://www.museivaticani.va',
    galleryLocation: 'Rome, Italy',
    galleryDetail: 'Showcases Roman frescoes, sculptures, and Classical art heritage.',
    image: null,
    imageCredit: null,
    accent: '#A89070',
    isFeatured: false,
  },
]

export default function CryptoartPage() {
  return (
    <div className="bg-line-bg min-h-screen" style={{ paddingTop: 'var(--nav-height)' }}>

      {/* === HERO === */}
      <div className="relative min-h-[80vh] flex flex-col justify-end overflow-hidden border-b border-line-border">
        {/* Background: the 2500 years image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/wave-hero.png"
            alt="2500 years of art"
            className="w-full h-full object-cover object-center opacity-30"
          />
          {/* Gradient from bottom */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to top, var(--color-line-bg) 0%, var(--color-line-bg) 10%, transparent 50%)'
          }} />
          {/* Vignette edges */}
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)'
          }} />
        </div>

        <div className="relative z-10 max-w-content mx-auto px-6 pb-20 pt-32">
          <div className="max-w-3xl">
            <p className="label mb-6" style={{ letterSpacing: '0.4em' }}>Cryptoart</p>
            <h1 className="font-display font-light text-line-text mb-8"
              style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', lineHeight: '0.95', letterSpacing: '-0.04em' }}>
              2,500 Years<br />
              <span style={{ color: 'var(--color-line-accent)' }}>of Art</span>
            </h1>
            <p className="font-sans text-base text-line-muted leading-relaxed max-w-xl" style={{ fontSize: '0.95rem' }}>
              From the Classical world of ancient Greece and Rome to the blockchain-native art of our era.
              Every age has had its defining gallery, its defining medium, its defining artists.
              This is ours.
            </p>
          </div>

          {/* Era counter strip */}
          <div className="mt-16 flex items-center gap-8 overflow-x-auto pb-2">
            {ERAS.slice().reverse().map((era) => (
              <a key={era.id} href={`#${era.id}`}
                className="flex flex-col items-center gap-1.5 shrink-0 group">
                <div className="w-px h-8 transition-all group-hover:h-12"
                  style={{ backgroundColor: era.isFeatured ? 'var(--color-line-accent)' : 'var(--color-line-border)',
                    opacity: era.isFeatured ? 1 : 0.6 }} />
                <span className="font-mono text-[9px] tracking-widest whitespace-nowrap transition-colors"
                  style={{ color: era.isFeatured ? 'var(--color-line-accent)' : 'var(--color-line-muted)' }}>
                  {era.year}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* === TIMELINE === */}
      <div className="relative">
        {/* Vertical spine line */}
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-line-border opacity-30 hidden md:block" />

        {ERAS.map((era, i) => {
          const isLeft = i % 2 === 0
          const isCrypto = era.isFeatured

          return (
            <div
              key={era.id}
              id={era.id}
              className={`relative ${isCrypto ? 'py-0' : 'py-0'}`}
            >
              {isCrypto ? (
                /* === CRYPTO ERA: Full-bleed hero treatment === */
                <div className="relative min-h-screen flex items-center overflow-hidden border-b border-line-border">
                  {/* Full bg image */}
                  {era.image && (
                    <div className="absolute inset-0 z-0">
                      <img src={era.image} alt={era.title}
                        className="w-full h-full object-cover object-center opacity-25" />
                      <div className="absolute inset-0" style={{
                        background: 'linear-gradient(135deg, var(--color-line-bg) 0%, transparent 60%, var(--color-line-bg) 100%)'
                      }} />
                    </div>
                  )}

                  <div className="relative z-10 max-w-content mx-auto px-6 py-32 w-full">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                      <div>
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-12 h-px" style={{ backgroundColor: 'var(--color-line-accent)' }} />
                          <span className="font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: 'var(--color-line-accent)' }}>
                            Now
                          </span>
                        </div>
                        <p className="font-mono text-[11px] tracking-widest text-line-muted uppercase mb-3">{era.period}</p>
                        <h2 className="font-display font-light text-line-text mb-3"
                          style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', lineHeight: '0.95', letterSpacing: '-0.03em' }}>
                          {era.title}
                        </h2>
                        <p className="font-display font-light mb-8"
                          style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', letterSpacing: '-0.02em', color: 'var(--color-line-accent)', lineHeight: '1' }}>
                          {era.subtitle}
                        </p>
                        <p className="font-sans text-sm text-line-muted leading-relaxed max-w-md mb-10">
                          {era.style}
                        </p>
                        <div className="space-y-px bg-line-border inline-block">
                          <div className="bg-line-bg px-6 py-4">
                            <p className="font-mono text-[9px] text-line-muted tracking-widest uppercase mb-1">Collection</p>
                            <p className="font-mono text-xs text-line-accent">{era.count}</p>
                          </div>
                          <div className="bg-line-bg px-6 py-4">
                            <p className="font-mono text-[9px] text-line-muted tracking-widest uppercase mb-1">Gallery</p>
                            <p className="font-mono text-xs text-line-text">{era.gallery}  - {era.galleryLocation}</p>
                          </div>
                        </div>
                        <div className="mt-8">
                          <Link href={era.galleryHref} className="btn-primary">
                            Explore The Line Artists
                          </Link>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="aspect-square relative overflow-hidden"
                          style={{ border: '1px solid var(--color-line-border)' }}>
                          <img src={era.image!} alt={era.title}
                            className="w-full h-full object-cover opacity-80" />
                          {/* Gold corner accents */}
                          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l"
                            style={{ borderColor: 'var(--color-line-accent)' }} />
                          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r"
                            style={{ borderColor: 'var(--color-line-accent)' }} />
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l"
                            style={{ borderColor: 'var(--color-line-accent)' }} />
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r"
                            style={{ borderColor: 'var(--color-line-accent)' }} />
                        </div>
                        <div className="absolute -bottom-4 -right-4 font-display font-light text-line-border select-none pointer-events-none"
                          style={{ fontSize: '8rem', lineHeight: 1, letterSpacing: '-0.05em', opacity: 0.15 }}>
                          NOW
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              ) : (
                /* === HISTORICAL ERAS === */
                <div className={`border-b border-line-border ${i % 2 === 0 ? 'bg-line-bg' : 'bg-line-surface'}`}>
                  <div className="max-w-content mx-auto px-6">
                    <div className={`grid md:grid-cols-2 gap-0 ${isLeft ? '' : ''}`}>

                      {/* Image side */}
                      <div className={`relative overflow-hidden ${isLeft ? 'md:order-1' : 'md:order-2'}`}
                        style={{ minHeight: '480px' }}>
                        {era.image ? (
                          <>
                            <img src={era.image} alt={era.title}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                              style={{ opacity: 0.65 }} />
                            <div className="absolute inset-0" style={{
                              background: isLeft
                                ? 'linear-gradient(to right, transparent 60%, var(--color-line-bg) 100%)'
                                : 'linear-gradient(to left, transparent 60%, var(--color-line-bg) 100%)',
                              mixBlendMode: 'normal',
                            }} />
                            {era.imageCredit && (
                              <p className="absolute bottom-4 left-4 font-mono text-[9px] text-line-muted/50 tracking-widest">
                                {era.imageCredit}
                              </p>
                            )}
                          </>
                        ) : (
                          /* No image: large year typography */
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-display font-light select-none"
                              style={{ fontSize: '14vw', color: 'var(--color-line-border)', letterSpacing: '-0.05em', lineHeight: 1 }}>
                              {era.year}
                            </span>
                          </div>
                        )}

                        {/* Era year marker */}
                        <div className={`absolute top-8 ${isLeft ? 'left-8' : 'right-8'} flex flex-col items-${isLeft ? 'start' : 'end'} gap-2`}>
                          <span className="font-display font-light"
                            style={{ fontSize: '4rem', lineHeight: 1, letterSpacing: '-0.04em',
                              color: era.accent, opacity: 0.8 }}>
                            {era.year.replace(' BCE', '').replace(' CE', '')}
                          </span>
                          <span className="font-mono text-[9px] tracking-widest"
                            style={{ color: era.accent, opacity: 0.6 }}>
                            {era.year.includes('BCE') ? 'BCE' : era.year.includes('CE') ? 'CE' : 'AD'}
                          </span>
                        </div>
                      </div>

                      {/* Text side */}
                      <div className={`flex flex-col justify-center px-8 md:px-16 py-16 ${isLeft ? 'md:order-2' : 'md:order-1'}`}>
                        <p className="font-mono text-[10px] tracking-[0.3em] uppercase mb-4"
                          style={{ color: era.accent }}>
                          {era.period}
                        </p>
                        <h2 className="font-display font-light text-line-text mb-2"
                          style={{ fontSize: 'clamp(2rem, 3.5vw, 3.5rem)', lineHeight: '0.95', letterSpacing: '-0.03em' }}>
                          {era.title}
                        </h2>
                        <p className="font-display font-light mb-6"
                          style={{ fontSize: 'clamp(1.1rem, 2vw, 1.8rem)', letterSpacing: '-0.01em',
                            color: era.accent, lineHeight: 1.2, opacity: 0.8 }}>
                          {era.subtitle}
                        </p>
                        <p className="font-sans text-sm text-line-muted leading-relaxed mb-8" style={{ maxWidth: '42ch' }}>
                          {era.style}
                        </p>

                        <div className="space-y-px" style={{ borderTop: `1px solid var(--color-line-border)` }}>
                          <div className="flex items-start gap-8 pt-6">
                            <div>
                              <p className="font-mono text-[9px] text-line-muted/60 tracking-widest uppercase mb-1">Collection</p>
                              <p className="font-mono text-[11px] tracking-wider" style={{ color: era.accent }}>{era.count}</p>
                            </div>
                          </div>
                          <div className="pt-4">
                            <p className="font-mono text-[9px] text-line-muted/60 tracking-widest uppercase mb-2">Definitive Gallery</p>
                            <a href={era.galleryHref} target={era.galleryHref.startsWith('http') ? '_blank' : undefined}
                              rel="noopener noreferrer"
                              className="font-mono text-[11px] text-line-text hover:opacity-70 transition-opacity tracking-wider block mb-1">
                              {era.gallery}
                            </a>
                            <p className="font-mono text-[10px] text-line-muted/50 tracking-widest">{era.galleryLocation}</p>
                            <p className="font-sans text-xs text-line-muted/60 leading-relaxed mt-2 max-w-xs">{era.galleryDetail}</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* === FOOTER CALLOUT === */}
      <div className="border-t border-line-border">
        <div className="max-w-content mx-auto px-6 py-24 text-center">
          <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-line-muted mb-6">The Latest Era</p>
          <h3 className="font-display font-light text-line-text mb-6"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '-0.03em', lineHeight: '0.95' }}>
            Your work belongs<br />
            <span style={{ color: 'var(--color-line-accent)' }}>on The Line</span>
          </h3>
          <p className="font-sans text-sm text-line-muted leading-relaxed max-w-md mx-auto mb-10">
            Every era has its defining gallery. The crypto art era has The Line.
            Join the artists shaping the next 2,500 years.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/join" className="btn-primary">Join The Line</Link>
            <Link href="/artists" className="btn-outline">Browse Artists</Link>
          </div>
        </div>
      </div>

    </div>
  )
}

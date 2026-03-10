// components/ArtistCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import type { Artist } from '@/types'
import { CATEGORY_LABELS } from '@/types'

interface Props {
  artist: Artist
  size?: 'sm' | 'md' | 'lg'
}

export function ArtistCard({ artist, size = 'md' }: Props) {
  const primaryLine = artist.allLineNumbers[0]

  return (
    <Link href={`/artists/${artist.slug}`} className="group block">
      {/* Image */}
      <div className={`relative overflow-hidden bg-line-surface ${
        size === 'sm' ? 'aspect-[4/3]' :
        size === 'lg' ? 'aspect-[3/4]' : 'aspect-[4/3]'
      }`}>
        {artist.galleryImage ? (
          <Image
            src={artist.galleryImage}
            alt={artist.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-all duration-500 group-hover:brightness-110 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full bg-line-surface" />
        )}

        {/* Hover description overlay */}
        {artist.description && (
          <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(transparent, rgba(10,10,10,0.9))' }}>
            <p className="font-sans text-xs text-line-text line-clamp-2 leading-relaxed">
              {artist.description}
            </p>
          </div>
        )}

        {/* Featured badge */}
        {artist.featured && (
          <div className="absolute top-3 left-3">
            <span className="font-mono text-[9px] tracking-widest uppercase bg-line-accent text-line-bg px-1.5 py-0.5">
              Featured
            </span>
          </div>
        )}

        {/* Multi-line badge */}
        {artist.allLineNumbers.length > 1 && (
          <div className="absolute top-3 right-3">
            <span className="font-mono text-[9px] tracking-widest bg-line-surface/90 text-line-muted px-1.5 py-0.5 border border-line-border">
              {artist.allLineNumbers.length} Lines
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="pt-3">
        <p className="font-sans text-sm text-line-text group-hover:text-line-hover transition-colors truncate">
          {artist.name}
        </p>
        <div className="flex items-center justify-between mt-0.5">
          <span className="font-mono text-[10px] text-line-muted tracking-wider uppercase">
            {CATEGORY_LABELS[artist.category] || artist.category}
          </span>
          <span className="font-mono text-[11px] text-line-accent tracking-wider">
            {artist.allLineNumbers.length > 1
              ? `LINES ${artist.allLineNumbers.join(', ')}`
              : `LINE ${primaryLine}`}
          </span>
        </div>
      </div>
    </Link>
  )
}

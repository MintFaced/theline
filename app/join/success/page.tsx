// app/join/success/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Welcome to The Line',
  description: 'You\'re now a Line Artist. Welcome.',
}

export default function JoinSuccessPage() {
  return (
    <div className="bg-line-bg min-h-screen flex items-center justify-center px-6" style={{ paddingTop: 'var(--nav-height)' }}>
      <div className="max-w-lg text-center">
        <div className="w-px h-16 bg-line-accent mx-auto mb-12" />
        <p className="label mb-4">Welcome</p>
        <h1 className="font-display font-light text-5xl md:text-6xl text-line-text mb-6" style={{ letterSpacing: '-0.03em' }}>
          You&apos;re on<br />The Line
        </h1>
        <p className="font-sans text-sm text-line-muted leading-relaxed mb-10 max-w-sm mx-auto">
          Your subscription is confirmed. We&apos;ll be in touch shortly to set up your Line Artist profile, assign your Line number, and get your feature article started.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/members/chat" className="btn-primary">
            Enter LARP Chat -
          </Link>
          <Link href="/artists" className="btn-ghost">
            Browse artists
          </Link>
        </div>
        <p className="font-mono text-[10px] text-line-muted tracking-widest mt-10">
          Questions? <a href="mailto:mintface@digitalartisteconomy.com" className="text-line-accent hover:opacity-70 transition-opacity">mintface@digitalartisteconomy.com</a>
        </p>
      </div>
    </div>
  )
}

// app/update/page.tsx
import type { Metadata } from 'next'
import { UpdateForm } from '@/components/UpdateForm'

export const metadata: Metadata = {
  title: 'Update Your Line — The Line',
  description: 'The Line is never finished. Keep your bio, collect link, and minting wallet current so collectors can find and buy your work.',
}

export default function UpdatePage() {
  return (
    <div className="bg-line-bg min-h-screen" style={{ paddingTop: 'var(--nav-height)' }}>

      <div className="border-b border-line-border">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="label mb-4">The Line</p>
            <h1 className="font-display font-light text-5xl md:text-7xl text-line-text mb-6" style={{ letterSpacing: '-0.03em' }}>
              Update<br />Your Line
            </h1>
            <p className="font-sans text-sm text-line-muted leading-relaxed max-w-lg mb-6">
              The Line is never finished. There are three things that drive sales on your profile — keep them current and collectors will find you.
            </p>
            <div className="space-y-px bg-line-border mb-8">
              {[
                { n: '01', label: 'Your bio', desc: 'The story behind your practice. Update it as your work evolves.' },
                { n: '02', label: 'Collect link', desc: 'Where collectors go to buy your work. OpenSea, Objkt, Foundation — wherever your best work lives right now.' },
                { n: '03', label: 'Minting wallet', desc: 'The wallet you mint from. Drives your live on-chain stats and recent works on your profile.' },
              ].map(({ n, label, desc }) => (
                <div key={n} className="bg-line-bg px-6 py-5 flex items-start gap-6">
                  <span className="font-mono text-[10px] text-line-accent tracking-widest shrink-0 mt-0.5">{n}</span>
                  <div>
                    <p className="font-mono text-[11px] text-line-text tracking-widest uppercase mb-1">{label}</p>
                    <p className="font-sans text-sm text-line-muted leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="font-sans text-sm text-line-muted leading-relaxed">
              You tell us — we update. Simple. lffflinee!!
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6 py-16 md:py-24">
        <div className="max-w-2xl">
          <UpdateForm />
        </div>
      </div>

    </div>
  )
}

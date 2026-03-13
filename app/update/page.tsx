// app/update/page.tsx
import type { Metadata } from 'next'
import { UpdateForm } from '@/components/UpdateForm'

export const metadata: Metadata = {
  title: 'Update Your Info — The Line',
  description: 'Update your artist bio, wallet address, collection URL, and available works on The Line.',
}

export default function UpdatePage() {
  return (
    <div className="bg-line-bg min-h-screen" style={{ paddingTop: 'var(--nav-height)' }}>

      <div className="border-b border-line-border">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="label mb-4">The Line</p>
            <h1 className="font-display font-light text-5xl md:text-7xl text-line-text mb-6" style={{ letterSpacing: '-0.03em' }}>
              Update<br />Your Info
            </h1>
            <p className="font-sans text-sm text-line-muted leading-relaxed max-w-md">
              Something wrong with your profile? Want to update your bio, wallet, or where collectors can find your work? Fill this in and we&apos;ll update it manually within a few days.
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

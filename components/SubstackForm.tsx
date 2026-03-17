'use client'
// components/SubstackForm.tsx
import { useState } from 'react'

export function SubstackForm({ layout = 'row' }: { layout?: 'row' | 'col' }) {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    window.open('https://linestories.substack.com/subscribe?email=' + encodeURIComponent(email), '_blank')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex gap-3 ${layout === 'col' ? 'flex-col' : 'flex-col sm:flex-row'} ${layout === 'col' ? 'mt-2' : 'max-w-sm mx-auto'}`}
    >
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className={`bg-line-bg border border-line-border px-4 py-3 font-mono text-sm text-line-text placeholder:text-line-muted focus:outline-none focus:border-line-accent transition-colors ${layout === 'col' ? 'w-full' : 'flex-1'}`}
      />
      <button type="submit" className={`btn-primary whitespace-nowrap ${layout === 'col' ? 'w-full text-center' : ''}`}>
        Subscribe
      </button>
    </form>
  )
}

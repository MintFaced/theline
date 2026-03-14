'use client'
// components/RetreatForm.tsx
import { useState } from 'react'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function RetreatForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({
    name: '',
    email: '',
    lineNumber: '',
    xHandle: '',
    medium: '',
    whyAttend: '',
    dietary: '',
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.name || !form.email) return
    setStatus('sending')
    try {
      const res = await fetch('/api/forms/retreat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('sent')
      } else {
        console.error('Form error:', res.status)
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="border border-line-border p-8">
        <p className="font-mono text-[10px] text-line-accent tracking-widest uppercase mb-3">Interest registered</p>
        <p className="font-display font-light text-2xl text-line-text mb-3" style={{ letterSpacing: '-0.01em' }}>
          We&apos;ll be in touch
        </p>
        <p className="font-sans text-sm text-line-muted leading-relaxed">
          Thanks {form.name}. When the retreat date is confirmed we&apos;ll reach out to everyone who expressed interest.
        </p>
      </div>
    )
  }

  const inputClass = "w-full bg-line-surface border border-line-border px-4 py-3 font-sans text-sm text-line-text placeholder:text-line-muted focus:outline-none focus:border-line-accent transition-colors"
  const labelClass = "font-mono text-[10px] text-line-muted tracking-widest uppercase mb-2 block"

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Name *</label>
          <input type="text" value={form.name} onChange={set('name')} placeholder="Your name" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Email *</label>
          <input type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" className={inputClass} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Line Number</label>
          <input type="text" value={form.lineNumber} onChange={set('lineNumber')} placeholder="e.g. 147" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>X / Twitter handle</label>
          <input type="text" value={form.xHandle} onChange={set('xHandle')} placeholder="@handle" className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Your primary medium</label>
        <select value={form.medium} onChange={set('medium')} className={inputClass}>
          <option value="">Select medium</option>
          <option value="lens-based">Photography / Lens-based</option>
          <option value="painting">Painting</option>
          <option value="illustration">Illustration</option>
          <option value="generative">Generative / Code</option>
          <option value="ai">AI Art</option>
          <option value="3d">3D</option>
          <option value="glitch">Glitch / Digital</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Why do you want to attend?</label>
        <textarea value={form.whyAttend} onChange={set('whyAttend')} placeholder="What are you hoping to get from the retreat?" rows={4} className={inputClass + " resize-none"} />
      </div>

      <div>
        <label className={labelClass}>Dietary requirements</label>
        <input type="text" value={form.dietary} onChange={set('dietary')} placeholder="Any dietary requirements or allergies" className={inputClass} />
      </div>

      <button
        onClick={handleSubmit}
        disabled={status === 'sending' || !form.name || !form.email}
        className="btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? 'Sending…' : 'Register interest'}
      </button>

      {status === 'error' && (
        <p className="font-mono text-[10px] text-red-400 tracking-widest">
          Something went wrong. Email us directly at mintface@digitalartisteconomy.com
        </p>
      )}
    </div>
  )
}

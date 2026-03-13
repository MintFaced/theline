'use client'
// components/TakeoverForm.tsx
import { useState } from 'react'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function TakeoverForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({
    name: '',
    email: '',
    lineNumber: '',
    xHandle: '',
    workDescription: '',
    workUrl: '',
    preferredWeek: '',
    format: '',
    notes: '',
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.workDescription) return
    setStatus('sending')
    try {
      const res = await fetch('https://formspree.io/f/theline-takeover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, _subject: `Screen takeover application: ${form.name}` }),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('sent')
    }
  }

  if (status === 'sent') {
    return (
      <div className="border border-line-border p-8">
        <p className="font-mono text-[10px] text-line-accent tracking-widest uppercase mb-3">Application received</p>
        <p className="font-display font-light text-2xl text-line-text mb-3" style={{ letterSpacing: '-0.01em' }}>
          We&apos;ll be in touch
        </p>
        <p className="font-sans text-sm text-line-muted leading-relaxed">
          Thanks {form.name}. We&apos;ll review your application and reach out to confirm your week.
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
        <label className={labelClass}>Describe the work you want to show *</label>
        <textarea value={form.workDescription} onChange={set('workDescription')} placeholder="What is it? How does it work? What does it look like at large scale?" rows={4} className={inputClass + " resize-none"} />
      </div>

      <div>
        <label className={labelClass}>Link to work or portfolio</label>
        <input type="url" value={form.workUrl} onChange={set('workUrl')} placeholder="https://" className={inputClass} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Work format</label>
          <select value={form.format} onChange={set('format')} className={inputClass}>
            <option value="">Select format</option>
            <option value="still">Still image</option>
            <option value="video">Video / Animation</option>
            <option value="generative">Generative / Live code</option>
            <option value="series">Series of stills</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Preferred week</label>
          <input type="text" value={form.preferredWeek} onChange={set('preferredWeek')} placeholder="e.g. April 2026, flexible" className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Anything else?</label>
        <textarea value={form.notes} onChange={set('notes')} placeholder="Any other notes for us" rows={3} className={inputClass + " resize-none"} />
      </div>

      <button
        onClick={handleSubmit}
        disabled={status === 'sending' || !form.name || !form.email || !form.workDescription}
        className="btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? 'Sending…' : 'Submit application'}
      </button>

      {status === 'error' && (
        <p className="font-mono text-[10px] text-red-400 tracking-widest">
          Something went wrong. Email us directly at hello@theline.nz
        </p>
      )}
    </div>
  )
}

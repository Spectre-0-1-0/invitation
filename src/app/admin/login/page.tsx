'use client'

import { useState } from 'react'
import { Container } from "@/components/layout/Container"
import { Section } from "@/components/layout/Section"
import { Heading } from "@/components/ui/Heading"
import { Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode })
    })

    if (res.ok) {
      window.location.href = '/admin'
    } else {
      setError('Invalid passcode. Please try again.')
    }
    setIsSubmitting(false)
  }

  return (
    <Section className="min-h-screen flex items-center bg-parchment-base">
      <Container>
        <div className="max-w-md mx-auto bg-white p-12 rounded-xl shadow-scrapbook border border-parchment-dark/30">
          <div className="text-center mb-10">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-champagne-gold mb-4 block font-bold">Organizer Portal</span>
            <Heading level={1} className="text-3xl">Admin <span className="italic">Login</span></Heading>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-charcoal-muted mb-2 font-bold">
                Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-parchment-muted/30 border border-parchment-dark/30 rounded-md p-4 text-center text-2xl tracking-[0.5em] focus:border-champagne-gold outline-none transition-all"
                required
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 text-center font-bold uppercase tracking-tight">{error}</p>
            )}

            <button
              disabled={isSubmitting}
              className="w-full bg-heritage-navy text-white font-bold uppercase tracking-[0.2em] py-4 rounded-md shadow-xl hover:bg-heritage-navy/90 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Unlock Access'}
            </button>
          </form>
        </div>
      </Container>
    </Section>
  )
}

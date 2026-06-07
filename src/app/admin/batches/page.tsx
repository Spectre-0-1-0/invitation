'use client'

import { useState, useEffect } from 'react'
import { Container } from "@/components/layout/Container"
import { Section } from "@/components/layout/Section"
import { Heading } from "@/components/ui/Heading"
import { Drawer } from "@/components/ui/Drawer"
import { Plus, Edit2, Trash2, Calendar, Users, FileText } from 'lucide-react'

export default function AdminBatchesPage() {
  const [batches, setBatches] = useState<any[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchBatches = async () => {
    setIsLoading(true)
    const res = await fetch('/api/batches')
    const data = await res.json()
    setBatches(data)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchBatches()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: any = Object.fromEntries(formData)
    data.graduationYear = parseInt(data.graduationYear as string)

    const url = selectedBatch ? `/api/batches/${selectedBatch.id}` : '/api/batches'
    const method = selectedBatch ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (res.ok) {
      setIsDrawerOpen(false)
      fetchBatches()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this batch? All associated data may be lost.')) return
    const res = await fetch(`/api/batches/${id}`, { method: 'DELETE' })
    if (res.ok) fetchBatches()
  }

  return (
    <Section>
      <Container>
        <div className="flex justify-between items-end mb-12">
          <div>
            <Heading level={1} className="text-4xl mb-4">Manage <span className="italic">Batches</span></Heading>
            <p className="text-charcoal-muted font-serif italic text-lg">
              Higher-level organization for graduation years.
            </p>
          </div>
          <button
            onClick={() => { setSelectedBatch(null); setIsDrawerOpen(true); }}
            className="bg-heritage-navy text-white font-bold uppercase tracking-widest py-3 px-6 rounded-md text-xs hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Plus size={16} /> New Batch
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {batches.map((batch) => (
            <div key={batch.id} className="bg-white p-8 rounded-xl border border-parchment-dark/30 shadow-sm group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-lg bg-parchment-muted flex items-center justify-center text-heritage-navy">
                  <Calendar size={24} />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelectedBatch(batch); setIsDrawerOpen(true); }}
                    className="p-2 text-charcoal-muted hover:text-heritage-navy transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(batch.id)}
                    className="p-2 text-charcoal-muted hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-heritage-navy mb-2">{batch.name}</h3>
              <p className="text-sm text-charcoal-muted mb-8 italic font-serif leading-relaxed">
                {batch.description || 'No description provided.'}
              </p>
              <div className="flex items-center gap-6 border-t border-parchment-base pt-6">
                <div className="flex items-center gap-2 text-xs font-mono text-charcoal-muted">
                  <Calendar size={12} /> {batch.graduationYear}
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-charcoal-muted">
                  <Users size={12} /> {batch._count?.people || 0} People
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-charcoal-muted">
                  <FileText size={12} /> {batch._count?.events || 0} Events
                </div>
              </div>
            </div>
          ))}
        </div>

        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title={selectedBatch ? 'Edit Batch' : 'Create New Batch'}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-champagne-gold font-bold">Batch Name</label>
              <input
                name="name"
                defaultValue={selectedBatch?.name}
                required
                className="w-full bg-white border border-parchment-dark/30 rounded-md p-3 text-sm focus:border-champagne-gold outline-none"
                placeholder="e.g., Batch 2026"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-champagne-gold font-bold">Graduation Year</label>
              <input
                name="graduationYear"
                type="number"
                defaultValue={selectedBatch?.graduationYear || 2026}
                required
                className="w-full bg-white border border-parchment-dark/30 rounded-md p-3 text-sm focus:border-champagne-gold outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-champagne-gold font-bold">Description</label>
              <textarea
                name="description"
                defaultValue={selectedBatch?.description}
                rows={4}
                className="w-full bg-white border border-parchment-dark/30 rounded-md p-3 text-sm focus:border-champagne-gold outline-none resize-none"
                placeholder="Briefly describe this batch..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-heritage-navy text-white font-bold uppercase tracking-widest py-4 rounded-md shadow-xl hover:bg-heritage-navy/90 transition-all"
            >
              {selectedBatch ? 'Update Batch' : 'Create Batch'}
            </button>
          </form>
        </Drawer>
      </Container>
    </Section>
  )
}

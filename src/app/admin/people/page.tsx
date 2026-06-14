'use client'

import { useState, useEffect } from 'react'
import { Container } from "@/components/layout/Container"
import { Section } from "@/components/layout/Section"
import { Heading } from "@/components/ui/Heading"
import { Drawer } from "@/components/ui/Drawer"
import { Plus, Edit2, Trash2, Search, User } from 'lucide-react'
import Image from 'next/image'

export default function AdminPeoplePage() {
  const [people, setPeople] = useState<any[]>([])
  const [batches, setBatches] = useState<any[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchData = async () => {
    const [peopleRes, batchesRes] = await Promise.all([
      fetch('/api/people'),
      fetch('/api/batches')
    ])
    setPeople(await peopleRes.json())
    setBatches(await batchesRes.json())
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: any = Object.fromEntries(formData)

    if (!data.slug) {
      data.slug = (data.name as string).toLowerCase().replace(/ /g, '-')
    }

    const url = selectedPerson ? `/api/people/${selectedPerson.id}` : '/api/people'
    const method = selectedPerson ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (res.ok) {
      setIsDrawerOpen(false)
      fetchData()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this person?')) return
    const res = await fetch(`/api/people/${id}`, { method: 'DELETE' })
    if (res.ok) fetchData()
  }

  const filteredPeople = people.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.major?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Section>
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <Heading level={1} className="text-4xl mb-4">Batch <span className="italic">Members</span></Heading>
            <p className="text-charcoal-muted font-serif italic text-lg">
              Manage the individuals who make up the batch archive.
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-muted" size={16} />
              <input
                type="text"
                placeholder="Search people..."
                className="w-full bg-white border border-parchment-dark/30 rounded-md py-3 pl-10 pr-4 text-xs font-bold uppercase tracking-widest outline-none focus:border-champagne-gold transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => { setSelectedPerson(null); setIsDrawerOpen(true); }}
              className="bg-heritage-navy text-white font-bold uppercase tracking-widest py-3 px-6 rounded-md text-xs hover:shadow-xl transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Plus size={16} /> Add Person
            </button>
          </div>
        </div>

        <div className="bg-white border border-parchment-dark/20 rounded-xl overflow-hidden shadow-scrapbook">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-parchment-muted/50 border-b border-parchment-dark/20">
                  <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-[0.2em] text-charcoal-muted">Person</th>
                  <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-[0.2em] text-charcoal-muted">Batch</th>
                  <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-[0.2em] text-charcoal-muted">Major</th>
                  <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-[0.2em] text-charcoal-muted text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-parchment-base">
                {filteredPeople.map((person) => (
                  <tr key={person.id} className="hover:bg-parchment-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-parchment-muted flex items-center justify-center text-heritage-navy overflow-hidden relative">
                          {person.image ? (
                            <Image src={person.image} alt={person.name} fill className="object-cover" />
                          ) : (
                            <User size={16} />
                          )}
                        </div>
                        <span className="text-sm font-bold text-heritage-navy">{person.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-charcoal-muted">{person.batch?.name}</td>
                    <td className="px-6 py-4 text-xs font-serif text-charcoal">{person.major}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setSelectedPerson(person); setIsDrawerOpen(true); }} className="p-2 text-charcoal-muted hover:text-heritage-navy transition-colors"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(person.id)} className="p-2 text-charcoal-muted hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title={selectedPerson ? 'Edit Person' : 'Add New Person'}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-champagne-gold font-bold">Batch</label>
              <select name="batchId" defaultValue={selectedPerson?.batchId} className="w-full bg-white border border-parchment-dark/30 rounded-md p-3 text-sm" required>
                {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-champagne-gold font-bold">Full Name</label>
              <input name="name" defaultValue={selectedPerson?.name} required className="w-full bg-white border border-parchment-dark/30 rounded-md p-3 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-champagne-gold font-bold">Major / Department</label>
              <input name="major" defaultValue={selectedPerson?.major} className="w-full bg-white border border-parchment-dark/30 rounded-md p-3 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-champagne-gold font-bold">Yearbook Quote</label>
              <textarea name="quote" defaultValue={selectedPerson?.quote} rows={3} className="w-full bg-white border border-parchment-dark/30 rounded-md p-3 text-sm resize-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-champagne-gold font-bold">Profile Image URL</label>
              <input name="image" defaultValue={selectedPerson?.image} className="w-full bg-white border border-parchment-dark/30 rounded-md p-3 text-sm" placeholder="/content/profiles/..." />
            </div>
            <button type="submit" className="w-full bg-heritage-navy text-white font-bold uppercase tracking-widest py-4 rounded-md shadow-xl">{selectedPerson ? 'Update Person' : 'Add Person'}</button>
          </form>
        </Drawer>
      </Container>
    </Section>
  )
}

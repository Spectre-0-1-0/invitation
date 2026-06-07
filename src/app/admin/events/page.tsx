'use client'

import { useState, useEffect } from 'react'
import { Container } from "@/components/layout/Container"
import { Section } from "@/components/layout/Section"
import { Heading } from "@/components/ui/Heading"
import { Drawer } from "@/components/ui/Drawer"
import { Badge } from "@/components/ui/Badge"
import { Plus, Edit2, Trash2, Calendar, MapPin, Tag } from 'lucide-react'

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [batches, setBatches] = useState<any[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    setIsLoading(true)
    const [eventsRes, batchesRes] = await Promise.all([
      fetch('/api/events'),
      fetch('/api/batches')
    ])
    setEvents(await eventsRes.json())
    setBatches(await batchesRes.json())
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)

    // Simple slug generation if empty
    if (!data.slug) {
      data.slug = (data.title as string).toLowerCase().replace(/ /g, '-')
    }

    const url = selectedEvent ? `/api/events/${selectedEvent.id}` : '/api/events'
    const method = selectedEvent ? 'PATCH' : 'POST'

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
    if (!confirm('Are you sure you want to delete this event?')) return
    const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })
    if (res.ok) fetchData()
  }

  return (
    <Section>
      <Container>
        <div className="flex justify-between items-end mb-12">
          <div>
            <Heading level={1} className="text-4xl mb-4">Manage <span className="italic">Events</span></Heading>
            <p className="text-charcoal-muted font-serif italic text-lg">
              The primary containers for all batch memories.
            </p>
          </div>
          <button
            onClick={() => { setSelectedEvent(null); setIsDrawerOpen(true); }}
            className="bg-heritage-navy text-white font-bold uppercase tracking-widest py-3 px-6 rounded-md text-xs hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Plus size={16} /> New Event
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white p-8 rounded-xl border border-parchment-dark/30 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <Badge variant="secondary" className="font-bold">{event.batch?.name}</Badge>
                <div className="flex gap-2">
                  <button onClick={() => { setSelectedEvent(event); setIsDrawerOpen(true); }} className="p-2 text-charcoal-muted hover:text-heritage-navy"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(event.id)} className="p-2 text-charcoal-muted hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-heritage-navy mb-4">{event.title}</h3>
              <p className="text-sm text-charcoal-muted mb-8 italic font-serif leading-relaxed line-clamp-3">
                {event.description || 'No description provided.'}
              </p>
              <div className="mt-auto space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-charcoal-muted">
                  <Calendar size={12} className="text-champagne-gold" /> {event.startDate ? new Date(event.startDate).toLocaleDateString() : 'No date set'}
                </div>
                {event.location && (
                  <div className="flex items-center gap-2 text-xs font-mono text-charcoal-muted">
                    <MapPin size={12} className="text-champagne-gold" /> {event.location}
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs font-mono text-charcoal-muted">
                  <Tag size={12} className="text-champagne-gold" /> {event.eventType || 'General'}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title={selectedEvent ? 'Edit Event' : 'Create New Event'}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-champagne-gold font-bold">Associated Batch</label>
              <select name="batchId" defaultValue={selectedEvent?.batchId} className="w-full bg-white border border-parchment-dark/30 rounded-md p-3 text-sm" required>
                {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-champagne-gold font-bold">Event Title</label>
              <input name="title" defaultValue={selectedEvent?.title} required className="w-full bg-white border border-parchment-dark/30 rounded-md p-3 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-champagne-gold font-bold">Date</label>
                <input name="startDate" type="date" defaultValue={selectedEvent?.startDate?.split('T')[0]} className="w-full bg-white border border-parchment-dark/30 rounded-md p-3 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-champagne-gold font-bold">Type</label>
                <input name="eventType" defaultValue={selectedEvent?.eventType} placeholder="e.g. Party" className="w-full bg-white border border-parchment-dark/30 rounded-md p-3 text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-champagne-gold font-bold">Location</label>
              <input name="location" defaultValue={selectedEvent?.location} className="w-full bg-white border border-parchment-dark/30 rounded-md p-3 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-champagne-gold font-bold">Description</label>
              <textarea name="description" defaultValue={selectedEvent?.description} rows={4} className="w-full bg-white border border-parchment-dark/30 rounded-md p-3 text-sm resize-none" />
            </div>
            <div className="pt-4 flex items-center gap-2">
              <input name="featured" type="checkbox" defaultChecked={selectedEvent?.featured} className="w-4 h-4" />
              <label className="text-xs font-bold text-heritage-navy">Feature this event on timeline</label>
            </div>
            <button type="submit" className="w-full bg-heritage-navy text-white font-bold uppercase tracking-widest py-4 rounded-md shadow-xl">{selectedEvent ? 'Update Event' : 'Create Event'}</button>
          </form>
        </Drawer>
      </Container>
    </Section>
  )
}

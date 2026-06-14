'use client'

import { useState, useEffect } from 'react'
import { Container } from "@/components/layout/Container"
import { Section } from "@/components/layout/Section"
import { Heading } from "@/components/ui/Heading"
import { Drawer } from "@/components/ui/Drawer"
import { Badge } from "@/components/ui/Badge"
import { Search, Filter, Edit2, Trash2, Maximize2, Star, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import Image from 'next/image'

export default function AdminMediaPage() {
  const [media, setMedia] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterEvent, setFilterEvent] = useState('all')

  const fetchData = async () => {
    const [mediaRes, eventsRes] = await Promise.all([
      fetch('/api/media/tracking'),
      fetch('/api/events')
    ])
    setMedia(await mediaRes.json())
    setEvents(await eventsRes.json())
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: any = Object.fromEntries(formData)

    data.featured = formData.get('featured') === 'on'
    data.importance = parseInt(data.importance) || 0
    data.displayPriority = parseInt(data.displayPriority) || 0

    const res = await fetch(`/api/media/${selectedMedia.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (res.ok) {
      setIsDrawerOpen(false)
      fetchData()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media?')) return
    const res = await fetch(`/api/media/${id}`, { method: 'DELETE' })
    if (res.ok) fetchData()
  }

  const filteredMedia = media.filter(m => {
    const matchesSearch = m.title?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesEvent = filterEvent === 'all' || m.eventId === filterEvent
    return matchesSearch && matchesEvent
  })

  return (
    <Section>
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <Heading level={1} className="text-4xl mb-4">Media <span className="italic">Library</span></Heading>
            <p className="text-charcoal-muted font-serif italic text-lg">
              Manage and curate the visual memories of the batch.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-muted" size={16} />
              <select
                className="w-full bg-white border border-parchment-dark/30 rounded-md py-3 pl-10 pr-4 text-[10px] font-bold uppercase tracking-widest outline-none appearance-none"
                value={filterEvent}
                onChange={(e) => setFilterEvent(e.target.value)}
              >
                <option value="all">All Events</option>
                {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
              </select>
            </div>
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-muted" size={16} />
              <input
                type="text"
                placeholder="Search media..."
                className="w-full bg-white border border-parchment-dark/30 rounded-md py-3 pl-10 pr-4 text-xs font-bold uppercase tracking-widest outline-none focus:border-champagne-gold transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredMedia.map((m) => (
            <div key={m.id} className="group relative bg-white border border-parchment-dark/30 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="aspect-square bg-parchment-muted relative overflow-hidden">
                {m.thumbnailUrl ? (
                  <Image src={m.thumbnailUrl} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-charcoal-muted/20 font-bold text-2xl uppercase italic">
                    {m.type[0]}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                   <button onClick={() => { setSelectedMedia(m); setIsDrawerOpen(true); }} className="p-2 bg-white rounded-full text-heritage-navy hover:bg-champagne-gold transition-colors"><Edit2 size={16} /></button>
                   <button onClick={() => handleDelete(m.id)} className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
                </div>
                {m.featured && (
                  <div className="absolute top-2 left-2 p-1.5 bg-champagne-gold rounded-full text-heritage-navy shadow-lg">
                    <Star size={12} fill="currentColor" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <span className="block text-[10px] font-bold text-heritage-navy truncate mb-1">{m.title}</span>
                <span className="block text-[8px] font-mono text-charcoal-muted uppercase tracking-tighter truncate">{m.event?.title}</span>
              </div>
            </div>
          ))}
        </div>

        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title="Edit Media Metadata"
        >
          {selectedMedia && (
            <div className="space-y-8">
              <div className="aspect-video bg-black rounded-lg overflow-hidden relative border-4 border-white shadow-lg">
                <Image
                  src={selectedMedia.url}
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-champagne-gold font-bold">Title</label>
                  <input name="title" defaultValue={selectedMedia.title} required className="w-full bg-white border border-parchment-dark/30 rounded-md p-3 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-champagne-gold font-bold">Description / Caption</label>
                  <textarea name="description" defaultValue={selectedMedia.description} rows={3} className="w-full bg-white border border-parchment-dark/30 rounded-md p-3 text-sm resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-champagne-gold font-bold">Importance (0-10)</label>
                    <input name="importance" type="number" defaultValue={selectedMedia.importance} className="w-full bg-white border border-parchment-dark/30 rounded-md p-3 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-champagne-gold font-bold">Display Priority</label>
                    <input name="displayPriority" type="number" defaultValue={selectedMedia.displayPriority} className="w-full bg-white border border-parchment-dark/30 rounded-md p-3 text-sm" />
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <input name="featured" type="checkbox" defaultChecked={selectedMedia.featured} className="w-4 h-4" id="feat-check" />
                    <label htmlFor="feat-check" className="text-xs font-bold text-heritage-navy">Featured Status</label>
                  </div>
                </div>
                <button type="submit" className="w-full bg-heritage-navy text-white font-bold uppercase tracking-widest py-4 rounded-md shadow-xl">Update Metadata</button>
              </form>
            </div>
          )}
        </Drawer>
      </Container>
    </Section>
  )
}

'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Calendar,
  MapPin,
  Star,
  Search,
  Filter,
  Loader2,
  Trash2,
  Archive
} from 'lucide-react';
import { Slideover } from '@/components/admin/ui/Slideover';

interface Event {
  id: string;
  slug: string;
  title: string;
  description?: string;
  date?: string;
  location?: string;
  chapterQuote?: string;
  featured: boolean;
  isArchived: boolean;
  batchId: string;
  batch?: { name: string };
  _count: {
    media: number;
    participants: number;
  };
}

interface Batch {
  id: string;
  name: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSlideoverOpen, setIsSlideoverOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    date: '',
    location: '',
    chapterQuote: '',
    batchId: '',
    featured: false,
    isArchived: false
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [eventsRes, batchesRes] = await Promise.all([
        fetch('/api/admin/events'),
        fetch('/api/admin/batches')
      ]);
      const eventsData = await eventsRes.json();
      const batchesData = await batchesRes.json();

      if (Array.isArray(eventsData)) setEvents(eventsData);
      if (Array.isArray(batchesData)) setBatches(batchesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const url = currentEvent
      ? `/api/admin/events/${currentEvent.id}`
      : '/api/admin/events';

    const method = currentEvent ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsSlideoverOpen(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentEvent || !confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;

    try {
      const res = await fetch(`/api/admin/events/${currentEvent.id}`, { method: 'DELETE' });
      if (res.ok) {
        setIsSlideoverOpen(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const openCreate = () => {
    setCurrentEvent(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      date: '',
      location: '',
      chapterQuote: '',
      batchId: batches[0]?.id || '',
      featured: false,
      isArchived: false
    });
    setIsSlideoverOpen(true);
  };

  const openEdit = (event: Event) => {
    setCurrentEvent(event);
    setFormData({
      title: event.title,
      slug: event.slug,
      description: event.description || '',
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
      location: event.location || '',
      chapterQuote: event.chapterQuote || '',
      batchId: event.batchId,
      featured: event.featured,
      isArchived: event.isArchived
    });
    setIsSlideoverOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-4xl text-[#1A2B48] mb-2">Events</h1>
          <p className="text-[#333333]/60">Organize memories into story chapters.</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#1A2B48] text-[#FDFCF8] px-6 py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-[#1A2B48]/90 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>New Event</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#333333]/30" />
          <input
            type="text"
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-[#D4AF37]/20 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-[#333333]/40">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="font-serif italic text-lg">Curating your chapters...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-[#D4AF37]/20 rounded-2xl p-16 text-center">
          <Calendar className="w-16 h-16 text-[#D4AF37]/20 mx-auto mb-4" />
          <h3 className="text-xl font-playfair text-[#1A2B48] mb-2">No events recorded</h3>
          <p className="text-[#333333]/40 mb-8">Every great story starts with an event. Create your first one now.</p>
          <button
            onClick={openCreate}
            className="text-[#1A2B48] font-medium border-b-2 border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
          >
            Start the archive
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className={`bg-white rounded-2xl border border-[#D4AF37]/20 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col md:flex-row group ${event.isArchived ? 'opacity-60 grayscale' : ''}`}
            >
              <div className="flex-1 p-6 relative">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/5 px-2 py-1 rounded">
                      {event.batch?.name}
                    </span>
                    {event.featured && <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />}
                  </div>
                  <button
                    onClick={() => openEdit(event)}
                    className="p-2 hover:bg-[#FDFCF8] rounded-full text-[#1A2B48]/40 hover:text-[#1A2B48] transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-playfair text-2xl text-[#1A2B48] mb-2">{event.title}</h3>

                <div className="space-y-2 mb-6">
                  {event.date && (
                    <div className="flex items-center text-sm text-[#333333]/60">
                      <Calendar className="w-4 h-4 mr-2 text-[#D4AF37]/60" />
                      {new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center text-sm text-[#333333]/60">
                      <MapPin className="w-4 h-4 mr-2 text-[#D4AF37]/60" />
                      {event.location}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-6 pt-4 border-t border-[#D4AF37]/10">
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-[#1A2B48]">{event._count.media}</span>
                    <span className="text-[10px] uppercase tracking-widest text-[#333333]/40">Media</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-[#1A2B48]">{event._count.participants}</span>
                    <span className="text-[10px] uppercase tracking-widest text-[#333333]/40">People</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Slideover
        isOpen={isSlideoverOpen}
        onClose={() => setIsSlideoverOpen(false)}
        title={currentEvent ? 'Edit Event' : 'Create Event'}
      >
        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#1A2B48] mb-2 font-serif">Batch</label>
              <select
                value={formData.batchId}
                onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                className="w-full px-4 py-3 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded focus:ring-2 focus:ring-[#D4AF37] outline-none font-serif"
                required
              >
                <option value="">Select a Batch</option>
                {batches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A2B48] mb-2 font-serif">Event Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded focus:ring-2 focus:ring-[#D4AF37] outline-none font-serif"
                placeholder="e.g. Freshers Party"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A2B48] mb-2 font-serif">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-3 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded focus:ring-2 focus:ring-[#D4AF37] outline-none font-mono text-sm"
                placeholder="freshers-party"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1A2B48] mb-2 font-serif">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded focus:ring-2 focus:ring-[#D4AF37] outline-none font-serif"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A2B48] mb-2 font-serif">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded focus:ring-2 focus:ring-[#D4AF37] outline-none font-serif"
                  placeholder="Campus Hall"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A2B48] mb-2 font-serif">Chapter Quote</label>
              <textarea
                value={formData.chapterQuote}
                onChange={(e) => setFormData({ ...formData, chapterQuote: e.target.value })}
                className="w-full px-4 py-3 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded focus:ring-2 focus:ring-[#D4AF37] outline-none font-serif italic"
                placeholder="A quote that sums up this event..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center text-center ${
                  formData.featured ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-[#1A2B48]/5 bg-white'
                }`}
              >
                <Star className={`w-6 h-6 mb-2 ${formData.featured ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-[#333333]/20'}`} />
                <span className="text-xs font-bold uppercase tracking-widest text-[#1A2B48]">Featured</span>
              </div>

              <div
                onClick={() => setFormData({ ...formData, isArchived: !formData.isArchived })}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center text-center ${
                  formData.isArchived ? 'border-[#1A2B48] bg-[#1A2B48]/5' : 'border-[#1A2B48]/5 bg-white'
                }`}
              >
                <Archive className={`w-6 h-6 mb-2 ${formData.isArchived ? 'text-[#1A2B48]' : 'text-[#333333]/20'}`} />
                <span className="text-xs font-bold uppercase tracking-widest text-[#1A2B48]">Archived</span>
              </div>
            </div>

            {currentEvent && (
              <button
                type="button"
                onClick={handleDelete}
                className="w-full flex items-center justify-center space-x-2 text-red-500 text-sm font-medium pt-8 hover:text-red-600 transition-colors border-t border-[#D4AF37]/10"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Event Forever</span>
              </button>
            )}
          </div>

          <div className="fixed bottom-0 right-0 left-0 p-6 bg-[#FDFCF8] border-t border-[#D4AF37]/10 max-w-md ml-auto">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1A2B48] text-[#FDFCF8] py-4 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-[#1A2B48]/90 transition-all shadow-lg disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
              <span>{currentEvent ? 'Save Changes' : 'Create Event'}</span>
            </button>
          </div>
        </form>
      </Slideover>
    </div>
  );
}

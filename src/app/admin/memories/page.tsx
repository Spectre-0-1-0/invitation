'use client';

import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Loader2,
  Trash2,
  Calendar,
  User,
  Plus
} from 'lucide-react';
import { Slideover } from '@/components/admin/ui/Slideover';

interface Memory {
  id: string;
  from: string;
  content: string;
  category?: string;
  timestamp: string;
  eventId?: string;
  event?: { title: string };
  personId?: string;
  person?: { name: string };
}

interface Event {
  id: string;
  title: string;
}

interface Person {
  id: string;
  name: string;
}

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSlideoverOpen, setIsSlideoverOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    from: '',
    content: '',
    category: 'appreciation',
    eventId: '',
    personId: ''
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [memRes, eventsRes, peopleRes] = await Promise.all([
        fetch('/api/admin/memories'),
        fetch('/api/admin/events'),
        fetch('/api/admin/people')
      ]);
      const memData = await memRes.json();
      const eventsData = await eventsRes.json();
      const peopleData = await peopleRes.json();

      if (Array.isArray(memData)) setMemories(memData);
      if (Array.isArray(eventsData)) setEvents(eventsData);
      if (Array.isArray(peopleData)) setPeople(peopleData);
    } catch (error) {
      console.error('Error fetching memories:', error);
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
    try {
      const res = await fetch('/api/admin/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsSlideoverOpen(false);
        setFormData({ from: '', content: '', category: 'appreciation', eventId: '', personId: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Error saving memory:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this memory?')) return;
    try {
      await fetch(`/api/admin/memories/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error('Error deleting memory:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-playfair text-4xl text-[#1A2B48] mb-2">Memories & Messages</h1>
          <p className="text-[#333333]/60">Written farewells, anecdotes, and well-wishes.</p>
        </div>
        <button
          onClick={() => setIsSlideoverOpen(true)}
          className="bg-[#1A2B48] text-[#FDFCF8] px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-[#1A2B48]/90 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Memory</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#333333]/30" />
        <input
          type="text"
          placeholder="Search memories..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-[#D4AF37]/20 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none"
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-[#333333]/40">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="font-serif italic text-lg">Reading the notes...</p>
        </div>
      ) : memories.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-[#D4AF37]/20 rounded-2xl p-16 text-center">
          <MessageSquare className="w-16 h-16 text-[#D4AF37]/20 mx-auto mb-4" />
          <h3 className="text-xl font-playfair text-[#1A2B48] mb-2">No memories yet</h3>
          <p className="text-[#333333]/40 mb-8">Be the first to record a memory or a farewell note.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {memories.map((msg) => (
            <div key={msg.id} className="bg-white p-6 rounded-2xl border border-[#D4AF37]/20 shadow-sm flex flex-col justify-between group relative">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-[#FDFCF8] px-3 py-1 rounded-full border border-[#D4AF37]/20">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">{msg.category}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[#1A2B48] font-serif italic mb-6 leading-relaxed">&quot;{msg.content}&quot;</p>
              </div>

              <div className="pt-4 border-t border-[#D4AF37]/10 flex justify-between items-end">
                <div>
                  <p className="font-playfair text-lg text-[#1A2B48]">{msg.from}</p>
                  <p className="text-[10px] text-[#333333]/40 uppercase tracking-widest">
                    {new Date(msg.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-1 text-[#333333]/40">
                  {msg.event && (
                    <div className="flex items-center" title={msg.event.title}>
                      <Calendar className="w-3 h-3 mr-1" />
                      <span className="text-[10px] truncate max-w-[120px]">{msg.event.title}</span>
                    </div>
                  )}
                  {msg.person && (
                    <div className="flex items-center" title={msg.person.name}>
                      <User className="w-3 h-3 mr-1" />
                      <span className="text-[10px] truncate max-w-[120px]">{msg.person.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Slideover
        isOpen={isSlideoverOpen}
        onClose={() => setIsSlideoverOpen(false)}
        title="Add Written Memory"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#1A2B48] mb-2 font-serif">From</label>
            <input
              type="text"
              value={formData.from}
              onChange={(e) => setFormData({ ...formData, from: e.target.value })}
              className="w-full px-4 py-3 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded focus:ring-2 focus:ring-[#D4AF37] outline-none font-serif"
              placeholder="Your name or organization"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A2B48] mb-2 font-serif">Message / Anecdote</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded focus:ring-2 focus:ring-[#D4AF37] outline-none font-serif"
              placeholder="What would you like to say?"
              rows={5}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A2B48] mb-2 font-serif">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded focus:ring-2 focus:ring-[#D4AF37] outline-none font-serif"
            >
              <option value="appreciation">Appreciation</option>
              <option value="anecdote">Anecdote</option>
              <option value="farewell">Farewell</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A2B48] mb-2 font-serif">Related Event</label>
            <select
              value={formData.eventId}
              onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
              className="w-full px-4 py-3 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded focus:ring-2 focus:ring-[#D4AF37] outline-none font-serif"
            >
              <option value="">Select an Event (Optional)</option>
              {events.map(e => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A2B48] mb-2 font-serif">Related Person</label>
            <select
              value={formData.personId}
              onChange={(e) => setFormData({ ...formData, personId: e.target.value })}
              className="w-full px-4 py-3 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded focus:ring-2 focus:ring-[#D4AF37] outline-none font-serif"
            >
              <option value="">Select a Person (Optional)</option>
              {people.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1A2B48] text-[#FDFCF8] py-4 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-[#1A2B48]/90 transition-all shadow-lg disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
            <span>Save Memory</span>
          </button>
        </form>
      </Slideover>
    </div>
  );
}

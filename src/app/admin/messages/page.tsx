'use client';

import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Plus,
  Search,
  Loader2,
  User,
  Calendar,
  Trash2,
  Tag
} from 'lucide-react';
import { Slideover } from '@/components/admin/ui/Slideover';

interface Message {
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

interface Event { id: string; title: string; }
interface Person { id: string; name: string; }

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
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
      const [msgRes, eventsRes, peopleRes] = await Promise.all([
        fetch('/api/admin/messages'),
        fetch('/api/admin/events'),
        fetch('/api/admin/people')
      ]);
      const [msgData, eventsData, peopleData] = await Promise.all([
        msgRes.json(),
        eventsRes.json(),
        peopleRes.json()
      ]);

      if (Array.isArray(msgData)) setMessages(msgData);
      if (Array.isArray(eventsData)) setEvents(eventsData);
      if (Array.isArray(peopleData)) setPeople(peopleData);
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

    try {
      const res = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsSlideoverOpen(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error saving message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreate = () => {
    setFormData({
      from: '',
      content: '',
      category: 'appreciation',
      eventId: '',
      personId: ''
    });
    setIsSlideoverOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-playfair text-4xl text-[#1A2B48] mb-2">Messages</h1>
          <p className="text-[#333333]/60">Preserve the notes, thanks, and jokes shared.</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#1A2B48] text-[#FDFCF8] px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-[#1A2B48]/90 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>New Message</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-[#333333]/40">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="font-serif italic text-lg">Reading the notes...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-[#D4AF37]/20 rounded-2xl p-16 text-center">
          <MessageSquare className="w-16 h-16 text-[#D4AF37]/20 mx-auto mb-4" />
          <h3 className="text-xl font-playfair text-[#1A2B48] mb-2">No messages yet</h3>
          <p className="text-[#333333]/40 mb-8">Every message is a memory worth keeping.</p>
          <button
            onClick={openCreate}
            className="text-[#1A2B48] font-medium border-b-2 border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
          >
            Write the first one
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white p-6 rounded-2xl border border-[#D4AF37]/20 shadow-sm relative group"
            >
              <div className="mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/5 px-2 py-1 rounded">
                  {msg.category || 'General'}
                </span>
              </div>

              <p className="text-[#333333] font-serif italic mb-6 leading-relaxed">&quot;{msg.content}&quot;</p>

              <div className="flex flex-col space-y-2 pt-4 border-t border-[#D4AF37]/10">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm font-bold text-[#1A2B48]">From: {msg.from}</p>
                    {msg.person && (
                      <p className="text-[10px] text-[#333333]/40 flex items-center">
                        <User className="w-3 h-3 mr-1" /> To {msg.person.name}
                      </p>
                    )}
                    {msg.event && (
                      <p className="text-[10px] text-[#333333]/40 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" /> Re: {msg.event.title}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] text-[#333333]/30">
                    {new Date(msg.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Taped effect decoration */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-[#D4AF37]/20 rotate-1 rounded-sm shadow-sm" />
            </div>
          ))}
        </div>
      )}

      <Slideover
        isOpen={isSlideoverOpen}
        onClose={() => setIsSlideoverOpen(false)}
        title="New Message"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#1A2B48] mb-2 font-serif">From</label>
              <input
                type="text"
                value={formData.from}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                className="w-full px-4 py-3 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded focus:ring-2 focus:ring-[#D4AF37] outline-none font-serif"
                placeholder="Sender's name"
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
                <option value="thank-you">Thank You</option>
                <option value="funny">Funny</option>
                <option value="appreciation">Appreciation</option>
                <option value="farewell">Farewell</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1A2B48] mb-2 font-serif">Link to Event</label>
                <select
                  value={formData.eventId}
                  onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded focus:ring-2 focus:ring-[#D4AF37] outline-none text-xs"
                >
                  <option value="">None</option>
                  {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A2B48] mb-2 font-serif">Link to Person</label>
                <select
                  value={formData.personId}
                  onChange={(e) => setFormData({ ...formData, personId: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded focus:ring-2 focus:ring-[#D4AF37] outline-none text-xs"
                >
                  <option value="">None</option>
                  {people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A2B48] mb-2 font-serif">Message Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded focus:ring-2 focus:ring-[#D4AF37] outline-none font-serif italic h-32"
                placeholder="Write the message here..."
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1A2B48] text-[#FDFCF8] py-4 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-[#1A2B48]/90 transition-all shadow-lg disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
            <span>Save Message</span>
          </button>
        </form>
      </Slideover>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Loader2,
  Image as ImageIcon,
  Video,
  File as FileIcon,
  CheckSquare,
  Trash2,
  Edit2,
  Star,
  Gem,
  Tag,
  AlertCircle
} from 'lucide-react';
import { Slideover } from '@/components/admin/ui/Slideover';
import { SimpleMediaUpload } from '@/components/admin/SimpleMediaUpload';
import Image from 'next/image';

interface Media {
  id: string;
  url: string;
  thumbnailUrl?: string;
  type: 'PHOTO' | 'VIDEO' | 'DOCUMENT' | 'MEME' | 'POSTER' | 'SCREENSHOT';
  category?: string;
  title?: string;
  description?: string;
  featured: boolean;
  isHiddenGem: boolean;
  eventId: string;
  event?: { title: string };
  taggedPeople: { id: string, name: string }[];
}

interface Event {
  id: string;
  title: string;
}

interface Person {
  id: string;
  name: string;
}

export default function MediaPage() {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSlideoverOpen, setIsSlideoverOpen] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [currentMedia, setCurrentMedia] = useState<Media | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    url: '',
    type: 'PHOTO' as Media['type'],
    eventId: '',
    title: '',
    description: '',
    category: 'gallery',
    featured: false,
    isHiddenGem: false,
    taggedPeopleIds: [] as string[]
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [mediaRes, eventsRes, peopleRes] = await Promise.all([
        fetch('/api/admin/media'),
        fetch('/api/admin/events'),
        fetch('/api/admin/people')
      ]);
      const mediaData = await mediaRes.json();
      const eventsData = await eventsRes.json();
      const peopleData = await peopleRes.json();

      if (Array.isArray(mediaData)) setMediaList(mediaData);
      if (Array.isArray(eventsData)) {
        setEvents(eventsData);
        if (eventsData.length > 0 && !selectedEventId) setSelectedEventId(eventsData[0].id);
      }
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

    const url = currentMedia
      ? `/api/admin/media/${currentMedia.id}`
      : '/api/admin/media';

    const method = currentMedia ? 'PATCH' : 'POST';

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
      console.error('Error saving media:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentMedia || !confirm('Are you sure you want to delete this media?')) return;

    try {
      const res = await fetch(`/api/admin/media/${currentMedia.id}`, { method: 'DELETE' });
      if (res.ok) {
        setIsSlideoverOpen(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting media:', error);
    }
  };

  const openEdit = (media: Media) => {
    setCurrentMedia(media);
    setFormData({
      url: media.url,
      type: media.type,
      eventId: media.eventId,
      title: media.title || '',
      description: media.description || '',
      category: media.category || 'gallery',
      featured: media.featured,
      isHiddenGem: media.isHiddenGem,
      taggedPeopleIds: media.taggedPeople.map(p => p.id)
    });
    setIsSlideoverOpen(true);
  };

  const togglePerson = (personId: string) => {
    setFormData(prev => ({
      ...prev,
      taggedPeopleIds: prev.taggedPeopleIds.includes(personId)
        ? prev.taggedPeopleIds.filter(id => id !== personId)
        : [...prev.taggedPeopleIds, personId]
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-4xl text-[#1A2B48] mb-2">Media Archive</h1>
          <p className="text-[#333333]/60">Manage photos, videos, and documents.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsUploaderOpen(true)}
            className="bg-[#D4AF37] text-[#1A2B48] px-6 py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-[#D4AF37]/90 transition-colors shadow-lg font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Bulk Upload</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#333333]/30" />
          <input
            type="text"
            placeholder="Search by title or description..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-[#D4AF37]/20 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-3 bg-white border border-[#D4AF37]/20 rounded-xl outline-none text-[#1A2B48]/60">
            <option value="">All Types</option>
            <option value="PHOTO">Photos</option>
            <option value="VIDEO">Videos</option>
            <option value="DOCUMENT">Documents</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-[#333333]/40">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="font-serif italic text-lg">Sorting through the negatives...</p>
        </div>
      ) : mediaList.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-[#D4AF37]/20 rounded-2xl p-16 text-center">
          <ImageIcon className="w-16 h-16 text-[#D4AF37]/20 mx-auto mb-4" />
          <h3 className="text-xl font-playfair text-[#1A2B48] mb-2">No media found</h3>
          <p className="text-[#333333]/40 mb-8">Start uploading the first memories to the archive.</p>
          <button
            onClick={() => setIsUploaderOpen(true)}
            className="text-[#1A2B48] font-medium border-b-2 border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
          >
            Upload your first photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {mediaList.map((media) => (
            <div
              key={media.id}
              onClick={() => openEdit(media)}
              className="relative aspect-square bg-white rounded-xl border border-[#D4AF37]/10 overflow-hidden group cursor-pointer hover:shadow-lg transition-all"
            >
              {media.url ? (
                <div className="w-full h-full relative">
                  <Image
                    src={media.url}
                    alt={media.title || 'Media'}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-[#1A2B48]/5 flex items-center justify-center">
                  {media.type === 'VIDEO' ? (
                    <Video className="w-8 h-8 text-[#1A2B48]/20" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-[#1A2B48]/20" />
                  )}
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                <p className="text-white text-[10px] font-medium truncate">{media.title || 'Untitled'}</p>
                <p className="text-white/60 text-[8px] uppercase tracking-widest">{media.type}</p>
              </div>

              {media.featured && (
                <div className="absolute top-2 right-2 p-1 bg-[#D4AF37] rounded-md shadow-sm">
                  <Star className="w-3 h-3 text-[#1A2B48] fill-[#1A2B48]" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Bulk Upload Slideover */}
      <Slideover
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        title="Archive Ingestion"
      >
        <div className="space-y-8">
          <div className="p-4 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-lg">
            <h4 className="text-sm font-bold text-[#1A2B48] mb-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" /> Local Ingestion
            </h4>
            <p className="text-xs text-[#1A2B48]/70">
              Media will be saved to the local archive. Make sure to assign it to an event.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold uppercase tracking-widest text-[#1A2B48] mb-4">
              Step 1: Select Event
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#1A2B48]/10 rounded focus:ring-2 focus:ring-[#D4AF37] outline-none font-serif"
            >
              <option value="">Select an Event</option>
              {events.map(e => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold uppercase tracking-widest text-[#1A2B48] mb-4">
              Step 2: Upload Files
            </label>
            <SimpleMediaUpload
              eventId={selectedEventId}
              onUploadComplete={() => {
                fetchData();
              }}
            />
          </div>
        </div>
      </Slideover>

      {/* Edit Slideover */}
      <Slideover
        isOpen={isSlideoverOpen}
        onClose={() => setIsSlideoverOpen(false)}
        title="Edit Memory"
      >
        <form onSubmit={handleSubmit} className="space-y-6 pb-24">
          <div className="space-y-6">
            {formData.url && (
              <div className="relative aspect-video bg-[#FDFCF8] rounded-2xl border border-[#D4AF37]/20 overflow-hidden">
                <Image
                  src={formData.url}
                  alt="Media Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#1A2B48] mb-2 font-serif">Event</label>
              <select
                value={formData.eventId}
                onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                className="w-full px-4 py-3 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded focus:ring-2 focus:ring-[#D4AF37] outline-none font-serif"
                required
              >
                <option value="">Select an Event</option>
                {events.map(e => (
                  <option key={e.id} value={e.id}>{e.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A2B48] mb-2 font-serif">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded focus:ring-2 focus:ring-[#D4AF37] outline-none font-serif"
                placeholder="Memory title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A2B48] mb-2 font-serif flex items-center">
                <Tag className="w-4 h-4 mr-2" /> Tag People
              </label>
              <div className="flex flex-wrap gap-2 p-3 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded h-32 overflow-y-auto">
                {people.map(person => (
                  <button
                    key={person.id}
                    type="button"
                    onClick={() => togglePerson(person.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      formData.taggedPeopleIds.includes(person.id)
                        ? 'bg-[#1A2B48] text-white'
                        : 'bg-white text-[#1A2B48]/60 border border-[#D4AF37]/20'
                    }`}
                  >
                    {person.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center text-center ${
                  formData.featured ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-[#1A2B48]/5 bg-white'
                }`}
              >
                <Star className={`w-6 h-6 mb-2 ${formData.featured ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-[#333333]/20'}`} />
                <span className="text-xs font-bold uppercase tracking-widest text-[#1A2B48]">Feature</span>
              </div>

              <div
                onClick={() => setFormData({ ...formData, isHiddenGem: !formData.isHiddenGem })}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center text-center ${
                  formData.isHiddenGem ? 'border-purple-500 bg-purple-500/5' : 'border-[#1A2B48]/5 bg-white'
                }`}
              >
                <Gem className={`w-6 h-6 mb-2 ${formData.isHiddenGem ? 'text-purple-500' : 'text-[#333333]/20'}`} />
                <span className="text-xs font-bold uppercase tracking-widest text-[#1A2B48]">Hidden Gem</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDelete}
              className="w-full flex items-center justify-center space-x-2 text-red-500 text-sm font-medium pt-4 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete from Archive</span>
            </button>
          </div>

          <div className="fixed bottom-0 right-0 left-0 p-6 bg-[#FDFCF8] border-t border-[#D4AF37]/10 max-w-md ml-auto">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1A2B48] text-[#FDFCF8] py-4 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-[#1A2B48]/90 transition-all shadow-lg disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </Slideover>
    </div>
  );
}

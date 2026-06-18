'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Upload,
  Image as ImageIcon,
  Video,
  Search,
  Filter,
  Loader2,
  Star,
  Gem,
  Tag,
  Trash2,
  X,
  Calendar
} from 'lucide-react';
import { Slideover } from '@/components/admin/ui/Slideover';

interface Media {
  id: string;
  url: string;
  type: string;
  title?: string;
  description?: string;
  featured: boolean;
  isHiddenGem: boolean;
  eventId: string;
  event?: { title: string };
  taggedPeople?: { id: string, name: string }[];
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
  const [currentMedia, setCurrentMedia] = useState<Media | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    url: '',
    type: 'PHOTO',
    title: '',
    description: '',
    eventId: '',
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
      const [mediaData, eventsData, peopleData] = await Promise.all([
        mediaRes.json(),
        eventsRes.json(),
        peopleRes.json()
      ]);

      if (Array.isArray(mediaData)) setMediaList(mediaData);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({
          ...prev,
          url: data.url,
          type: data.type,
          title: prev.title || file.name.split('.')[0]
        }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

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

  const openCreate = () => {
    setCurrentMedia(null);
    setFormData({
      url: '',
      type: 'PHOTO',
      title: '',
      description: '',
      eventId: events[0]?.id || '',
      featured: false,
      isHiddenGem: false,
      taggedPeopleIds: []
    });
    setIsSlideoverOpen(true);
  };

  const openEdit = (media: Media) => {
    setCurrentMedia(media);
    setFormData({
      url: media.url,
      type: media.type,
      title: media.title || '',
      description: media.description || '',
      eventId: media.eventId,
      featured: media.featured,
      isHiddenGem: media.isHiddenGem,
      taggedPeopleIds: media.taggedPeople?.map(p => p.id) || []
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
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-4xl text-[#1A2B48] mb-2">Media Archive</h1>
          <p className="text-[#333333]/60">Manage the visual history of your graduating class.</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#1A2B48] text-[#FDFCF8] px-6 py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-[#1A2B48]/90 transition-colors shadow-lg"
        >
          <Upload className="w-5 h-5" />
          <span>Upload Media</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#333333]/30" />
          <input
            type="text"
            placeholder="Search titles, tags, or events..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-[#D4AF37]/20 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center space-x-2 px-4 py-3 bg-white border border-[#D4AF37]/20 rounded-xl hover:bg-[#FDFCF8] transition-colors text-[#1A2B48]/60">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-[#333333]/40">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="font-serif italic text-lg">Developing the film...</p>
        </div>
      ) : mediaList.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-[#D4AF37]/20 rounded-2xl p-16 text-center">
          <ImageIcon className="w-16 h-16 text-[#D4AF37]/20 mx-auto mb-4" />
          <h3 className="text-xl font-playfair text-[#1A2B48] mb-2">No media found</h3>
          <p className="text-[#333333]/40 mb-8">Start populating the archive with your first photo or video.</p>
          <button
            onClick={openCreate}
            className="text-[#1A2B48] font-medium border-b-2 border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
          >
            Upload your first memory
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {mediaList.map((media) => (
            <div
              key={media.id}
              onClick={() => openEdit(media)}
              className="aspect-square bg-[#FDFCF8] rounded-xl border border-[#D4AF37]/20 overflow-hidden relative group cursor-pointer hover:shadow-lg transition-all"
            >
              {/* Mock Image Placeholder */}
              <div className="w-full h-full bg-[#1A2B48]/5 flex items-center justify-center">
                {media.type === 'VIDEO' ? (
                  <Video className="w-8 h-8 text-[#1A2B48]/20" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-[#1A2B48]/20" />
                )}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                <p className="text-white text-xs font-medium truncate">{media.title || 'Untitled'}</p>
                <p className="text-white/60 text-[10px] truncate">{media.event?.title}</p>
              </div>

              <div className="absolute top-2 right-2 flex space-x-1">
                {media.featured && (
                  <div className="bg-[#D4AF37] p-1 rounded shadow-sm">
                    <Star className="w-3 h-3 text-white fill-white" />
                  </div>
                )}
                {media.isHiddenGem && (
                  <div className="bg-purple-500 p-1 rounded shadow-sm">
                    <Gem className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Slideover
        isOpen={isSlideoverOpen}
        onClose={() => setIsSlideoverOpen(false)}
        title={currentMedia ? 'Edit Media' : 'Upload Media'}
      >
        <form onSubmit={handleSubmit} className="space-y-6 pb-24">
          <div className="space-y-6">
            {/* File Upload Section */}
            {!formData.url ? (
              <div className="border-2 border-dashed border-[#D4AF37]/30 rounded-2xl p-8 text-center bg-[#FDFCF8] hover:bg-[#FDFCF8]/50 transition-colors relative">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*,video/*"
                  disabled={isUploading}
                />
                <div className="flex flex-col items-center">
                  {isUploading ? (
                    <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37] mb-3" />
                  ) : (
                    <Upload className="w-10 h-10 text-[#D4AF37]/40 mb-3" />
                  )}
                  <p className="text-[#1A2B48] font-medium">Click or drag to upload</p>
                  <p className="text-[#333333]/40 text-sm mt-1">Photos or Videos (up to 50MB)</p>
                </div>
              </div>
            ) : (
              <div className="relative aspect-video bg-[#FDFCF8] rounded-2xl border border-[#D4AF37]/20 flex items-center justify-center overflow-hidden group">
                <div className="text-center p-4">
                  <ImageIcon className="w-12 h-12 text-[#D4AF37]/20 mx-auto mb-2" />
                  <p className="text-xs text-[#333333]/60 truncate max-w-full">{formData.url}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, url: '' })}
                  className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#1A2B48] mb-2 font-serif">Event (Primary Container)</label>
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
                placeholder="Give this memory a name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A2B48] mb-2 font-serif">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded focus:ring-2 focus:ring-[#D4AF37] outline-none font-serif h-24"
                placeholder="Describe what happened..."
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
          </div>

          <div className="fixed bottom-0 right-0 left-0 p-6 bg-[#FDFCF8] border-t border-[#D4AF37]/10 max-w-md ml-auto">
            <button
              type="submit"
              disabled={isSubmitting || !formData.url}
              className="w-full bg-[#1A2B48] text-[#FDFCF8] py-4 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-[#1A2B48]/90 transition-all shadow-lg disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
              <span>{currentMedia ? 'Save Changes' : 'Add to Archive'}</span>
            </button>
          </div>
        </form>
      </Slideover>
    </div>
  );
}

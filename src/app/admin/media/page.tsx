'use client';
import Image from "next/image";

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
  Calendar,
  CheckCircle,
  AlertCircle,
  CheckSquare,
  Square
} from 'lucide-react';
import { Slideover } from '@/components/admin/ui/Slideover';
import { MediaUploader } from '@/components/admin/MediaUploader';

interface Media {
  id: string;
  url: string;
  type: string;
  title?: string;
  description?: string;
  featured: boolean;
  isHiddenGem: boolean;
  status?: string;
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
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [currentMedia, setCurrentMedia] = useState<Media | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState('');

  // Bulk operations state
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);
  const [isBulkTagOpen, setIsBulkTagOpen] = useState(false);

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
      if (Array.isArray(eventsData)) {
        setEvents(eventsData);
        if (eventsData.length > 0 && !selectedEventId) {
          setSelectedEventId(eventsData[0].id);
        }
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setCurrentMedia(null);
    setFormData({
      url: '',
      type: 'PHOTO',
      title: '',
      description: '',
      eventId: selectedEventId,
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

  const toggleMediaSelection = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedMediaIds(prev =>
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action: string, data: any = {}) => {
    if (selectedMediaIds.length === 0) return;
    if (action === 'DELETE' && !confirm(`Delete ${selectedMediaIds.length} memories?`)) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/media/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, mediaIds: selectedMediaIds, data })
      });
      if (res.ok) {
        setSelectedMediaIds([]);
        fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
        if (action === 'TAG') setIsBulkTagOpen(false);
      }
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = currentMedia ? `/api/admin/media/${currentMedia.id}` : '/api/admin/media';
      const method = currentMedia ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsSlideoverOpen(false);
        fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
      }
    } catch (error) {
      console.error('Submit failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentMedia || !confirm('Are you sure you want to delete this memory?')) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/media/${currentMedia.id}`, { method: 'DELETE' });
      if (res.ok) {
        setIsSlideoverOpen(false);
        fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
      }
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 pb-32">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-playfair text-[#1A2B48] mb-2">Media Library</h1>
          <p className="text-[#333333]/60 font-serif italic">Managing the visual history of the class.</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsUploadOpen(true)}
            className="bg-[#1A2B48] text-[#FDFCF8] px-6 py-3 rounded-xl font-medium flex items-center space-x-2 hover:bg-[#1A2B48]/90 transition-all shadow-lg"
          >
            <Upload className="w-4 h-4" />
            <span>Bulk Upload</span>
          </button>
          <button
            onClick={openCreate}
            className="bg-[#D4AF37] text-[#FDFCF8] px-6 py-3 rounded-xl font-medium flex items-center space-x-2 hover:bg-[#D4AF37]/90 transition-all shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Single Entry</span>
          </button>
        </div>
      </div>

      {/* Bulk Toolbar */}
      {selectedMediaIds.length > 0 && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] bg-[#1A2B48] text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center space-x-2 border-r border-white/20 pr-8">
            <CheckSquare className="w-5 h-5 text-[#D4AF37]" />
            <span className="font-bold text-lg">{selectedMediaIds.length} Selected</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsBulkTagOpen(true)}
              className="flex items-center space-x-2 hover:text-[#D4AF37] transition-colors"
            >
              <Tag className="w-4 h-4" />
              <span>Tag People</span>
            </button>
            <button
              onClick={() => handleBulkAction('FEATURE', { featured: true })}
              className="flex items-center space-x-2 hover:text-[#D4AF37] transition-colors"
            >
              <Star className="w-4 h-4" />
              <span>Feature</span>
            </button>
            <button
              onClick={() => handleBulkAction('DELETE')}
              className="flex items-center space-x-2 text-red-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
          <button
            onClick={() => setSelectedMediaIds([])}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-8 bg-[#FDFCF8] p-4 rounded-2xl border border-[#D4AF37]/10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A2B48]/20" />
          <input
            type="text"
            placeholder="Search memories..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#D4AF37]/20 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
          />
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white border border-[#D4AF37]/20 px-4 py-2 rounded-xl">
             <Calendar className="w-4 h-4 text-[#D4AF37]" />
             <select
               value={selectedEventId}
               onChange={(e) => setSelectedEventId(e.target.value)}
               className="text-sm bg-transparent outline-none text-[#1A2B48]"
             >
               {events.map(e => (
                 <option key={e.id} value={e.id}>{e.title}</option>
               ))}
             </select>
          </div>
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
              className={`aspect-square bg-[#FDFCF8] rounded-xl border ${
                selectedMediaIds.includes(media.id) ? 'border-[#D4AF37] ring-4 ring-[#D4AF37]/10' : 'border-[#D4AF37]/20'
              } overflow-hidden relative group cursor-pointer hover:shadow-lg transition-all`}
            >
              {media.url ? (
                <Image fill
                  src={media.url}
                  alt={media.title || ''}
                  className={`w-full h-full object-cover grayscale ${
                    selectedMediaIds.includes(media.id) ? 'grayscale-0' : 'group-hover:grayscale-0'
                  } transition-all duration-500`}
                />
              ) : (
                <div className="w-full h-full bg-[#1A2B48]/5 flex items-center justify-center">
                  {media.type === 'VIDEO' ? (
                    <Video className="w-8 h-8 text-[#1A2B48]/20" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-[#1A2B48]/20" />
                  )}
                </div>
              )}

              {/* Selection Checkbox */}
              <div
                className={`absolute top-3 left-3 z-10 transition-opacity ${
                  selectedMediaIds.includes(media.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
                onClick={(e) => toggleMediaSelection(e, media.id)}
              >
                {selectedMediaIds.includes(media.id) ? (
                  <CheckSquare className="w-6 h-6 text-[#D4AF37] fill-[#1A2B48]" />
                ) : (
                  <Square className="w-6 h-6 text-white/60" />
                )}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                <p className="text-white text-xs font-medium truncate">{media.title || 'Untitled'}</p>
                <p className="text-white/60 text-[10px] truncate">{media.event?.title}</p>
              </div>

              <div className="absolute top-2 right-2 flex space-x-1">
                {media.status === 'PROCESSING' && (
                  <div className="bg-blue-500 p-1 rounded shadow-sm">
                    <Loader2 className="w-3 h-3 text-white animate-spin" />
                  </div>
                )}
                {media.status === 'FAILED' && (
                  <div className="bg-red-500 p-1 rounded shadow-sm">
                    <AlertCircle className="w-3 h-3 text-white" />
                  </div>
                )}
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

      {/* Bulk Tag Slideover */}
      <Slideover
        isOpen={isBulkTagOpen}
        onClose={() => setIsBulkTagOpen(false)}
        title={`Tag ${selectedMediaIds.length} Memories`}
      >
        <div className="space-y-6">
          <p className="text-sm text-[#333333]/60 italic font-serif">
            Select people who appear in all these memories.
          </p>
          <div className="flex flex-wrap gap-2 p-4 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded-2xl h-96 overflow-y-auto">
            {people.map(person => (
              <button
                key={person.id}
                type="button"
                onClick={() => togglePerson(person.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  formData.taggedPeopleIds.includes(person.id)
                    ? 'bg-[#1A2B48] text-white'
                    : 'bg-white text-[#1A2B48]/60 border border-[#D4AF37]/20'
                }`}
              >
                {person.name}
              </button>
            ))}
          </div>
          <div className="fixed bottom-0 right-0 left-0 p-6 bg-[#FDFCF8] border-t border-[#D4AF37]/10 max-w-md ml-auto">
            <button
              onClick={() => handleBulkAction('TAG', { peopleIds: formData.taggedPeopleIds })}
              disabled={isSubmitting || formData.taggedPeopleIds.length === 0}
              className="w-full bg-[#1A2B48] text-[#FDFCF8] py-4 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-[#1A2B48]/90 transition-all shadow-lg disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
              <span>Apply Tags</span>
            </button>
          </div>
        </div>
      </Slideover>

      {/* Bulk Upload Slideover */}
      <Slideover
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Production Ingestion"
      >
        <div className="space-y-8">
          <div className="bg-[#FDFCF8] p-6 rounded-2xl border border-[#D4AF37]/20">
            <label className="block text-sm font-bold uppercase tracking-widest text-[#1A2B48] mb-4">
              Step 1: Select Container (Event)
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#1A2B48]/10 rounded focus:ring-2 focus:ring-[#D4AF37] outline-none font-serif"
            >
              {events.map(e => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
            <p className="mt-2 text-xs text-[#333333]/40 italic">
              All uploaded media will be automatically assigned to this event.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold uppercase tracking-widest text-[#1A2B48] mb-4">
              Step 2: Upload Memories
            </label>
            <MediaUploader
              eventId={selectedEventId}
              onUploadComplete={() => {
                fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
              }}
            />
          </div>
        </div>
      </Slideover>

      {/* Edit/Single Slideover */}
      <Slideover
        isOpen={isSlideoverOpen}
        onClose={() => setIsSlideoverOpen(false)}
        title={currentMedia ? 'Edit Media' : 'Add Single Memory'}
      >
        <form onSubmit={handleSubmit} className="space-y-6 pb-24">
          <div className="space-y-6">
            {formData.url && (
              <div className="relative aspect-video bg-[#FDFCF8] rounded-2xl border border-[#D4AF37]/20 overflow-hidden group">
                <Image fill alt="" src={formData.url} className="w-full h-full object-cover" />
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

            {currentMedia && (
              <button
                type="button"
                onClick={handleDelete}
                className="w-full flex items-center justify-center space-x-2 text-red-500 text-sm font-medium pt-4 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove from Archive</span>
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
              <span>{currentMedia ? 'Save Changes' : 'Add to Archive'}</span>
            </button>
          </div>
        </form>
      </Slideover>
    </div>
  );
}

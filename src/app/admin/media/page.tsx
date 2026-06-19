'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
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
} from 'lucide-react';
import { Slideover } from '@/components/admin/ui/Slideover';
import { MediaUploader } from '@/components/admin/MediaUploader';

export default function MediaManagement() {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [people, setPeople] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSlideoverOpen, setIsSlideoverOpen] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [currentMedia, setCurrentMedia] = useState<any>(null);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
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

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [mediaRes, eventsRes, peopleRes] = await Promise.all([
        fetch('/api/admin/media'),
        fetch('/api/admin/events'),
        fetch('/api/admin/people')
      ]);

      const mediaData = await mediaRes.json();
      const eventsData = await eventsRes.json();
      const peopleData = await peopleRes.json();

      setMediaList(mediaData);
      setEvents(eventsData);
      setPeople(peopleData);

      if (eventsData.length > 0 && !selectedEventId) {
        setSelectedEventId(eventsData[0].id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedEventId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const openEdit = (media: any) => {
    setCurrentMedia(media);
    setFormData({
      url: media.url,
      type: media.type,
      title: media.title || '',
      description: media.description || '',
      eventId: media.eventId,
      featured: media.featured || false,
      isHiddenGem: media.isHiddenGem || false,
      taggedPeopleIds: media.taggedPeople?.map((p: any) => p.id) || []
    });
    setIsSlideoverOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = currentMedia
        ? `/api/admin/media/${currentMedia.id}`
        : '/api/admin/media';
      const method = currentMedia ? 'PATCH' : 'POST';

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
      console.error('Failed to save media:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentMedia || !confirm('Are you sure you want to remove this memory?')) return;

    try {
      const res = await fetch(`/api/admin/media/${currentMedia.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setIsSlideoverOpen(false);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to delete media:', error);
    }
  };

  const togglePerson = (personId: string) => {
    setFormData(prev => ({
      ...prev,
      taggedPeopleIds: prev.taggedPeopleIds.includes(personId)
        ? prev.taggedPeopleIds.filter(id => id !== personId)
        : [...prev.taggedPeopleIds, personId]
    }));
  };

  const handleBulkDelete = async () => {
    if (selectedMediaIds.length === 0 || !confirm(`Delete ${selectedMediaIds.length} items?`)) return;

    try {
      await fetch('/api/admin/media/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedMediaIds })
      });
      setSelectedMediaIds([]);
      fetchData();
    } catch (error) {
      console.error('Bulk delete failed');
    }
  };

  const filteredMedia = mediaList.filter(m => {
    const matchesSearch = (m.title?.toLowerCase() || '').includes(search.toLowerCase()) ||
                         (m.description?.toLowerCase() || '').includes(search.toLowerCase());
    const matchesType = filterType === 'ALL' || m.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#1A2B48]">Media Archive</h1>
          <p className="text-[#333333]/60">Manage photos, videos, and milestones.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsUploaderOpen(true)}
            className="flex items-center space-x-2 bg-[#D4AF37] text-[#1A2B48] px-6 py-3 rounded-lg font-medium hover:bg-[#D4AF37]/90 transition-all shadow-md"
          >
            <Upload className="w-4 h-4" />
            <span>Bulk Upload</span>
          </button>
          <button
            onClick={openCreate}
            className="flex items-center space-x-2 bg-[#1A2B48] text-[#FDFCF8] px-6 py-3 rounded-lg font-medium hover:bg-[#1A2B48]/90 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Single</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#D4AF37]/10 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333333]/30" />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {['ALL', 'PHOTO', 'VIDEO', 'MEME'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                filterType === type
                  ? 'bg-[#1A2B48] text-white'
                  : 'bg-[#FDFCF8] text-[#1A2B48]/60 border border-[#1A2B48]/10 hover:border-[#D4AF37]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        {selectedMediaIds.length > 0 && (
          <div className="flex items-center gap-3 pl-4 border-l border-[#D4AF37]/20">
            <span className="text-xs font-bold text-[#D4AF37]">{selectedMediaIds.length} Selected</span>
            <button
              onClick={handleBulkDelete}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Selected"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin" />
          <p className="text-[#1A2B48] font-serif italic">Consulting the archives...</p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-2xl border-2 border-dashed border-[#D4AF37]/20">
          <ImageIcon className="w-16 h-16 text-[#D4AF37]/20 mx-auto mb-4" />
          <h3 className="text-xl font-serif text-[#1A2B48] mb-2">No Memories Found</h3>
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
          {filteredMedia.map((media) => (
            <div
              key={media.id}
              onClick={() => openEdit(media)}
              className={`aspect-square bg-[#FDFCF8] rounded-xl border ${
                selectedMediaIds.includes(media.id) ? 'border-[#D4AF37] ring-4 ring-[#D4AF37]/10' : 'border-[#D4AF37]/20'
              } overflow-hidden relative group cursor-pointer hover:shadow-lg transition-all`}
            >
              {media.url ? (
                <div className="relative w-full h-full">
                  <Image
                    src={media.url}
                    alt={media.title || 'Archive Media'}
                    fill
                    className={`object-cover grayscale ${
                      selectedMediaIds.includes(media.id) ? 'grayscale-0' : 'group-hover:grayscale-0'
                    } transition-all duration-500`}
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

              {/* Selection Checkbox */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMediaIds(prev =>
                    prev.includes(media.id) ? prev.filter(id => id !== media.id) : [...prev, media.id]
                  );
                }}
                className={`absolute top-2 left-2 p-1.5 rounded-md backdrop-blur-md transition-all ${
                  selectedMediaIds.includes(media.id)
                    ? 'bg-[#D4AF37] text-[#1A2B48]'
                    : 'bg-black/20 text-white opacity-0 group-hover:opacity-100'
                }`}
              >
                <CheckSquare className="w-3 h-3" />
              </button>

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
        title="Production Ingestion"
      >
        <div className="space-y-8">
          <div className="p-4 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-lg">
            <h4 className="text-sm font-bold text-[#1A2B48] mb-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" /> Ingestion Policy
            </h4>
            <ul className="text-xs text-[#1A2B48]/70 space-y-1 list-disc pl-4">
              <li>Media will be processed for thumbnails automatically.</li>
              <li>Duplicates are prevented via MD5 checksum validation.</li>
              <li>Ensure all faces are visible for better tagging.</li>
            </ul>
          </div>

          <div>
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

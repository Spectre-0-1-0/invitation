'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Filter,
  Loader2,
  Image as ImageIcon,
  Video,
  FileText,
  MoreVertical,
  Edit,
  Trash2,
  ExternalLink,
  ChevronRight,
  User,
  Calendar,
  CheckCircle2,
  X,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Slideover } from '@/components/admin/ui/Slideover';
import { MediaUploader } from '@/components/admin/MediaUploader';
import Image from 'next/image';

interface Media {
  id: string;
  url: string;
  thumbnailUrl: string | null;
  type: 'PHOTO' | 'VIDEO' | 'DOCUMENT' | 'POSTER' | 'MEME' | 'SCREENSHOT';
  title: string | null;
  description: string | null;
  category: string | null;
  featured: boolean;
  isHiddenGem: boolean;
  eventId: string;
  event: { title: string };
}

interface Event {
  id: string;
  title: string;
}

interface Person {
  id: string;
  name: string;
}

export default function MediaAdminPage() {
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

  const fetchData = useCallback(async () => {
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
        if (eventsData.length > 0 && !selectedEventId) {
          // Only auto-select if no event is selected
        }
      }
      if (Array.isArray(peopleData)) setPeople(peopleData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedEventId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media?')) return;

    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
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
      taggedPeopleIds: [], // We would need another API call to get these
    });
    setIsSlideoverOpen(true);
  };

  const openCreate = () => {
    setCurrentMedia(null);
    setFormData({
      url: '',
      type: 'PHOTO',
      eventId: events.length > 0 ? events[0].id : '',
      title: '',
      description: '',
      category: 'gallery',
      featured: false,
      isHiddenGem: false,
      taggedPeopleIds: [],
    });
    setIsSlideoverOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Heading level={1}>Media Assets</Heading>
          <p className="text-charcoal-muted mt-1">
            Manage photos, videos, and documents across all events.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsUploaderOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add Media
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted" />
            <input
              type="text"
              placeholder="Search by title or description..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-champagne-gold/20 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-charcoal-muted" />
            <select className="border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-champagne-gold/20">
              <option value="">All Types</option>
              <option value="PHOTO">Photos</option>
              <option value="VIDEO">Videos</option>
              <option value="DOCUMENT">Documents</option>
            </select>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-charcoal-muted">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p>Loading media library...</p>
        </div>
      ) : mediaList.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-parchment-muted rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-charcoal-muted opacity-20" />
          </div>
          <Heading level={3}>No Media Found</Heading>
          <p className="text-charcoal-muted mt-2 max-w-md mx-auto">
            You haven&apos;t uploaded any media yet. Start by adding a single file or using the bulk uploader.
          </p>
          <Button onClick={openCreate} className="mt-6">
            Upload Your First Photo
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mediaList.map((media) => (
            <Card key={media.id} className="group overflow-hidden flex flex-col h-full border-parchment-dark/10 hover:border-champagne-gold/30 transition-colors">
              <div className="relative aspect-square bg-parchment-muted overflow-hidden">
                {media.type === 'PHOTO' ? (
                  <Image
                    src={media.url}
                    alt={media.title || 'Media'}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {media.type === 'VIDEO' ? <Video className="w-12 h-12 text-charcoal-muted/30" /> : <FileText className="w-12 h-12 text-charcoal-muted/30" />}
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" onClick={() => openEdit(media)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white text-red-600" onClick={() => handleDelete(media.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {media.featured && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-champagne-gold text-white border-none shadow-sm">Featured</Badge>
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{media.type}</Badge>
                  <span className="text-[10px] text-charcoal-muted font-mono">{media.category}</span>
                </div>
                <h3 className="font-semibold text-sm line-clamp-1 mb-1">{media.title || 'Untitled Asset'}</h3>
                <div className="flex items-center text-[11px] text-charcoal-muted mt-auto">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{media.event.title}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit/Create Slideover */}
      <Slideover
        isOpen={isSlideoverOpen}
        onClose={() => setIsSlideoverOpen(false)}
        title={currentMedia ? 'Edit Media Metadata' : 'Add New Media'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">URL / Source</label>
              <input
                type="text"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-champagne-gold/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Event</label>
              <select
                value={formData.eventId}
                onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-champagne-gold/20"
                required
              >
                <option value="">Select an event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>{event.title}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-champagne-gold/20"
                >
                  <option value="PHOTO">Photo</option>
                  <option value="VIDEO">Video</option>
                  <option value="DOCUMENT">Document</option>
                  <option value="POSTER">Poster</option>
                  <option value="MEME">Meme</option>
                  <option value="SCREENSHOT">Screenshot</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-champagne-gold/20"
                >
                  <option value="gallery">Gallery</option>
                  <option value="people">People</option>
                  <option value="events">Events</option>
                  <option value="documents">Documents</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Title (Optional)</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-champagne-gold/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description (Optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-champagne-gold/20 h-24 resize-none"
              />
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.featured ? 'bg-heritage-navy border-heritage-navy' : 'bg-white border-parchment-dark group-hover:border-champagne-gold'}`}>
                  {formData.featured && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                </div>
                <span className="text-sm font-medium">Feature in highlights</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.isHiddenGem ? 'bg-burnt-sienna border-burnt-sienna' : 'bg-white border-parchment-dark group-hover:border-champagne-gold'}`}>
                  {formData.isHiddenGem && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={formData.isHiddenGem}
                    onChange={(e) => setFormData({ ...formData, isHiddenGem: e.target.checked })}
                  />
                </div>
                <span className="text-sm font-medium">Mark as &quot;Hidden Gem&quot;</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsSlideoverOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : currentMedia ? 'Save Changes' : 'Add Asset'}
            </Button>
          </div>
        </form>
      </Slideover>

      {/* Bulk Uploader Slideover */}
      <Slideover
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        title="Bulk Media Ingestion"
      >
        <MediaUploader
          onUploadComplete={() => {
            setIsUploaderOpen(false);
            fetchData();
          }}
        />
      </Slideover>
    </div>
  );
}

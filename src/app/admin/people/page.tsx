'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  User,
  Search,
  Filter,
  Loader2,
  Edit2,
  GraduationCap,
  Quote,
  Calendar,
  Layers,
  Star,
  ArrowUpDown,
  Trash2
} from 'lucide-react';
import { Slideover } from '@/components/admin/ui/Slideover';
import { SingleImageUploader } from '@/components/admin/SingleImageUploader';
import Image from 'next/image';

interface Person {
  id: string;
  name: string;
  slug: string;
  nickname?: string;
  major?: string;
  graduationYear?: number;
  yearbookQuote?: string;
  image?: string;
  featured: boolean;
  displayOrder: number;
  batchId: string;
  batch?: { name: string };
  _count: {
    events: number;
    taggedMedia: number;
  };
}

interface Batch {
  id: string;
  name: string;
}

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSlideoverOpen, setIsSlideoverOpen] = useState(false);
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    nickname: '',
    major: '',
    graduationYear: new Date().getFullYear().toString(),
    yearbookQuote: '',
    batchId: '',
    image: '',
    featured: false,
    displayOrder: '0',
    eventIds: [] as string[]
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [peopleRes, batchesRes] = await Promise.all([
        fetch('/api/admin/people'),
        fetch('/api/admin/batches')
      ]);
      const peopleData = await peopleRes.json();
      const batchesData = await batchesRes.json();

      if (Array.isArray(peopleData)) setPeople(peopleData);
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

    const url = currentPerson
      ? `/api/admin/people/${currentPerson.id}`
      : '/api/admin/people';

    const method = currentPerson ? 'PATCH' : 'POST';

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
      console.error('Error saving person:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentPerson || !confirm('Are you sure you want to delete this profile? This action cannot be undone.')) return;

    try {
      const res = await fetch(`/api/admin/people/${currentPerson.id}`, { method: 'DELETE' });
      if (res.ok) {
        setIsSlideoverOpen(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting person:', error);
    }
  };

  const openCreate = () => {
    setCurrentPerson(null);
    setFormData({
      name: '',
      slug: '',
      nickname: '',
      major: '',
      graduationYear: new Date().getFullYear().toString(),
      yearbookQuote: '',
      batchId: batches[0]?.id || '',
      image: '',
      featured: false,
      displayOrder: '0',
      eventIds: []
    });
    setIsSlideoverOpen(true);
  };

  const openEdit = (person: Person) => {
    setCurrentPerson(person);
    setFormData({
      name: person.name,
      slug: person.slug,
      nickname: person.nickname || '',
      major: person.major || '',
      graduationYear: person.graduationYear?.toString() || '',
      yearbookQuote: person.yearbookQuote || '',
      batchId: person.batchId,
      image: person.image || '',
      featured: person.featured,
      displayOrder: person.displayOrder.toString(),
      eventIds: []
    });
    setIsSlideoverOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-4xl text-[#1A2B48] mb-2">People</h1>
          <p className="text-[#333333]/60">Manage profiles of seniors and their legacy.</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#1A2B48] text-[#FDFCF8] px-6 py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-[#1A2B48]/90 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Person</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#333333]/30" />
          <input
            type="text"
            placeholder="Search by name, major, or batch..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-[#D4AF37]/20 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-[#333333]/40">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="font-serif italic text-lg">Gathering the alumni...</p>
        </div>
      ) : people.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-[#D4AF37]/20 rounded-2xl p-16 text-center">
          <User className="w-16 h-16 text-[#D4AF37]/20 mx-auto mb-4" />
          <h3 className="text-xl font-playfair text-[#1A2B48] mb-2">No people found</h3>
          <p className="text-[#333333]/40 mb-8">Start adding the faces of this generation.</p>
          <button
            onClick={openCreate}
            className="text-[#1A2B48] font-medium border-b-2 border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
          >
            Create first profile
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {people.map((person) => (
            <div
              key={person.id}
              className="bg-white p-6 rounded-2xl border border-[#D4AF37]/20 shadow-sm hover:shadow-md transition-all flex items-start space-x-4 group"
            >
              <div className="w-16 h-16 rounded-full bg-[#1A2B48]/5 flex items-center justify-center flex-shrink-0 border border-[#D4AF37]/10 overflow-hidden">
                {person.image ? (
                  <Image src={person.image} alt={person.name} width={64} height={64} className="object-cover w-full h-full" />
                ) : (
                  <User className="w-8 h-8 text-[#1A2B48]/20" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-playfair text-xl text-[#1A2B48]">{person.name}</h3>
                      {person.featured && <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />}
                    </div>
                    <p className="text-xs text-[#333333]/40">{person.major} • {person.batch?.name}</p>
                  </div>
                  <button
                    onClick={() => openEdit(person)}
                    className="p-2 hover:bg-[#FDFCF8] rounded-full text-[#1A2B48]/40 hover:text-[#1A2B48] transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm font-bold text-[#1A2B48]">{person._count.events}</p>
                    <p className="text-[10px] uppercase tracking-widest text-[#333333]/40">Events</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-[#1A2B48]">{person._count.taggedMedia}</p>
                    <p className="text-[10px] uppercase tracking-widest text-[#333333]/40">Tagged</p>
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
        title={currentPerson ? 'Edit Profile' : 'Add Person'}
      >
        <form onSubmit={handleSubmit} className="space-y-6 pb-24">
          <div className="space-y-6">
            <div className="flex flex-col items-center mb-8">
              <label className="block text-sm font-medium text-[#1A2B48] mb-4 font-serif">Profile Photo</label>
              <SingleImageUploader
                currentImageUrl={formData.image}
                category="people"
                onUploadComplete={(url) => setFormData({ ...formData, image: url })}
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

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1A2B48]/40 mb-2">Display Order</label>
                <div className="flex items-center space-x-2 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded px-3 py-2">
                   <ArrowUpDown className="w-4 h-4 text-[#D4AF37]" />
                   <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    className="bg-transparent w-full outline-none font-serif text-lg"
                  />
                </div>
              </div>
            </div>

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
              <label className="block text-sm font-medium text-[#1A2B48] mb-2 font-serif">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded focus:ring-2 focus:ring-[#D4AF37] outline-none font-serif"
                placeholder="e.g. John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A2B48] mb-2 font-serif">Slug (URL friendly)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-3 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded focus:ring-2 focus:ring-[#D4AF37] outline-none font-mono text-sm"
                placeholder="john-doe"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1A2B48] mb-2 font-serif">Nickname</label>
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded focus:ring-2 focus:ring-[#D4AF37] outline-none font-serif"
                  placeholder="Johnny"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A2B48] mb-2 font-serif">Grad Year</label>
                <input
                  type="number"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded focus:ring-2 focus:ring-[#D4AF37] outline-none font-serif"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A2B48] mb-2 font-serif">Major / Branch</label>
              <input
                type="text"
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                className="w-full px-4 py-3 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded focus:ring-2 focus:ring-[#D4AF37] outline-none font-serif"
                placeholder="Computer Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A2B48] mb-2 font-serif flex items-center">
                <Quote className="w-4 h-4 mr-2" /> Yearbook Quote
              </label>
              <textarea
                value={formData.yearbookQuote}
                onChange={(e) => setFormData({ ...formData, yearbookQuote: e.target.value })}
                className="w-full px-4 py-3 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded focus:ring-2 focus:ring-[#D4AF37] outline-none font-serif italic"
                placeholder="Something to be remembered by..."
                rows={3}
              />
            </div>

            {currentPerson && (
              <button
                type="button"
                onClick={handleDelete}
                className="w-full flex items-center justify-center space-x-2 text-red-500 text-sm font-medium pt-8 hover:text-red-600 transition-colors border-t border-[#D4AF37]/10"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Profile Forever</span>
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
              <span>{currentPerson ? 'Save Changes' : 'Add Person'}</span>
            </button>
          </div>
        </form>
      </Slideover>
    </div>
  );
}

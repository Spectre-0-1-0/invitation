'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Archive, Trash2, Layers, Loader2 } from 'lucide-react';
import { Slideover } from '@/components/admin/ui/Slideover';

interface Batch {
  id: string;
  name: string;
  isArchived: boolean;
  _count: {
    events: number;
    people: number;
  };
}

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSlideoverOpen, setIsSlideoverOpen] = useState(false);
  const [currentBatch, setCurrentBatch] = useState<Batch | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBatches = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/batches');
      const data = await res.json();
      if (Array.isArray(data)) setBatches(data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const url = currentBatch
      ? `/api/admin/batches/${currentBatch.id}`
      : '/api/admin/batches';

    const method = currentBatch ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsSlideoverOpen(false);
        fetchBatches();
      }
    } catch (error) {
      console.error('Error saving batch:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchive = async (batch: Batch) => {
    try {
      const res = await fetch(`/api/admin/batches/${batch.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isArchived: !batch.isArchived }),
      });
      if (res.ok) fetchBatches();
    } catch (error) {
      console.error('Error archiving batch:', error);
    }
  };

  const openCreate = () => {
    setCurrentBatch(null);
    setFormData({ name: '' });
    setIsSlideoverOpen(true);
  };

  const openEdit = (batch: Batch) => {
    setCurrentBatch(batch);
    setFormData({ name: batch.name });
    setIsSlideoverOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-playfair text-4xl text-[#1A2B48] mb-2">Batches</h1>
          <p className="text-[#333333]/60">Organize memories by graduating years or groups.</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#1A2B48] text-[#FDFCF8] px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-[#1A2B48]/90 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>New Batch</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-[#333333]/40">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="font-serif italic text-lg">Unrolling the parchment...</p>
        </div>
      ) : batches.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-[#D4AF37]/20 rounded-2xl p-16 text-center">
          <Layers className="w-16 h-16 text-[#D4AF37]/20 mx-auto mb-4" />
          <h3 className="text-xl font-playfair text-[#1A2B48] mb-2">No batches yet</h3>
          <p className="text-[#333333]/40 mb-8">Start by creating your first batch, like &quot;Class of 2025&quot;.</p>
          <button
            onClick={openCreate}
            className="text-[#1A2B48] font-medium border-b-2 border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
          >
            Create your first batch
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className={`bg-white p-6 rounded-xl border border-[#D4AF37]/20 shadow-sm relative overflow-hidden group ${batch.isArchived ? 'opacity-60 grayscale' : ''}`}
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-playfair text-2xl text-[#1A2B48]">{batch.name}</h3>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => openEdit(batch)}
                      className="p-2 hover:bg-[#FDFCF8] rounded-full text-[#1A2B48]/60 hover:text-[#1A2B48] transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleArchive(batch)}
                      className="p-2 hover:bg-[#FDFCF8] rounded-full text-[#1A2B48]/60 hover:text-[#D4AF37] transition-colors"
                      title={batch.isArchived ? 'Unarchive' : 'Archive'}
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-[#FDFCF8] p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-[#1A2B48]">{batch._count.events}</p>
                    <p className="text-[10px] uppercase tracking-widest text-[#333333]/40">Events</p>
                  </div>
                  <div className="bg-[#FDFCF8] p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-[#1A2B48]">{batch._count.people}</p>
                    <p className="text-[10px] uppercase tracking-widest text-[#333333]/40">People</p>
                  </div>
                </div>
              </div>

              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-[#D4AF37]/5 -mr-4 -mt-4 rotate-45 group-hover:bg-[#D4AF37]/10 transition-colors" />
            </div>
          ))}
        </div>
      )}

      <Slideover
        isOpen={isSlideoverOpen}
        onClose={() => setIsSlideoverOpen(false)}
        title={currentBatch ? 'Edit Batch' : 'Create Batch'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#1A2B48] mb-2 font-serif">
              Batch Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded focus:ring-2 focus:ring-[#D4AF37] outline-none font-serif"
              placeholder="e.g. Class of 2025"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1A2B48] text-[#FDFCF8] py-4 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-[#1A2B48]/90 transition-all shadow-lg disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
            <span>{currentBatch ? 'Save Changes' : 'Create Batch'}</span>
          </button>
        </form>
      </Slideover>
    </div>
  );
}

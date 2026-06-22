'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface SingleImageUploaderProps {
  currentImageUrl?: string;
  onUploadComplete: (url: string) => void;
  category: 'people' | 'events' | 'gallery';
  eventId?: string;
}

export function SingleImageUploader({
  currentImageUrl,
  onUploadComplete,
  category,
  eventId
}: SingleImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      if (eventId) formData.append('eventId', eventId);

      const res = await fetch('/api/admin/media/upload/file', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      onUploadComplete(data.url);
      setPreviewUrl(data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
      setPreviewUrl(currentImageUrl);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="relative aspect-square w-32 rounded-xl border-2 border-dashed border-[#D4AF37]/20 bg-[#FDFCF8] overflow-hidden flex items-center justify-center cursor-pointer group"
        onClick={() => fileInputRef.current?.click()}
      >
        {previewUrl ? (
          <>
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="w-6 h-6 text-[#1A2B48]" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-[#1A2B48]/30">
            <ImageIcon className="w-8 h-8 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Upload</span>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#D4AF37]" />
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      {previewUrl && !isUploading && (
        <button
          type="button"
          onClick={() => {
            setPreviewUrl(undefined);
            onUploadComplete('');
          }}
          className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors flex items-center"
        >
          <X className="w-3 h-3 mr-1" /> Remove Image
        </button>
      )}
    </div>
  );
}

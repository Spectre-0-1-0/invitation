'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, ImageIcon, FileIcon } from 'lucide-react';

interface SimpleMediaUploadProps {
  eventId: string;
  onUploadComplete: () => void;
  category?: 'gallery' | 'events' | 'documents' | 'memes';
}

export function SimpleMediaUpload({
  eventId,
  onUploadComplete,
  category = 'gallery'
}: SimpleMediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);
        formData.append('eventId', eventId);

        const res = await fetch('/api/admin/media/upload/file', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error(`Upload failed for ${file.name}`);
      }

      onUploadComplete();
    } catch (error) {
      console.error('Upload error:', error);
      alert('One or more uploads failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-[#D4AF37]/20 rounded-2xl p-8 text-center bg-[#FDFCF8] hover:border-[#D4AF37]/40 transition-all cursor-pointer"
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept="image/*,video/mp4,application/pdf"
        />

        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin mb-2" />
            <p className="text-sm font-medium text-[#1A2B48]">Uploading memories...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="w-10 h-10 text-[#D4AF37]/40 mb-2" />
            <h3 className="text-sm font-bold text-[#1A2B48] uppercase tracking-widest mb-1">Add Media</h3>
            <p className="text-xs text-[#333333]/40 italic">Images, Videos, or PDFs</p>
          </div>
        )}
      </div>
    </div>
  );
}

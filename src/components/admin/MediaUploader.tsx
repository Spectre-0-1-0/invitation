'use client';

import React, { useState, useCallback } from 'react';
import { Upload, X, Loader2, FileIcon, FolderIcon, ArchiveIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface MediaUploaderProps {
  eventId?: string;
  onUploadComplete?: () => void;
}

interface UploadJob {
  id: string;
  fileName: string;
  size: number;
  progress: number;
  status: 'queued' | 'uploading' | 'processing' | 'completed' | 'failed';
  error?: string;
}

export function MediaUploader({ eventId, onUploadComplete }: MediaUploaderProps) {
  const [jobs, setJobs] = useState<Record<string, UploadJob>>({});
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!eventId) {
      alert("Please select an event first.");
      return;
    }

    setIsPanelOpen(true);

    // 1. Create a batch/upload record
    const uploadRes = await fetch('/api/admin/media/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId,
        totalFiles: acceptedFiles.length,
      })
    });

    const { uploadId } = await uploadRes.json();

    // 2. Process each file
    for (const file of acceptedFiles) {
      const jobId = Math.random().toString(36).substring(7);

      setJobs(prev => ({
        ...prev,
        [jobId]: {
          id: jobId,
          fileName: file.name,
          size: file.size,
          progress: 0,
          status: 'uploading'
        }
      }));

      try {
        const isZip = file.name.endsWith('.zip');

        // Upload to Supabase Storage via our API
        const formData = new FormData();
        formData.append('file', file);
        formData.append('eventId', eventId);
        formData.append('uploadId', uploadId);
        formData.append('isZip', isZip.toString());

        const response = await fetch('/api/admin/media/upload/file', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        setJobs(prev => ({
          ...prev,
          [jobId]: { ...prev[jobId], status: 'processing', progress: 100 }
        }));

      } catch (err: any) {
        setJobs(prev => ({
          ...prev,
          [jobId]: { ...prev[jobId], status: 'failed', error: err.message }
        }));
      }
    }

    onUploadComplete?.();
  }, [eventId, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: false,
    noKeyboard: false
  });

  const jobList = Object.values(jobs).reverse();
  const activeJobs = jobList.filter(j => j.status === 'uploading' || j.status === 'processing').length;
  const completedJobs = jobList.filter(j => j.status === 'completed' || j.status === 'processing').length;

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
          isDragActive ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-[#D4AF37]/20 bg-[#FDFCF8] hover:border-[#D4AF37]/40'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <Upload className="w-12 h-12 text-[#D4AF37]/40 mb-4" />
          <h3 className="text-lg font-playfair text-[#1A2B48] mb-1">
            {isDragActive ? "Drop them here!" : "Drag & Drop Memories"}
          </h3>
          <p className="text-[#333333]/40 text-sm">
            Photos, Videos, Folders or ZIP archives
          </p>
        </div>
      </div>

      {/* Activity Panel */}
      {isPanelOpen && (
        <div className="bg-white border border-[#D4AF37]/20 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-[#FDFCF8] px-4 py-3 border-b border-[#D4AF37]/10 flex justify-between items-center">
            <h4 className="text-sm font-bold uppercase tracking-widest text-[#1A2B48]">
              Upload Activity {activeJobs > 0 && `(${activeJobs} active)`}
            </h4>
            <button onClick={() => setIsPanelOpen(false)} className="text-[#1A2B48]/40 hover:text-[#1A2B48]">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {jobList.length === 0 ? (
              <div className="p-8 text-center text-[#333333]/40 italic text-sm">
                No recent activity
              </div>
            ) : (
              <div className="divide-y divide-[#D4AF37]/5">
                {jobList.map(job => (
                  <div key={job.id} className="px-4 py-3 flex items-center space-x-3">
                    {job.fileName.endsWith('.zip') ? (
                      <ArchiveIcon className="w-5 h-5 text-[#D4AF37]" />
                    ) : (
                      <FileIcon className="w-5 h-5 text-[#1A2B48]/40" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs font-medium text-[#1A2B48] truncate">{job.fileName}</p>
                        <span className="text-[10px] text-[#333333]/40 uppercase tracking-tighter">
                          {job.status}
                        </span>
                      </div>
                      <div className="w-full bg-[#1A2B48]/5 h-1 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            job.status === 'failed' ? 'bg-red-500' :
                            job.status === 'completed' || job.status === 'processing' ? 'bg-green-500' :
                            'bg-[#D4AF37]'
                          }`}
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      {job.status === 'uploading' || job.status === 'processing' ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                      ) : job.status === 'failed' ? (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

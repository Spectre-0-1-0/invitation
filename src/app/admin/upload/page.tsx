'use client'

import { useState, useEffect } from 'react'
import { Container } from "@/components/layout/Container"
import { Section } from "@/components/layout/Section"
import { Heading } from "@/components/ui/Heading"
import { Badge } from "@/components/ui/Badge"
import { Upload, File, Archive, Folder, CheckCircle, Loader2, AlertCircle } from 'lucide-react'

export default function UploadDashboard() {
  const [events, setEvents] = useState<any[]>([])
  const [selectedEventId, setSelectedEventId] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data)
        if (data.length > 0) setSelectedEventId(data[0].id)
      })
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleUpload = async () => {
    if (!selectedEventId || files.length === 0) return

    setIsUploading(true)
    setUploadStatus('idle')
    setProgress(0)

    const formData = new FormData()
    formData.append('eventId', selectedEventId)

    const isZIP = files.length === 1 && files[0].name.endsWith('.zip')

    if (isZIP) {
      formData.append('file', files[0])
      try {
        const res = await fetch('/api/upload/zip', {
          method: 'POST',
          body: formData
        })
        if (res.ok) setUploadStatus('success')
        else setUploadStatus('error')
      } catch (err) {
        setUploadStatus('error')
      }
    } else {
      files.forEach(file => formData.append('files', file))
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        if (res.ok) setUploadStatus('success')
        else setUploadStatus('error')
      } catch (err) {
        setUploadStatus('error')
      }
    }

    setIsUploading(false)
  }

  return (
    <Section className="pt-24 min-h-screen bg-parchment-base">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <Heading level={1} className="text-4xl mb-4">Upload <span className="italic">Memories</span></Heading>
            <p className="text-charcoal-muted font-serif italic text-lg">
              Add new photos, videos, and documents to your batch events.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-1 space-y-8">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-champagne-gold mb-3 font-bold">
                  Select Event
                </label>
                <select
                  className="w-full bg-white border border-parchment-dark/30 rounded-md p-3 text-sm font-serif"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                >
                  {events.map(event => (
                    <option key={event.id} value={event.id}>{event.title}</option>
                  ))}
                </select>
              </div>

              <div className="p-6 bg-white border border-parchment-dark/20 rounded-md shadow-sm">
                <h3 className="text-sm font-bold text-heritage-navy mb-4 flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" /> Upload Tips
                </h3>
                <ul className="text-xs text-charcoal-muted space-y-3 leading-relaxed">
                  <li>• Upload ZIPs for bulk batch ingestion.</li>
                  <li>• Folders are preserved during upload.</li>
                  <li>• High resolution photos preferred.</li>
                  <li>• All media is auto-categorized.</li>
                </ul>
              </div>
            </div>

            <div className="md:col-span-2">
              <div
                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                  files.length > 0 ? 'border-champagne-gold bg-white' : 'border-parchment-dark/30 bg-parchment-muted/30'
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  if (e.dataTransfer.files) setFiles(Array.from(e.dataTransfer.files))
                }}
              >
                <input
                  type="file"
                  multiple
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />

                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center text-heritage-navy mb-6">
                    <Upload size={32} />
                  </div>
                  <Heading level={3} className="text-xl mb-2">
                    {files.length > 0 ? `${files.length} files selected` : 'Drag & Drop Memories'}
                  </Heading>
                  <p className="text-sm text-charcoal-muted mb-8">
                    or click to browse from your device
                  </p>

                  <div className="flex gap-4">
                    <Badge variant="outline" className="flex items-center gap-1.5 py-1 px-3">
                      <Folder size={12} /> Folder
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1.5 py-1 px-3">
                      <Archive size={12} /> ZIP
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1.5 py-1 px-3">
                      <File size={12} /> Files
                    </Badge>
                  </div>
                </div>
              </div>

              {files.length > 0 && (
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-widest text-charcoal-muted">
                      Ready to Ingest
                    </span>
                    <button
                      onClick={() => setFiles([])}
                      className="text-[10px] font-bold uppercase tracking-widest text-red-600 hover:opacity-70"
                    >
                      Clear Selection
                    </button>
                  </div>

                  <div className="max-h-48 overflow-y-auto bg-white border border-parchment-dark/20 rounded-md">
                    {files.slice(0, 10).map((file, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 border-b border-parchment-base last:border-0">
                        <div className="text-heritage-navy opacity-40"><File size={14} /></div>
                        <span className="text-xs text-charcoal truncate flex-1">{file.name}</span>
                        <span className="text-[10px] text-charcoal-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    ))}
                    {files.length > 10 && (
                      <div className="p-3 text-center text-[10px] text-charcoal-muted italic">
                        + {files.length - 10} more files
                      </div>
                    )}
                  </div>

                  <button
                    disabled={isUploading}
                    onClick={handleUpload}
                    className="w-full bg-heritage-navy text-white font-bold uppercase tracking-[0.2em] py-4 rounded-md shadow-xl hover:bg-heritage-navy/90 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isUploading ? (
                      <><Loader2 className="animate-spin" size={18} /> Processing...</>
                    ) : (
                      'Start Ingestion'
                    )}
                  </button>

                  {uploadStatus === 'success' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-3 text-green-800">
                      <CheckCircle size={18} />
                      <span className="text-sm font-bold uppercase tracking-widest">Upload Successful! Processing in background.</span>
                    </div>
                  )}

                  {uploadStatus === 'error' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-3 text-red-800">
                      <AlertCircle size={18} />
                      <span className="text-sm font-bold uppercase tracking-widest">Upload Failed. Please try again.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

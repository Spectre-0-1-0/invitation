'use client'

import { useState, useEffect, useCallback } from 'react'
import { Container } from "@/components/layout/Container"
import { Section } from "@/components/layout/Section"
import { Heading } from "@/components/ui/Heading"
import { Badge } from "@/components/ui/Badge"
import { Upload, File, Archive, Folder, CheckCircle, Loader2, AlertCircle, Clock } from 'lucide-react'
import Link from 'next/link'

export default function UploadDashboard() {
  const [events, setEvents] = useState<any[]>([])
  const [selectedEventId, setSelectedEventId] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [uploadHistory, setUploadHistory] = useState<any[]>([])

  const fetchData = useCallback(async () => {
    const [eventsRes, mediaRes] = await Promise.all([
      fetch('/api/events'),
      fetch('/api/media/tracking?limit=5')
    ])
    const eventsData = await eventsRes.json()
    setEvents(eventsData)
    setUploadHistory(await mediaRes.json())
    if (eventsData.length > 0 && !selectedEventId) setSelectedEventId(eventsData[0].id)
  }, [selectedEventId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleUpload = async () => {
    if (!selectedEventId || files.length === 0) return

    setIsUploading(true)
    setUploadStatus('idle')

    const formData = new FormData()
    formData.append('eventId', selectedEventId)

    const isZIP = files.length === 1 && files[0].name.endsWith('.zip')

    try {
      let res;
      if (isZIP) {
        formData.append('file', files[0])
        res = await fetch('/api/upload/zip', { method: 'POST', body: formData })
      } else {
        files.forEach(file => formData.append('files', file))
        res = await fetch('/api/upload', { method: 'POST', body: formData })
      }

      if (res.ok) {
        setUploadStatus('success')
        setFiles([])
        fetchData()
      } else {
        setUploadStatus('error')
      }
    } catch (err) {
      setUploadStatus('error')
    }

    setIsUploading(false)
  }

  return (
    <Section>
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <Heading level={1} className="text-4xl mb-4">Ingestion <span className="italic">Pipeline</span></Heading>
            <p className="text-charcoal-muted font-serif italic text-lg">
              Upload photos, videos, and archives to your events.
            </p>
          </div>
          <Link href="/admin/tracking" className="bg-white border border-parchment-dark/30 text-heritage-navy font-bold uppercase tracking-widest py-3 px-6 rounded-md text-xs hover:bg-parchment-muted transition-all flex items-center gap-2">
            <Clock size={16} /> History & Status
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-xl border border-parchment-dark/30 shadow-sm">
              <div className="mb-8">
                <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-champagne-gold mb-3 block font-bold">
                  Step 1: Select Target Event
                </label>
                <select
                  className="w-full bg-parchment-muted/30 border border-parchment-dark/30 rounded-md p-4 text-sm font-serif outline-none focus:border-champagne-gold transition-all"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                >
                  {events.map(event => (
                    <option key={event.id} value={event.id}>{event.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-champagne-gold mb-3 block font-bold">
                  Step 2: Add Memories
                </label>
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
                  <input type="file" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-heritage-navy mb-6">
                      <Upload size={24} />
                    </div>
                    <Heading level={3} className="text-xl mb-2">{files.length > 0 ? `${files.length} items ready` : 'Drag & Drop Memories'}</Heading>
                    <p className="text-xs text-charcoal-muted uppercase tracking-widest mb-6">or click to browse archives</p>
                    <div className="flex gap-4">
                      <Badge variant="outline" className="text-[9px] uppercase tracking-tighter"><Folder size={10} className="mr-1" /> Folders</Badge>
                      <Badge variant="outline" className="text-[9px] uppercase tracking-tighter"><Archive size={10} className="mr-1" /> ZIPs</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {files.length > 0 && (
                <div className="mt-8 space-y-6">
                  <div className="max-h-48 overflow-y-auto bg-parchment-muted/20 rounded-md border border-parchment-base">
                    {files.slice(0, 10).map((file, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 border-b border-parchment-base last:border-0">
                        <File size={12} className="text-charcoal-muted" />
                        <span className="text-xs text-charcoal truncate flex-1">{file.name}</span>
                        <span className="text-[10px] font-mono text-charcoal-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    ))}
                    {files.length > 10 && <div className="p-3 text-center text-[10px] text-charcoal-muted italic">+ {files.length - 10} more items</div>}
                  </div>

                  <button
                    disabled={isUploading}
                    onClick={handleUpload}
                    className="w-full bg-heritage-navy text-white font-bold uppercase tracking-[0.2em] py-4 rounded-md shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isUploading ? <><Loader2 className="animate-spin" size={18} /> Processing Ingestion...</> : 'Start Upload'}
                  </button>
                </div>
              )}

              {uploadStatus === 'success' && (
                <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-md flex items-center gap-3 text-green-700">
                  <CheckCircle size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Ingestion started! Follow progress in the history tab.</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
             <div className="bg-white p-8 rounded-xl border border-parchment-dark/30 shadow-sm">
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-heritage-navy mb-6 font-bold flex items-center gap-2">
                   <Clock size={14} /> Recent Uploads
                </h3>
                <div className="space-y-4">
                   {uploadHistory.slice(0, 5).map((m) => (
                     <div key={m.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-parchment-muted flex-shrink-0 flex items-center justify-center text-[8px] font-bold">
                           {m.type[0]}
                        </div>
                        <div className="min-w-0">
                           <span className="block text-[10px] font-bold text-heritage-navy truncate">{m.title}</span>
                           <span className="block text-[8px] text-charcoal-muted uppercase tracking-tighter truncate">{m.event?.title}</span>
                        </div>
                     </div>
                   ))}
                </div>
                <Link href="/admin/tracking" className="block mt-8 text-center text-[9px] font-bold uppercase tracking-widest text-champagne-gold hover:underline">
                   View Full History
                </Link>
             </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

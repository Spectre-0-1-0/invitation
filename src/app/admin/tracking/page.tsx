'use client'

import { useState, useEffect } from 'react'
import { Container } from "@/components/layout/Container"
import { Section } from "@/components/layout/Section"
import { Heading } from "@/components/ui/Heading"
import { Badge } from "@/components/ui/Badge"
import { Loader2, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react'
import Image from 'next/image'

export default function TrackingDashboard() {
  const [media, setMedia] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchMedia = async () => {
    setIsLoading(true)
    const res = await fetch('/api/media/tracking')
    const data = await res.json()
    setMedia(data)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchMedia()
    const interval = setInterval(fetchMedia, 10000) // Poll every 10s
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle size={16} className="text-green-600" />
      case 'PROCESSING': return <Loader2 size={16} className="text-blue-600 animate-spin" />
      case 'PENDING': return <Clock size={16} className="text-amber-600" />
      case 'FAILED': return <AlertCircle size={16} className="text-red-600" />
      default: return null
    }
  }

  return (
    <Section className="pt-24 min-h-screen bg-parchment-base">
      <Container>
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <Heading level={1} className="text-4xl mb-4">Ingestion <span className="italic">Status</span></Heading>
              <p className="text-charcoal-muted font-serif italic text-lg">
                Track your memory uploads as they move through the processing pipeline.
              </p>
            </div>
            <button
              onClick={fetchMedia}
              className="p-3 bg-white border border-parchment-dark/30 rounded-full hover:bg-parchment-muted transition-colors shadow-sm"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="bg-white border border-parchment-dark/20 rounded-xl overflow-hidden shadow-scrapbook">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-parchment-muted/50 border-b border-parchment-dark/20">
                    <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-[0.2em] text-charcoal-muted">Media</th>
                    <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-[0.2em] text-charcoal-muted">Event</th>
                    <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-[0.2em] text-charcoal-muted">Type</th>
                    <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-[0.2em] text-charcoal-muted">Status</th>
                    <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-[0.2em] text-charcoal-muted">Uploaded</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-parchment-base">
                  {media.map((m) => (
                    <tr key={m.id} className="hover:bg-parchment-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-parchment-muted flex-shrink-0 overflow-hidden relative">
                            {m.thumbnailUrl ? (
                              <Image
                                src={m.thumbnailUrl}
                                alt=""
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-charcoal-muted/20 text-[10px]">
                                {m.type[0]}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-heritage-navy truncate max-w-[200px]">{m.title}</span>
                            <span className="text-[10px] text-charcoal-muted font-mono">{m.folderPath || '/'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-charcoal font-serif">{m.event?.title}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="text-[9px] uppercase tracking-tighter py-0 px-2">{m.type}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(m.processingStatus)}
                          <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal">{m.processingStatus}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-mono text-charcoal-muted">{new Date(m.createdAt).toLocaleString()}</span>
                      </td>
                    </tr>
                  ))}
                  {media.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-charcoal-muted italic font-serif">
                        No media has been uploaded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

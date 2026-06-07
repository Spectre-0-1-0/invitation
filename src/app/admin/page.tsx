import { Container } from "@/components/layout/Container"
import { Section } from "@/components/layout/Section"
import { Heading } from "@/components/ui/Heading"
import { prisma } from "@/lib/prisma/client"
import { Calendar, Users, Image as ImageIcon, Video, UploadCloud } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  // Fetch real statistics
  const [eventCount, personCount, mediaCount, videoCount, photoCount] = await Promise.all([
    prisma.event.count(),
    prisma.person.count(),
    prisma.media.count(),
    prisma.media.count({ where: { type: 'VIDEO' } }),
    prisma.media.count({ where: { type: 'PHOTO' } }),
  ])

  const stats = [
    { label: 'Total Events', value: eventCount, icon: Calendar, color: 'text-blue-600' },
    { label: 'Total People', value: personCount, icon: Users, color: 'text-green-600' },
    { label: 'Total Photos', value: photoCount, icon: ImageIcon, color: 'text-amber-600' },
    { label: 'Total Videos', value: videoCount, icon: Video, color: 'text-red-600' },
  ]

  const recentMedia = await prisma.media.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { event: { select: { title: true } } }
  })

  return (
    <Section>
      <Container>
        <div className="mb-12">
          <Heading level={1} className="text-4xl mb-4">Organizer <span className="italic">Workspace</span></Heading>
          <p className="text-charcoal-muted font-serif italic text-lg">
            A bird&apos;s eye view of the Class Archive progress.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-xl border border-parchment-dark/30 shadow-sm flex items-center gap-4">
              <div className={`p-3 bg-parchment-muted rounded-lg ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-widest text-charcoal-muted mb-1">{stat.label}</span>
                <span className="block text-2xl font-bold text-heritage-navy">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl border border-parchment-dark/30 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-parchment-base flex justify-between items-center">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-heritage-navy">Recent Ingestion</h2>
                <Link href="/admin/tracking" className="text-[10px] font-bold uppercase tracking-widest text-champagne-gold hover:underline">View All</Link>
              </div>
              <div className="divide-y divide-parchment-base">
                {recentMedia.map((m) => (
                  <div key={m.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-parchment-muted flex-shrink-0 flex items-center justify-center text-charcoal-muted">
                        {m.type === 'PHOTO' ? <ImageIcon size={18} /> : <Video size={18} />}
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-heritage-navy">{m.title}</span>
                        <span className="block text-[10px] text-charcoal-muted uppercase tracking-tighter">{m.event?.title}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-charcoal-muted">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-heritage-navy p-8 rounded-xl text-white shadow-xl">
              <UploadCloud size={48} className="mb-6 opacity-40" />
              <h3 className="text-xl font-serif mb-4">Start Uploading</h3>
              <p className="text-white/60 text-sm mb-8 leading-relaxed">
                Ready to add more memories? Select an event and start the ingestion pipeline.
              </p>
              <Link
                href="/admin/upload"
                className="block w-full bg-champagne-gold text-heritage-navy text-center font-bold uppercase tracking-widest py-3 rounded-md text-xs hover:bg-white transition-colors"
              >
                Go to Upload Dashboard
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

import { getEventBySlug } from "@/lib/data-fetcher"
import { notFound } from "next/navigation"
import { ScrapbookSection } from "@/components/scrapbook/ScrapbookSection"
import { Polaroid } from "@/components/scrapbook/Polaroid"
import { HandwrittenNote } from "@/components/scrapbook/HandwrittenNote"
import { JournalBlock } from "@/components/scrapbook/JournalBlock"
import { MemoryCluster } from "@/components/scrapbook/MemoryCluster"
import { Heading } from "@/components/ui/Heading"
import { Badge } from "@/components/ui/Badge"
import { getThemeByMood } from "@/lib/theme/mood"
import { MapPin, Calendar, Users, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export async function generateMetadata({ params }: any) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  return { title: event?.title || "Event Chapter" }
}

export default async function EventChapterPage({ params }: any) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) notFound()

  const theme = getThemeByMood(event.chapterMood)
  const featuredMedia = event.media?.filter(m => m.featured) || []
  const otherMedia = event.media?.filter(m => !m.featured) || []
  const coverMedia = event.media?.find(m => m.id === event.coverMediaId) || event.media?.[0]

  return (
    <div className={`min-h-screen ${theme.bg}`}>
      {/* Event Hero */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {coverMedia && (
          <div className="absolute inset-0 z-0">
            <Image
              src={coverMedia.url}
              alt={event.title}
              fill
              className="object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-1000"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-parchment-base" />
          </div>
        )}

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <Badge variant="outline" className={`mb-6 ${theme.accent} ${theme.border} border-2 px-4 py-1`}>
            {event.eventType || 'Event'} • {event.batch?.name}
          </Badge>
          <Heading level={1} className="text-6xl md:text-9xl mb-8 leading-tight">
            {event.title}
          </Heading>

          <div className="flex flex-wrap justify-center gap-8 text-charcoal-muted font-mono uppercase tracking-[0.2em] text-xs">
            <div className="flex items-center gap-2">
              <Calendar size={14} className={theme.accent} />
              {event.startDate ? new Date(event.startDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'Date TBD'}
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin size={14} className={theme.accent} />
                {event.location}
              </div>
            )}
          </div>

          {event.chapterQuote && (
            <div className="mt-16 relative">
              <span className="font-handwritten text-4xl md:text-5xl text-heritage-navy block">
                &quot;{event.chapterQuote}&quot;
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Chapter Story */}
      <ScrapbookSection className="bg-white/50 backdrop-blur-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7">
            <JournalBlock
              title="The Story"
              content={event.description || "Every memory has a beginning. This event was a significant chapter in our journey together, capturing the essence of our batch's spirit and the bonds we formed along the way."}
            />
          </div>
          <div className="lg:col-span-5 relative">
             <Polaroid
               src={featuredMedia[0]?.url || coverMedia?.url || ''}
               rotation={-2}
               handwrittenCaption="A moment frozen in time"
               className="w-full max-w-sm mx-auto"
             />
             {/* Decorative element */}
             <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-champagne-gold/10 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </ScrapbookSection>

      {/* Memory Clusters */}
      <ScrapbookSection>
        <div className="mb-24 flex justify-between items-end">
          <Heading level={2} className="text-4xl">Featured <span className="italic">Fragments</span></Heading>
          <div className="hidden md:flex gap-4">
             {event.participants?.slice(0, 3).map(p => (
               <div key={p.id} className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden relative grayscale hover:grayscale-0 transition-all">
                  <Image src={p.image || ''} alt={p.name} fill className="object-cover" />
               </div>
             ))}
             {event.participants && event.participants.length > 3 && (
               <div className="w-10 h-10 rounded-full bg-parchment-dark flex items-center justify-center text-[10px] font-bold text-heritage-navy">
                  +{event.participants.length - 3}
               </div>
             )}
          </div>
        </div>

        <MemoryCluster>
          {featuredMedia.slice(1, 4).map((m, i) => (
            <Polaroid
              key={m.id}
              src={m.url}
              type={m.type as any}
              rotation={i % 2 === 0 ? 1 : -2}
              handwrittenCaption={m.handwrittenCaption || undefined}
              caption={m.caption || undefined}
            />
          ))}
        </MemoryCluster>
      </ScrapbookSection>

      {/* Messages */}
      {event.messages && event.messages.length > 0 && (
        <ScrapbookSection className="bg-heritage-navy text-white">
          <div className="text-center mb-24">
            <Heading level={2} className="text-white text-4xl mb-4">Notes from the <span className="italic">Class</span></Heading>
            <p className="text-white/60 font-serif italic">Heartfelt words and inside jokes from those who were there.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {event.messages.map((msg, i) => (
              <HandwrittenNote
                key={msg.id}
                content={msg.content}
                from={msg.fromName}
                relationship={msg.relationship || undefined}
                rotation={i % 2 === 0 ? -1 : 1}
                color={['white', 'yellow', 'blue', 'pink'][i % 4] as any}
                className="text-heritage-navy"
              />
            ))}
          </div>
        </ScrapbookSection>
      )}

      {/* Call to Archive */}
      <ScrapbookSection bgTexture={false} className="bg-parchment-muted/30">
        <div className="max-w-4xl mx-auto text-center">
           <Heading level={2} className="text-3xl mb-8">Want to see every <span className="italic">detail?</span></Heading>
           <p className="text-charcoal-muted mb-12 max-w-xl mx-auto font-serif text-lg">
             Explore the complete collection of {event.media?.length || 0} memories captured during this event.
           </p>
           <Link
            href={`/gallery?eventId=${event.id}`}
            className="inline-flex items-center gap-3 bg-heritage-navy text-white px-12 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
           >
             View Full Event Archive <ArrowRight size={18} />
           </Link>
        </div>
      </ScrapbookSection>
    </div>
  )
}

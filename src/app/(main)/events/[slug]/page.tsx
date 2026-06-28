import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { getEventBySlug } from "@/lib/data-fetcher";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Camera } from "lucide-react";
import EventTracking from "./EventTracking";

export async function generateMetadata({ params }: any) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) return { title: "Event Not Found" };

  return {
    title: event.title,
    description: event.description || event.chapterQuote || `Memories from ${event.title}`,
  };
}

export default async function EventDetailPage({ params }: any) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  const eventMemories = event.media || [];

  return (
    <div className="flex flex-col">
      <EventTracking slug={slug} title={event.title} />
      <Section className="pb-0 pt-20">
        <Container>
          <Link href="/gallery" className="text-xs font-bold uppercase tracking-widest text-charcoal-muted hover:text-heritage-navy transition-colors">
            &larr; Back to Gallery
          </Link>

          <div className="mt-12 text-center max-w-3xl mx-auto mb-20">
            <Badge variant="outline" className="mb-6 uppercase tracking-widest">Event Collection</Badge>
            <Heading level={1} className="text-5xl md:text-7xl mb-8">{event.title}</Heading>
            {(event.description || event.chapterQuote) && (
              <p className="text-xl text-charcoal-muted font-serif italic leading-relaxed">
                &quot;{event.description || event.chapterQuote}&quot;
              </p>
            )}

            <div className="mt-10 flex flex-wrap justify-center gap-8 text-sm font-mono text-charcoal-muted border-t border-parchment-muted pt-8">
               <div className="flex items-center gap-2">
                 <Calendar size={14} className="text-champagne-gold" />
                 <span>{event.date ? new Date(event.date).toLocaleDateString() : 'Class of 2025'}</span>
               </div>
               <div className="flex items-center gap-2">
                 <Camera size={14} className="text-champagne-gold" />
                 <span>{eventMemories.length} Memories</span>
               </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section variant="muted">
        <Container>
          {eventMemories.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
              {eventMemories.map((memory) => (
                <Link key={memory.id} href={`/gallery/${memory.id}`}>
                  <div className="break-inside-avoid bg-white p-3 rounded-md shadow-scrapbook border border-parchment-muted group cursor-pointer hover:rotate-1 transition-all duration-500">
                    <div className="aspect-square bg-parchment-muted overflow-hidden relative rounded-sm">
                       <Image
                         src={memory.url}
                         alt={memory.title || event.title}
                         fill
                         className="object-cover"
                       />
                       <div className="absolute inset-0 bg-heritage-navy/0 group-hover:bg-heritage-navy/10 transition-colors" />
                    </div>
                    <div className="mt-4 px-2 pb-2">
                      <h4 className="font-serif text-lg text-heritage-navy group-hover:text-champagne-gold transition-colors">
                        {memory.title || 'Untitled Memory'}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-charcoal-muted/20 rounded-md">
               <p className="text-charcoal-muted italic">No memories captured for this event yet.</p>
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/animations/FadeIn";
import { getEvents, getMemories } from "@/lib/data-fetcher";
import Link from "next/link";
import { Folder, Image as ImageIcon, Camera } from "lucide-react";
import Image from "next/image";

export const metadata = { title: "Memory Gallery" };

export default async function GalleryPage({ searchParams }: any) {
  const { eventId } = await searchParams;
  const events = await getEvents();
  let memories = await getMemories();

  if (eventId) {
    memories = memories.filter(m => m.eventId === eventId);
  }

  const selectedEvent = events.find(e => e.id === eventId);

  return (
    <Section className="pt-20">
      <Container>
        <div className="flex flex-col items-center text-center mb-24">
          <FadeIn>
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-champagne-gold mb-6 block font-bold">Visual Archive</span>
            <Heading level={1} className="text-5xl md:text-7xl mb-8">
              {selectedEvent ? selectedEvent.title : 'The Gallery'}
            </Heading>
            <p className="text-lg md:text-xl text-charcoal-muted max-w-2xl mx-auto font-serif italic">
               {selectedEvent
                 ? `A complete collection of memories from ${selectedEvent.title}.`
                 : "Every pixel a memory, every photo a story. Explore the albums and candids that captured the spirit of the Class of 2025."
               }
            </p>
          </FadeIn>
        </div>

        <div className="space-y-32">
          {!eventId && (
            <div>
              <FadeIn>
                <h2 className="text-xs font-mono uppercase tracking-[0.4em] text-champagne-gold mb-10 flex items-center gap-3">
                  <Folder size={14} /> Curated Collections
                </h2>
              </FadeIn>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {events.map((event, i) => (
                  <FadeIn key={event.id} delay={i * 0.1}>
                    <Link href={`/events/${event.slug}`} className="group block">
                      <Card variant="scrapbook" className="p-3 bg-white">
                        <div className="relative aspect-[16/10] bg-parchment-muted overflow-hidden">
                           <div className="absolute inset-0 bg-heritage-navy/20 group-hover:bg-heritage-navy/10 transition-colors duration-500" />
                           <div className="absolute inset-0 flex items-center justify-center">
                              <Camera className="text-white/20 group-hover:scale-110 transition-transform duration-500" size={48} />
                           </div>
                        </div>
                        <div className="mt-6 px-2 pb-2">
                          <h3 className="font-serif text-2xl text-heritage-navy group-hover:text-champagne-gold transition-colors">{event.title}</h3>
                          <p className="text-[10px] font-mono uppercase tracking-widest mt-2 text-charcoal-muted">
                             Enter Chapter
                          </p>
                        </div>
                      </Card>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </div>
          )}

          <div>
             <FadeIn>
               <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-parchment-dark pb-6 gap-6">
                  <div>
                    <h2 className="text-xs font-mono uppercase tracking-[0.4em] text-champagne-gold flex items-center gap-3">
                      <ImageIcon size={14} /> {eventId ? 'Event Archive' : 'The Open Archive'}
                    </h2>
                    <p className="text-charcoal-muted text-xs mt-2 italic">A chronological stream of our shared days.</p>
                  </div>
                  <div className="flex gap-4">
                     <Link href="/gallery" className={`text-[10px] font-bold uppercase tracking-widest ${!eventId ? 'text-heritage-navy border-b-2 border-heritage-navy' : 'text-charcoal-muted'} pb-1`}>All</Link>
                  </div>
               </div>
             </FadeIn>

             <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
                {memories.map((memory, i) => (
                  <FadeIn key={memory.id} delay={i * 0.05}>
                    <Card variant="polaroid" className="group cursor-pointer">
                      <div className="aspect-auto bg-parchment-muted overflow-hidden relative min-h-[250px]">
                         <Image src={memory.url} alt={memory.title || ''} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                         <div className="absolute inset-0 bg-heritage-navy/0 group-hover:bg-heritage-navy/5 transition-colors duration-500" />
                      </div>
                      <div className="mt-4 px-1">
                        <div className="flex justify-between items-center mb-2">
                          <Badge variant="outline" className="text-[9px] py-0 border-parchment-dark">{memory.category}</Badge>
                          <span className="text-[9px] font-mono text-charcoal-muted opacity-60">{memory.date?.toLocaleDateString()}</span>
                        </div>
                        <h4 className="font-serif text-base text-heritage-navy group-hover:text-champagne-gold transition-colors leading-tight">
                          {memory.title}
                        </h4>
                      </div>
                    </Card>
                  </FadeIn>
                ))}
             </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

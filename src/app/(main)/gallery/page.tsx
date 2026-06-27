import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { FadeIn } from "@/components/animations/FadeIn";
import { getEvents, getMemories } from "@/lib/data-fetcher";
import GalleryClient from "./GalleryClient";

export const metadata = { title: "Memory Gallery" };

export default async function GalleryPage() {
  const events = await getEvents();
  const memories = await getMemories();

  // Map Events to GalleryAlbums
  const albums = events.map(event => ({
    id: event.slug,
    title: event.title,
    description: event.description || event.chapterQuote || undefined,
    coverImage: event.media?.[0]?.url || '',
    memoryIds: event.media?.map((m: any) => m.id) || []
  }));

  return (
    <Section className="pt-20">
      <Container>
        <div className="flex flex-col items-center text-center mb-24">
          <FadeIn>
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-champagne-gold mb-6 block font-bold">Visual Archive</span>
            <Heading level={1} className="text-5xl md:text-7xl mb-8">The <span className="italic font-light">Gallery</span></Heading>
            <p className="text-lg md:text-xl text-charcoal-muted max-w-2xl mx-auto font-serif italic">
               Every pixel a memory, every photo a story. Explore the albums and candids
               that captured the spirit of the Class of 2025.
            </p>
          </FadeIn>
        </div>

        <GalleryClient initialAlbums={albums as any} initialMemories={memories as any} />
      </Container>
    </Section>
  );
}

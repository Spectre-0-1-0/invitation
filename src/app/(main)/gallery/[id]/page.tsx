import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Tag, User } from "lucide-react";

export async function generateMetadata({ params }: any) {
  const { id } = await params;
  const memory = await prisma.media.findUnique({
    where: { id }
  });

  if (!memory) return { title: "Memory Not Found" };

  return {
    title: memory.title || "Archive Memory",
    description: memory.description || "Captured moment from the Class of 2025.",
    openGraph: {
      title: memory.title || "Archive Memory",
      description: memory.description || "Captured moment from the Class of 2025.",
      images: [memory.url],
    },
  };
}

export default async function MemoryDetailPage({ params }: any) {
  const { id } = await params;
  const memory = await prisma.media.findUnique({
    where: { id },
    include: {
      event: true,
      taggedPeople: true
    }
  });

  if (!memory) notFound();

  return (
    <Section className="pt-20">
      <Container>
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-charcoal-muted hover:text-heritage-navy transition-colors mb-12"
        >
          <ArrowLeft size={14} /> Back to Gallery
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="bg-white p-4 rounded-md shadow-scrapbook border border-parchment-muted">
              <div className="relative aspect-video lg:aspect-[16/10] bg-parchment-muted rounded-sm overflow-hidden">
                <Image
                  src={memory.url}
                  alt={memory.title || "Archive Memory"}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {memory.description && (
              <div className="mt-12 p-10 bg-parchment-base rounded-md border border-parchment-dark/10 relative">
                <div className="absolute top-0 left-8 w-8 h-8 bg-parchment-base border-l border-t border-parchment-dark/10 rotate-45 -translate-y-1/2" />
                <p className="text-xl font-serif italic text-heritage-navy leading-relaxed">
                  &quot;{memory.description}&quot;
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-12">
            <div className="space-y-6">
              <Badge variant="outline" className="uppercase tracking-widest border-parchment-dark">
                {memory.type}
              </Badge>
              <Heading level={1} className="text-4xl md:text-5xl">{memory.title || 'Untitled Memory'}</Heading>
            </div>

            <div className="space-y-8 py-8 border-y border-parchment-muted">
              <div className="flex items-center gap-4 text-sm">
                <Calendar size={16} className="text-champagne-gold" />
                <span className="font-mono text-charcoal-muted">{new Date(memory.createdAt).toLocaleDateString()}</span>
              </div>

              {memory.taggedPeople && memory.taggedPeople.length > 0 && (
                <div className="flex items-start gap-4 text-sm">
                  <User size={16} className="text-champagne-gold mt-1" />
                  <div className="flex flex-wrap gap-2">
                    {memory.taggedPeople.map(person => (
                      <Link
                        key={person.id}
                        href={`/people/${person.slug}`}
                        className="px-3 py-1 bg-parchment-base rounded-full text-[10px] font-bold uppercase hover:bg-champagne-gold hover:text-white transition-colors"
                      >
                        {person.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {memory.event && (
                <div className="flex items-center gap-4 text-sm">
                  <Tag size={16} className="text-champagne-gold" />
                  <Link
                    href={`/events/${memory.event.slug}`}
                    className="text-heritage-navy font-bold hover:text-champagne-gold transition-colors"
                  >
                    Part of {memory.event.title}
                  </Link>
                </div>
              )}
            </div>

            <div className="pt-4">
               <div className="bg-white p-6 border border-parchment-muted rounded-md rotate-1 shadow-sm">
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-charcoal-muted mb-4 block opacity-50">Archive Notes</p>
                  <p className="text-xs text-charcoal-muted italic leading-relaxed">
                    This item is part of the official Class of 2025 Digital Archive. All rights reserved by the original contributors.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { getMemories } from "@/lib/data-fetcher";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Tag, User } from "lucide-react";

export async function generateMetadata({ params }: any) {
  const { id } = await params;
  const memories = await getMemories();
  const memory = memories.find(m => m.id === id);

  if (!memory) return { title: "Memory Not Found" };

  return {
    title: memory.title,
    description: memory.description,
    openGraph: {
      title: memory.title,
      description: memory.description,
      images: [memory.url],
    },
  };
}

export default async function MemoryDetailPage({ params }: any) {
  const { id } = await params;
  const memories = await getMemories();
  const memory = memories.find(m => m.id === id);

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <div className="bg-white p-4 shadow-scrapbook border border-parchment-muted rounded-sm rotate-1">
              <div className="aspect-video bg-parchment-muted relative overflow-hidden rounded-sm">
                <Image
                  src={memory.url}
                  alt={memory.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-center">
            <Badge variant="outline" className="w-fit mb-6 uppercase tracking-widest">
              {memory.category}
            </Badge>

            <Heading level={1} className="text-4xl md:text-5xl mb-6">
              {memory.title}
            </Heading>

            <p className="text-lg text-charcoal-muted font-serif italic leading-relaxed mb-10">
              &quot;{memory.description}&quot;
            </p>

            <div className="space-y-6 pt-8 border-t border-parchment-muted">
              <div className="flex items-center gap-4 text-sm">
                <Calendar size={16} className="text-champagne-gold" />
                <span className="font-mono text-charcoal-muted">{new Date(memory.date).toLocaleDateString()}</span>
              </div>

              {memory.peopleInvolved && memory.peopleInvolved.length > 0 && (
                <div className="flex items-start gap-4 text-sm">
                  <User size={16} className="text-champagne-gold mt-1" />
                  <div className="flex flex-wrap gap-2">
                    {memory.peopleInvolved.map(slug => (
                      <Link
                        key={slug}
                        href={`/people/${slug}`}
                        className="px-3 py-1 bg-parchment-base rounded-full text-[10px] font-bold uppercase hover:bg-champagne-gold hover:text-white transition-colors"
                      >
                        {slug.replace('-', ' ')}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {memory.tags && memory.tags.length > 0 && (
                <div className="flex items-start gap-4 text-sm">
                  <Tag size={16} className="text-champagne-gold mt-1" />
                  <div className="flex flex-wrap gap-2">
                    {memory.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-[9px] lowercase">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

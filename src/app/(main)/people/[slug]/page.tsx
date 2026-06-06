import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { getSeniorBySlug, getMemoriesBySenior } from "@/lib/data-fetcher";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Instagram, Quote } from "lucide-react";

export async function generateMetadata({ params }: any) {
  const { slug } = await params;
  const senior = await getSeniorBySlug(slug);
  return { title: senior?.name || "Senior Profile" };
}

export default async function SeniorProfilePage({ params }: any) {
  const { slug } = await params;
  const senior = await getSeniorBySlug(slug);
  if (!senior) notFound();

  const memories = await getMemoriesBySenior(senior.id);

  return (
    <div className="flex flex-col">
      <Section className="pb-0">
        <Container>
          <Link href="/seniors" className="text-xs font-bold uppercase tracking-widest text-charcoal-muted hover:text-heritage-navy transition-colors">
            &larr; Back to Seniors
          </Link>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-5 lg:col-span-4">
              <div className="aspect-[4/5] rounded-md bg-parchment-muted border-8 border-white shadow-lg relative">
                <div className="absolute top-4 right-4 flex gap-2">
                   {senior.socialLinks?.instagram && (
                     <a href={`https://instagram.com/${senior.socialLinks.instagram}`} className="p-2 bg-white/90 rounded-full text-heritage-navy hover:text-champagne-gold transition-colors">
                       <Instagram size={18} />
                     </a>
                   )}
                </div>
              </div>
            </div>

            <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center">
              <Badge variant="outline" className="w-fit mb-4">{senior.major}</Badge>
              <Heading level={1} className="md:text-7xl">{senior.name}</Heading>

              <div className="mt-8 relative">
                <Quote className="absolute -left-8 -top-4 w-12 h-12 text-champagne-gold/20" />
                <p className="text-2xl md:text-3xl font-serif italic text-heritage-navy leading-relaxed">
                   &quot;{senior.quote}&quot;
                </p>
              </div>

              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-champagne-gold mb-4">Achievements</h3>
                  <ul className="space-y-3">
                    {senior.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-heritage-navy mt-1.5" />
                        <span className="text-sm text-charcoal">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section variant="muted">
        <Container>
          <div className="flex items-end justify-between mb-12 border-b border-charcoal-muted/10 pb-6">
            <div>
              <h2 className="font-serif text-3xl">Shared Memories</h2>
              <p className="text-charcoal-muted text-sm mt-1">Moments shared with the Class of 2025</p>
            </div>
            <Link href="/gallery" className="text-xs font-bold uppercase tracking-widest text-heritage-navy hover:text-champagne-gold transition-colors">
              View All Gallery &rarr;
            </Link>
          </div>

          {memories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {memories.map((memory) => (
                <Link key={memory.id} href={`/gallery/${memory.id}`}>
                  <div className="bg-white p-2 rounded-md shadow-sm group cursor-pointer hover:shadow-md transition-all">
                    <div className="aspect-video rounded-sm bg-parchment-muted overflow-hidden relative">
                       <div className="absolute inset-0 bg-heritage-navy/0 group-hover:bg-heritage-navy/10 transition-colors" />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-[10px] py-0">{memory.category}</Badge>
                        <span className="text-[10px] font-mono text-charcoal-muted">{memory.date}</span>
                      </div>
                      <h4 className="font-serif text-lg text-heritage-navy group-hover:text-champagne-gold transition-colors">
                        {memory.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-charcoal-muted/20 rounded-md">
               <p className="text-charcoal-muted italic">No shared memories captured yet.</p>
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
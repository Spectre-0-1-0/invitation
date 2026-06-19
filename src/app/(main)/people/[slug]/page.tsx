import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { getSeniorBySlug, getMemoriesBySenior } from "@/lib/data-fetcher";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Quote, ArrowLeft } from "lucide-react";

export async function generateMetadata({ params }: any) {
  const { slug } = await params;
  const senior = await getSeniorBySlug(slug);
  return {
    title: senior?.name || "Senior Profile",
    description: senior?.quote || `Profile for ${senior?.name}`,
  };
}

export default async function SeniorProfilePage({ params }: any) {
  const { slug } = await params;
  const senior = await getSeniorBySlug(slug);
  if (!senior) notFound();

  const memories = await getMemoriesBySenior(senior.id);

  return (
    <div className="flex flex-col">
      <Section className="pb-0 pt-20">
        <Container>
          <Link href="/seniors" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-charcoal-muted hover:text-heritage-navy transition-colors">
            <ArrowLeft size={14} /> Back to Seniors
          </Link>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 items-center">
            <div className="md:col-span-5 lg:col-span-4">
              <div className="aspect-[4/5] rounded-md bg-parchment-muted border-8 border-white shadow-polaroid relative rotate-2">
                {senior.image && (
                  <Image
                    src={senior.image}
                    alt={senior.name}
                    fill
                    className="object-cover"
                    priority
                  />
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                   {senior.socialLinks?.instagram && (
                     <a
                       href={`https://instagram.com/${senior.socialLinks.instagram}`}
                       className="p-2 bg-white/90 rounded-full text-heritage-navy hover:text-champagne-gold transition-colors shadow-sm"
                       aria-label="Instagram Profile"
                     >
                       <Instagram size={18} />
                     </a>
                   )}
                </div>
              </div>
            </div>

            <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center">
              <Badge variant="outline" className="w-fit mb-6 uppercase tracking-widest">{senior.major}</Badge>
              <Heading level={1} className="text-5xl md:text-7xl lg:text-8xl mb-8 leading-tight">{senior.name}</Heading>

              <div className="mt-4 relative max-w-2xl">
                <Quote className="absolute -left-10 -top-6 w-16 h-16 text-champagne-gold/10" aria-hidden="true" />
                <p className="text-2xl md:text-4xl font-serif italic text-heritage-navy leading-relaxed relative z-10">
                   &quot;{senior.quote}&quot;
                </p>
              </div>

              <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-12 border-t border-parchment-muted pt-12">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-champagne-gold mb-6 font-bold">Academic Journey</h3>
                  <ul className="space-y-4">
                    {senior.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-champagne-gold mt-2 flex-shrink-0" />
                        <span className="text-sm text-charcoal leading-relaxed">{achievement}</span>
                      </li>
                    ))}
                    {senior.achievements.length === 0 && (
                       <li className="text-sm text-charcoal-muted italic">No specific achievements listed.</li>
                    )}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-champagne-gold mb-6 font-bold">Class Identity</h3>
                  <div className="space-y-4 text-sm text-charcoal-muted font-mono uppercase tracking-widest">
                     <p>Class of {senior.graduationYear}</p>
                     <p>{senior.nickname ? `Known as: "${senior.nickname}"` : 'Full Name Directory'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section variant="muted" className="mt-32">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-charcoal-muted/10 pb-8 gap-6">
            <div>
              <h2 className="font-serif text-4xl text-heritage-navy">Shared Stories</h2>
              <p className="text-charcoal-muted text-sm mt-2 font-serif italic">Moments captured with {senior.name}</p>
            </div>
            <Link href="/gallery" className="text-xs font-bold uppercase tracking-widest text-heritage-navy hover:text-champagne-gold transition-colors flex items-center gap-2">
              Explore Open Archive <ArrowLeft size={14} className="rotate-180" />
            </Link>
          </div>

          {memories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {memories.map((memory) => (
                <Link
                  key={memory.id}
                  href={`/gallery/${memory.id}`}
                  className="group block"
                >
                  <div className="bg-white p-3 rounded-md shadow-scrapbook border border-parchment-muted group cursor-pointer hover:-rotate-1 transition-all duration-500">
                    <div className="aspect-video rounded-sm bg-parchment-muted overflow-hidden relative">
                       <Image
                         src={memory.url}
                         alt=""
                         fill
                         className="object-cover"
                       />
                       <div className="absolute inset-0 bg-heritage-navy/0 group-hover:bg-heritage-navy/10 transition-colors" />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant="outline" className="text-[9px] py-0 border-parchment-dark/30 uppercase tracking-widest">{memory.category}</Badge>
                        <span className="text-[9px] font-mono text-charcoal-muted opacity-50">{new Date(memory.date).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-serif text-xl text-heritage-navy group-hover:text-champagne-gold transition-colors leading-tight">
                        {memory.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center border-2 border-dashed border-charcoal-muted/10 rounded-xl bg-white/50">
               <p className="text-charcoal-muted italic font-serif">No shared memories captured yet.</p>
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}

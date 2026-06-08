import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/animations/FadeIn";
import { getSeniors } from "@/lib/data-fetcher";
import Link from "next/link";
import { Search, Sparkles } from "lucide-react";
import Image from "next/image";

export const metadata = { title: "The Seniors" };

export default async function SeniorsPage() {
  const seniors = await getSeniors();

  return (
    <Section className="pt-20">
      <Container>
        <div className="flex flex-col items-center text-center mb-24">
          <FadeIn>
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-champagne-gold mb-6 block font-bold">The Collective</span>
            <Heading level={1} className="text-5xl md:text-7xl mb-8">The <span className="italic font-light">Seniors</span></Heading>
            <p className="text-lg md:text-xl text-charcoal-muted max-w-2xl mx-auto font-serif italic">
              A directory of the brilliant minds, kind hearts, and unforgettable personalities
              that made the Class of 2025 truly exceptional.
            </p>
          </FadeIn>

          <FadeIn delay={0.2} className="mt-12 w-full max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-muted/40 w-4 h-4" />
            <input
              type="text"
              placeholder="Find a friend or classmate..."
              className="w-full pl-12 pr-6 py-4 bg-white shadow-sm border border-parchment-muted rounded-full focus:outline-none focus:border-champagne-gold transition-all text-sm"
            />
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16">
          {seniors.map((senior, i) => (
            <FadeIn key={senior.id} delay={i * 0.05}>
              <Link href={`/people/${senior.slug}`} className="group block">
                <Card variant="scrapbook" className="h-full bg-white p-2">
                  <div className="relative aspect-[4/5] bg-parchment-muted overflow-hidden group-hover:grayscale-0 grayscale-[0.3] transition-all duration-700">
                    {senior.image ? (
                      <Image src={senior.image} alt={senior.name} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-heritage-navy/10 font-serif italic text-4xl">
                        {senior.name[0]}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-heritage-navy/5 mix-blend-multiply" />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <div className="p-2 bg-white/90 rounded-full text-heritage-navy shadow-sm">
                          <Sparkles size={14} />
                       </div>
                    </div>
                  </div>
                  <div className="pt-6 pb-4 px-4 text-center">
                    <h2 className="font-serif text-2xl text-heritage-navy group-hover:text-champagne-gold transition-colors">
                      {senior.name}
                    </h2>
                    <p className="text-[10px] font-mono text-charcoal-muted uppercase tracking-[0.2em] mt-2">
                      {senior.major}
                    </p>
                  </div>
                </Card>
              </Link>
            </FadeIn>
          ))}
        </div>
      </Container>
    </Section>
  );
}

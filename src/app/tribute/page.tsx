import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Heart, ArrowRight, Sparkles } from "lucide-react";
import TributeClient from "./TributeClient";

export const metadata = {
  title: "A Final Tribute",
  description: "A cinematic farewell to the Class of 2025.",
};

export default function TributePage() {
  return (
    <main className="bg-heritage-navy text-parchment-base min-h-screen selection:bg-champagne-gold selection:text-heritage-navy">
      <TributeClient />
      {/* Intro section */}
      <Section className="bg-heritage-navy text-center py-32 md:py-48 min-h-[90vh] flex flex-col justify-center relative overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_#1A2B48_0%,_#000_100%)] opacity-50" />

        <Container className="relative z-10">
          <Link href="/" className="group inline-flex items-center gap-2 text-champagne-gold hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-16">
            <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Return to Archive
          </Link>

          <div className="flex justify-center mb-8">
            <div className="w-px h-24 bg-gradient-to-b from-transparent to-champagne-gold/40" />
          </div>

          <span className="text-sm font-mono tracking-[0.4em] uppercase text-champagne-gold/60 mb-6 block">The Final Chapter</span>
          <h1 className="font-serif text-6xl md:text-[10rem] leading-none mb-12 tracking-tighter">
            Farewell <br className="md:hidden" /> <span className="font-light italic text-champagne-gold">2025</span>
          </h1>

          <p className="text-xl md:text-3xl text-parchment-muted/70 max-w-3xl mx-auto italic font-serif leading-relaxed px-4">
             &quot;Every beginning has an end, and every end is a new beginning.
             Today we close the book, but the story we wrote here lasts forever.&quot;
          </p>

          <div className="mt-20">
             <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-parchment-muted/40">
                <Heart size={12} className="text-burnt-sienna fill-burnt-sienna" />
                Scroll to Begin the Journey
             </div>
          </div>
        </Container>
      </Section>

      {/* Cinematic Content Section */}
      <Section className="bg-white text-heritage-navy py-32 md:py-64">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
             <div>
                <span className="text-xs font-mono uppercase tracking-widest text-champagne-gold mb-4 block">Reflections</span>
                <Heading level={2} className="text-5xl md:text-7xl mb-8 leading-tight">Beyond the <br /> Classroom Walls</Heading>
                <p className="text-lg text-charcoal-muted leading-relaxed mb-8">
                   We came here as individuals from different paths, and we leave as a single, unified legacy.
                   The late nights in the library, the victories on the field, the quiet conversations in the quad—they all added up to something bigger than ourselves.
                </p>
                <p className="text-lg text-charcoal-muted leading-relaxed italic border-l-2 border-champagne-gold pl-6">
                   &quot;It wasn&apos;t just about the degrees. It was about the people who sat next to us while we earned them.&quot;
                </p>
             </div>
             <div className="aspect-[4/5] bg-parchment-muted rounded-md shadow-2xl relative rotate-3">
                <div className="absolute inset-0 border-[16px] border-white shadow-inner" />
                <div className="absolute -bottom-8 -right-8 p-6 bg-heritage-navy text-white rounded-md shadow-xl max-w-xs">
                   <p className="text-xs font-serif italic">&quot;A snapshot from the day we realized we were finally seniors.&quot;</p>
                </div>
             </div>
          </div>
        </Container>
      </Section>

      {/* The Tribute Film Section */}
      <Section className="bg-parchment-muted py-32 md:py-48 text-center">
        <Container>
           <div className="max-w-4xl mx-auto">
              <Heading level={2} className="mb-12">The Archive Film</Heading>
              <div className="aspect-video bg-heritage-navy rounded-md shadow-2xl relative flex items-center justify-center overflow-hidden group cursor-pointer border-8 border-white">
                 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all z-10" />
                 <div className="relative z-20 flex flex-col items-center">
                    <div className="p-6 rounded-full bg-white text-heritage-navy mb-4 shadow-xl group-hover:scale-110 transition-transform">
                       <ArrowRight size={32} />
                    </div>
                    <span className="text-xs font-mono uppercase tracking-[0.3em] text-white">Press Play to Relive</span>
                 </div>
              </div>
              <p className="mt-12 text-charcoal-muted font-serif italic text-lg">
                 A curated 15-minute journey through our four years together.
              </p>
           </div>
        </Container>
      </Section>

      {/* Final Call to Action */}
      <Section className="bg-heritage-navy text-parchment-base py-32 md:py-64 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_#D4AF3715_0%,_transparent_70%)]" />

        <Container className="relative z-10">
           <Sparkles className="mx-auto text-champagne-gold mb-8" size={48} />
           <Heading level={2} className="text-parchment-base text-5xl md:text-7xl mb-8">Go Forth and Conquer</Heading>
           <p className="text-parchment-muted/60 max-w-xl mx-auto text-lg mb-16">
              Our time here is finished, but our impact is just beginning.
              Keep this archive close. Share it with those who were there.
              Revisit it when you need to remember who you were.
           </p>

           <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/gallery">
                 <Button variant="secondary" size="lg" className="px-12">Keep Exploring</Button>
              </Link>
              <span className="text-parchment-muted/40 font-mono text-xs uppercase">or</span>
              <button
                className="text-parchment-base hover:text-champagne-gold transition-colors font-bold uppercase tracking-widest text-xs"
              >
                Download Archive Summary
              </button>
           </div>
        </Container>
      </Section>
    </main>
  );
}

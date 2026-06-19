import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { FadeIn } from "@/components/animations/FadeIn";
import { getMemes } from "@/lib/data-fetcher";
import { Laugh } from "lucide-react";
import Image from "next/image";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata = {
  title: "Hall of Memes",
  description: "Celebrating the inside jokes and shared humor of the Class of 2025."
};

export default async function MemesPage() {
  const memes = await getMemes();

  return (
    <Section className="pt-20">
      <Container>
        <div className="flex flex-col items-center text-center mb-24">
          <FadeIn>
            <div className="p-4 bg-burnt-sienna text-white rounded-full mb-8 shadow-xl shadow-burnt-sienna/20 inline-block">
              <Laugh size={28} />
            </div>
            <Heading level={1} className="text-5xl md:text-7xl mb-8">The Hall of <span className="italic font-light">Memes</span></Heading>
            <p className="text-lg md:text-xl text-charcoal-muted max-w-2xl mx-auto font-serif italic">
               Because a major without memes is just... a degree.
               Celebrating the inside jokes that made the hard weeks easier.
            </p>
          </FadeIn>
        </div>

        {memes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {memes.map((meme, i) => (
              <FadeIn key={meme.id} delay={i * 0.05}>
                <div className="bg-white p-4 border border-parchment-muted shadow-polaroid rounded-sm group hover:border-champagne-gold transition-all duration-500 hover:-rotate-1">
                  <div className="aspect-square bg-parchment-muted mb-6 rounded-sm overflow-hidden relative">
                    {meme.url ? (
                      <Image
                        src={meme.url}
                        alt={meme.caption || "Class Meme"}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-charcoal-muted/20 font-serif text-4xl -rotate-12 select-none">MEME</div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-heritage-navy font-serif text-lg text-center leading-snug">&quot;{meme.caption}&quot;</p>
                    {meme.originContext && (
                      <div className="mt-6 pt-6 border-t border-parchment-muted text-center">
                        <p className="text-[10px] text-charcoal-muted italic leading-relaxed">
                          <span className="font-bold text-champagne-gold uppercase not-italic block mb-2 tracking-widest">The Context</span>
                          {meme.originContext}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        ) : (
          <FadeIn>
            <EmptyState
              title="Laughter Pending"
              message="The meme archive is currently waiting for your best inside jokes. Check back after finals."
              icon={<Laugh size={40} />}
            />
          </FadeIn>
        )}
      </Container>
    </Section>
  );
}

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { getMemes } from "@/lib/data-fetcher";
import { Laugh } from "lucide-react";

export const metadata = { title: "Hall of Memes" };

export default async function MemesPage() {
  const memes = await getMemes();

  return (
    <Section>
      <Container>
        <div className="flex flex-col items-center text-center mb-16">
          <div className="p-3 bg-burnt-sienna text-white rounded-full mb-6">
            <Laugh size={24} />
          </div>
          <Heading level={1}>Hall of Memes</Heading>
          <p className="mt-4 text-charcoal-muted max-w-xl">
            Because a major without memes is just... a degree.
            Celebrating the inside jokes that made the hard weeks easier.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {memes.map((meme) => (
            <div key={meme.id} className="bg-white p-4 border border-parchment-muted shadow-sm rounded-md group hover:border-champagne-gold transition-colors">
              <div className="aspect-square bg-parchment-muted mb-4 rounded-sm overflow-hidden relative">
                 {/* Image Placeholder */}
                 <div className="absolute inset-0 flex items-center justify-center text-charcoal-muted/20 font-serif text-4xl -rotate-12 select-none">MEME</div>
              </div>
              <div className="p-2">
                <p className="text-heritage-navy font-medium text-center leading-snug">&quot;{meme.caption}&quot;</p>
                <div className="mt-4 pt-4 border-t border-parchment-muted text-center">
                  <p className="text-xs text-charcoal-muted italic leading-relaxed">
                    <span className="font-bold text-champagne-gold uppercase not-italic block mb-1">The Context</span>
                    {meme.originContext}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

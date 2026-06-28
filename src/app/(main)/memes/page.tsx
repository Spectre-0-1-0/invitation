import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { FadeIn } from "@/components/animations/FadeIn";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { Laugh } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import Image from "next/image";

export const metadata = {
  title: "The Meme Archive",
  description: "A curated collection of the Class of 2025's finest inside jokes and internet culture."
};

async function getMemes() {
  try {
    if (!process.env.DATABASE_URL) return [];
    return await prisma.media.findMany({
      where: { type: 'MEME' },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    logger.error("Failed to fetch memes", { data: error });
    return [];
  }
}

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
            <Heading level={1} className="text-5xl md:text-7xl mb-8">The <span className="italic font-light">Meme</span> Archive</Heading>
            <p className="text-lg md:text-xl text-charcoal-muted max-w-2xl mx-auto font-serif italic">
               If you know, you know. The inside jokes, the shared struggles,
               and the humor that kept us going through finals week.
            </p>
          </FadeIn>
        </div>

        {memes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {memes.map((meme, i) => (
              <FadeIn key={meme.id} delay={i * 0.1}>
                <div className="bg-white p-4 rounded-md shadow-scrapbook border border-parchment-muted group hover:-rotate-1 transition-all duration-500">
                  <div className="aspect-square bg-parchment-muted overflow-hidden relative rounded-sm">
                    <Image
                      src={meme.url}
                      alt={meme.title || "Archive Meme"}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="p-4">
                    {meme.title && <h3 className="font-serif text-xl text-heritage-navy mb-2">{meme.title}</h3>}
                    {meme.description && (
                      <div className="mt-4 p-4 rounded bg-parchment-muted text-center">
                        <p className="text-[10px] text-charcoal-muted italic leading-relaxed">
                          <span className="font-bold text-champagne-gold uppercase not-italic block mb-2 tracking-widest">The Context</span>
                          {meme.description}
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

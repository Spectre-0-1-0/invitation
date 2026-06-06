import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { getMemes } from "@/lib/data-fetcher";

export const metadata = { title: "Hall of Memes" };

export default async function MemesPage() {
  const memes = await getMemes();

  return (
    <Section>
      <Container>
        <h1 className="font-serif text-4xl mb-12 text-heritage-navy text-center">Hall of Memes</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {memes.map((meme) => (
            <div key={meme.id} className="bg-white p-4 border shadow-sm rounded-md">
              <div className="aspect-square bg-parchment-muted mb-4 rounded-md" />
              <p className="text-charcoal font-medium text-center">&quot;{meme.caption}&quot;</p>
              <p className="mt-2 text-xs text-charcoal-muted text-center italic">{meme.originContext}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
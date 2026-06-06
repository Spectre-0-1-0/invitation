import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { getMemories } from "@/lib/data-fetcher";

export const metadata = { title: "Memory Gallery" };

export default async function GalleryPage() {
  const memories = await getMemories();

  return (
    <Section>
      <Container>
        <h1 className="font-serif text-4xl mb-12 text-heritage-navy">Memory Gallery</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {memories.map((memory) => (
            <div key={memory.id} className="aspect-video bg-parchment-muted rounded-md p-4 flex flex-col justify-end border group cursor-pointer hover:border-champagne-gold transition-all">
              <span className="text-xs font-mono text-charcoal-muted uppercase">{memory.category}</span>
              <h3 className="font-serif text-lg">{memory.title}</h3>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { getSeniorBySlug, getMemoriesBySenior } from "@/lib/data-fetcher";
import { notFound } from "next/navigation";

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
    <Section>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          <div className="md:col-span-1">
            <div className="aspect-square rounded-md bg-parchment-muted mb-6" />
            <h1 className="font-serif text-3xl text-heritage-navy">{senior.name}</h1>
            <p className="text-charcoal-muted">{senior.major}</p>
            <div className="mt-8 space-y-4">
              <h3 className="text-xs uppercase font-mono tracking-widest text-champagne-gold">Achievements</h3>
              <ul className="list-disc list-inside text-sm text-charcoal space-y-1">
                {senior.achievements.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          </div>
          <div className="md:col-span-2">
            <blockquote className="font-serif text-2xl italic text-charcoal border-l-4 border-champagne-gold pl-6 py-2">
              &quot;{senior.quote}&quot;
            </blockquote>
            <div className="mt-16">
              <h3 className="text-xl font-serif mb-6 border-b pb-2">Shared Memories</h3>
              <div className="grid grid-cols-2 gap-4">
                {memories.map(m => (
                  <div key={m.id} className="aspect-video bg-parchment-muted rounded-md p-4 flex flex-col justify-end border">
                    <h4 className="font-serif text-sm">{m.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
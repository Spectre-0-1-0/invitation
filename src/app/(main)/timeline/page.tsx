import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { getTimeline } from "@/lib/data-fetcher";

export const metadata = { title: "The Timeline" };

export default async function TimelinePage() {
  const timeline = await getTimeline();

  return (
    <Section>
      <Container>
        <h1 className="font-serif text-4xl mb-12 text-heritage-navy">The Timeline</h1>
        <div className="space-y-12 max-w-3xl mx-auto">
          {timeline.map((event) => (
            <div key={event.id} className="flex gap-8">
              <div className="font-mono text-sm text-champagne-gold pt-1 whitespace-nowrap">{event.period}</div>
              <div>
                <h2 className="font-serif text-xl mb-2">{event.title}</h2>
                <p className="text-charcoal-muted">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

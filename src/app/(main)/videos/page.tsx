import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

export const metadata = { title: "Video Archive" };

export default function VideosPage() {
  return (
    <Section>
      <Container className="text-center">
        <h1 className="font-serif text-4xl mb-6 text-heritage-navy">Video Archive</h1>
        <p className="text-charcoal-muted">Moving memories captured throughout our journey.</p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-video bg-parchment-muted rounded-md flex items-center justify-center border">
                <p className="text-charcoal-muted italic">Freshman Orientation Recap</p>
            </div>
            <div className="aspect-video bg-parchment-muted rounded-md flex items-center justify-center border">
                <p className="text-charcoal-muted italic">Senior Week Highlights</p>
            </div>
        </div>
      </Container>
    </Section>
  );
}

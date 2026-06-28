import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { FadeIn } from "@/components/animations/FadeIn";
import { getSeniors } from "@/lib/data-fetcher";
import SeniorsClient from "./SeniorsClient";

export const metadata = {
  title: "Class Directory",
  description: "Browse the profiles of the Class of 2025."
};

export default async function SeniorsPage() {
  const seniors = await getSeniors();

  return (
    <Section className="pt-20">
      <Container>
        <div className="flex flex-col items-center">
          <FadeIn>
            <div className="text-center mb-24">
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-champagne-gold mb-6 block font-bold">Class Directory</span>
              <Heading level={1} className="text-5xl md:text-7xl mb-8">The <span className="italic font-light">Faces</span> of 2025</Heading>
              <p className="text-lg md:text-xl text-charcoal-muted max-w-2xl mx-auto font-serif italic">
                 Browse the profiles of our peers, friends, and colleagues.
                 Each name a story, each face a milestone.
              </p>
            </div>
          </FadeIn>

          <SeniorsClient initialSeniors={seniors as any} />
        </div>
      </Container>
    </Section>
  );
}

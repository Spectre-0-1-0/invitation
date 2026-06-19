import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { FadeIn } from "@/components/animations/FadeIn";
import { getSeniors } from "@/lib/data-fetcher";
import SeniorsClient from "./SeniorsClient";

export const metadata = { title: "The Seniors" };

export default async function SeniorsPage() {
  const seniors = await getSeniors();

  return (
    <Section className="pt-20">
      <Container>
        <div className="flex flex-col items-center text-center">
          <FadeIn>
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-champagne-gold mb-6 block font-bold">The Collective</span>
            <Heading level={1} className="text-5xl md:text-7xl mb-8">The <span className="italic font-light">Seniors</span></Heading>
            <p className="text-lg md:text-xl text-charcoal-muted max-w-2xl mx-auto font-serif italic">
              A directory of the brilliant minds, kind hearts, and unforgettable personalities
              that made the Class of 2025 truly exceptional.
            </p>
          </FadeIn>

          <SeniorsClient initialSeniors={seniors} />
        </div>
      </Container>
    </Section>
  );
}

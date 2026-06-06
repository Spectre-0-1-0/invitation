import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Section className="min-h-[80vh] flex items-center">
        <Container className="text-center">
          <h1 className="font-serif text-5xl md:text-7xl text-heritage-navy leading-tight">
            Class of 2025: <br /> Our Story
          </h1>
          <p className="mt-6 text-lg md:text-xl text-charcoal-muted max-w-2xl mx-auto">
            A sanctuary for our memories, achievements, and shared history.
            Revisit the journey that defined us.
          </p>
          <div className="mt-10">
            <button className="px-8 py-3 bg-heritage-navy text-white rounded-md font-medium hover:bg-opacity-90 transition-all">
              Enter the Archive
            </button>
          </div>
        </Container>
      </Section>
    </div>
  );
}

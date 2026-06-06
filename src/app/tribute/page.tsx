import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import Link from "next/link";

export const metadata = { title: "The Final Tribute" };

export default function TributePage() {
  return (
    <main className="bg-heritage-navy text-parchment-base min-h-screen">
      <Section className="bg-heritage-navy text-center py-32">
        <Container>
          <Link href="/" className="text-champagne-gold hover:underline text-sm uppercase tracking-widest mb-12 inline-block">
            &larr; Return to Archive
          </Link>
          <h1 className="font-serif text-6xl md:text-8xl mt-12 mb-8">The Final Goodbye</h1>
          <p className="text-xl md:text-2xl text-parchment-muted/80 max-w-3xl mx-auto italic font-serif">
            &quot;We didn&apos;t realize we were making memories, we just knew we were having fun.&quot;
          </p>
          <div className="mt-24 aspect-video bg-white/10 rounded-md flex items-center justify-center border border-white/20">
            <p className="text-champagne-gold font-serif text-2xl">Tribute Film Playing Soon</p>
          </div>
        </Container>
      </Section>
    </main>
  );
}
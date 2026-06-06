import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

export default function NotFound() {
  return (
    <Section className="min-h-[60vh] flex items-center">
      <Container className="text-center">
        <h1 className="font-serif text-6xl text-heritage-navy mb-4">404</h1>
        <p className="text-xl text-charcoal-muted mb-8 italic">&quot;Some memories are lost to time...&quot;</p>
        <Link href="/" className="px-6 py-2 bg-heritage-navy text-white rounded-md hover:bg-opacity-90 transition-all">
          Return Home
        </Link>
      </Container>
    </Section>
  );
}
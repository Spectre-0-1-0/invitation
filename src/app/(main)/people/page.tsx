import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { getSeniors } from "@/lib/data-fetcher";
import Link from "next/link";

export const metadata = { title: "The Seniors" };

export default async function SeniorsPage() {
  const seniors = await getSeniors();

  return (
    <Section>
      <Container>
        <h1 className="font-serif text-4xl mb-12 text-heritage-navy">The Seniors</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {seniors.map((senior) => (
            <Link key={senior.id} href={`/seniors/${senior.id}`} className="group text-center">
              <div className="aspect-square rounded-full bg-parchment-muted mb-4 overflow-hidden border-2 border-transparent group-hover:border-champagne-gold transition-all" />
              <h2 className="font-medium text-charcoal">{senior.name}</h2>
              <p className="text-xs text-charcoal-muted">{senior.major}</p>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}

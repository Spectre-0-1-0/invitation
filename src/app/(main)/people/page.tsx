import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getSeniors } from "@/lib/data-fetcher";
import Link from "next/link";
import { Search } from "lucide-react";

export const metadata = { title: "The Seniors" };

export default async function SeniorsPage() {
  const seniors = await getSeniors();

  return (
    <Section>
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <Heading level={1}>The Seniors</Heading>
            <p className="mt-4 text-charcoal-muted max-w-lg">
              The hearts and minds that shaped the Class of 2025.
              Browse the directory to revisit friendships and stories.
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-muted w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or major..."
              className="w-full pl-10 pr-4 py-3 bg-parchment-muted border-b border-charcoal-muted/20 focus:outline-none focus:border-champagne-gold transition-colors text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {seniors.map((senior) => (
            <Link key={senior.id} href={`/seniors/${senior.id}`} className="group">
              <Card className="border-none shadow-none bg-transparent h-full">
                <div className="relative aspect-[4/5] rounded-md bg-parchment-muted overflow-hidden mb-6">
                  <div className="absolute inset-0 bg-gradient-to-t from-heritage-navy/20 to-transparent group-hover:from-heritage-navy/40 transition-all" />
                  <div className="absolute bottom-4 left-4">
                     <Badge variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                        View Profile
                     </Badge>
                  </div>
                </div>
                <h2 className="font-serif text-2xl text-heritage-navy group-hover:text-champagne-gold transition-colors">
                  {senior.name}
                </h2>
                <p className="text-sm font-mono text-charcoal-muted uppercase tracking-wider mt-1">
                  {senior.major}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
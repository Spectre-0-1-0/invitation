import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <Section className="min-h-screen flex items-center bg-parchment-base">
      <Container className="text-center">
        <div className="max-w-2xl mx-auto">
          <span className="text-[10rem] font-serif text-heritage-navy/5 leading-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">404</span>

          <div className="relative z-10">
            <div className="w-20 h-20 bg-champagne-gold/10 text-champagne-gold rounded-full flex items-center justify-center mx-auto mb-10">
              <Search size={32} />
            </div>

            <Heading level={1} className="text-5xl md:text-7xl mb-6 text-heritage-navy">Memory <span className="italic font-light">Not Found</span></Heading>

            <p className="text-xl text-charcoal-muted mb-12 font-serif italic max-w-lg mx-auto leading-relaxed">
              &quot;Some memories are lost to time, or perhaps they were never captured at all. This page doesn&apos;t exist in our archive.&quot;
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/gallery">
                <Button size="lg" className="px-10 shadow-xl shadow-heritage-navy/10">Browse Gallery</Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="ghost" className="px-10">Go Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

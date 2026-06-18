'use client';

import { useEffect } from 'react';
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section className="min-h-screen flex items-center bg-parchment-base">
      <Container className="text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-burnt-sienna/10 text-burnt-sienna rounded-full flex items-center justify-center mx-auto mb-10">
            <RefreshCcw size={40} />
          </div>

          <h1 className="font-serif text-5xl md:text-7xl text-heritage-navy mb-6">A Fault in the <span className="italic">Archive</span></h1>

          <p className="text-xl text-charcoal-muted mb-12 font-serif italic">
            &quot;Like a blurred photograph or a torn page, some things just don&apos;t load correctly. Let&apos;s try that again.&quot;
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              size="lg"
              onClick={() => reset()}
              className="px-10 shadow-xl shadow-heritage-navy/10"
            >
              Retry Loading
            </Button>
            <Link href="/">
              <Button size="lg" variant="ghost" className="px-10">
                <Home size={18} className="mr-2" /> Return Home
              </Button>
            </Link>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-16 p-6 bg-white/50 border border-burnt-sienna/20 rounded-md text-left overflow-auto max-h-48">
              <p className="text-xs font-mono text-burnt-sienna">{error.message}</p>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/animations/FadeIn";
import { EmptyState } from "@/components/shared/EmptyState";
import Link from "next/link";
import Image from "next/image";
import { Search, Sparkles, Users } from "lucide-react";
import { Senior } from "@/types/archive";
import { trackDiscovery } from "@/lib/analytics";

export default function SeniorsClient({ initialSeniors }: { initialSeniors: Senior[] }) {
  const [search, setSearch] = useState('');

  const filteredSeniors = initialSeniors.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.major.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (search.length > 2) {
      const timer = setTimeout(() => {
        trackDiscovery('search', { query: search, resultsCount: filteredSeniors.length, type: 'people' });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [search, filteredSeniors.length]);

  return (
    <>
      <FadeIn delay={0.2} className="mt-12 w-full max-w-md relative mb-24 mx-auto">
        <label htmlFor="senior-search" className="sr-only">Search seniors</label>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-muted/40 w-4 h-4" aria-hidden="true" />
        <input
          id="senior-search"
          type="text"
          placeholder="Find a friend or classmate..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-white shadow-sm border border-parchment-muted rounded-full focus:outline-none focus:ring-2 focus:ring-champagne-gold transition-all text-sm"
        />
      </FadeIn>

      <div role="region" aria-live="polite" aria-label="Senior search results">
        {filteredSeniors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16">
            {filteredSeniors.map((senior, i) => (
              <FadeIn key={senior.id} delay={i * 0.05}>
                <Link
                  href={`/seniors/${senior.id}`}
                  onClick={() => trackDiscovery('profile_view', { seniorId: senior.id, name: senior.name })}
                  className="group block rounded-md focus:outline-none focus:ring-2 focus:ring-champagne-gold focus:ring-offset-8"
                  aria-label={`View profile of ${senior.name}`}
                >
                  <Card variant="scrapbook" className="h-full bg-white p-2">
                    <div className="relative aspect-[4/5] bg-parchment-muted overflow-hidden group-hover:grayscale-0 grayscale-[0.3] transition-all duration-700">
                      <div className="absolute inset-0 bg-heritage-navy/5 mix-blend-multiply" aria-hidden="true" />
                      {senior.image && (
                        <Image
                          src={senior.image}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      )}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="p-2 bg-white/90 rounded-full text-heritage-navy shadow-sm">
                            <Sparkles size={14} aria-hidden="true" />
                         </div>
                      </div>
                    </div>
                    <div className="pt-6 pb-4 px-4 text-center">
                      <h2 className="font-serif text-2xl text-heritage-navy group-hover:text-champagne-gold transition-colors">
                        {senior.name}
                      </h2>
                      <p className="text-[10px] font-mono text-charcoal-muted uppercase tracking-[0.2em] mt-2">
                        {senior.major}
                      </p>
                    </div>
                  </Card>
                </Link>
              </FadeIn>
            ))}
          </div>
        ) : (
          <FadeIn>
            <EmptyState
              title="No seniors found"
              message={`We couldn't find anyone matching "${search}". Maybe try searching by major or first name?`}
              icon={<Users size={40} />}
            />
          </FadeIn>
        )}
      </div>
    </>
  );
}

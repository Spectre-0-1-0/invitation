'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Sparkles, RefreshCw } from 'lucide-react';
import { trackDiscovery } from '@/lib/analytics';
import { Memory } from '@/types/archive';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import Image from 'next/image';

export const RandomMemory: React.FC<{ memories: Memory[] }> = ({ memories }) => {
  const [randomMemory, setRandomMemory] = useState<Memory | null>(null);

  const handleRandomize = () => {
    const randomIndex = Math.floor(Math.random() * memories.length);
    const selected = memories[randomIndex];
    setRandomMemory(selected);
    trackDiscovery('random_memory', { memoryId: selected.id, title: selected.title });
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {!randomMemory ? (
        <Button
          size="lg"
          onClick={handleRandomize}
          className="group px-12 py-8 bg-heritage-navy text-white rounded-full shadow-2xl hover:bg-burnt-sienna transition-all duration-500"
        >
          <Sparkles className="mr-3 group-hover:rotate-12 transition-transform" />
          Rediscover a Memory
        </Button>
      ) : (
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
          <Link href={`/gallery/${randomMemory.id}`}>
            <Card variant="polaroid" className="group cursor-pointer">
              <div className="aspect-video bg-parchment-muted overflow-hidden relative">
                <Image
                  src={randomMemory.url}
                  alt=""
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-heritage-navy/10 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-serif text-xl text-heritage-navy">{randomMemory.title}</h3>
                <p className="text-[10px] font-mono text-charcoal-muted uppercase tracking-widest mt-2">
                  {randomMemory.date}
                </p>
              </div>
            </Card>
          </Link>
          <button
            onClick={handleRandomize}
            className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal-muted hover:text-heritage-navy mx-auto transition-colors"
          >
            <RefreshCw size={12} /> Try Another
          </button>
        </div>
      )}
    </div>
  );
};

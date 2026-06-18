'use client';

import React from 'react';
import { ScrapbookDesk } from '@/components/scrapbook/ScrapbookDesk';
import { ScrapbookPage } from '@/components/scrapbook/ScrapbookPage';
import { ScrapbookPhoto } from '@/components/scrapbook/ScrapbookPhoto';
import { ScrapbookNote } from '@/components/scrapbook/ScrapbookNote';

export default function Sprint1Page() {
  return (
    <ScrapbookDesk>
      <div className="flex flex-col gap-8 md:gap-0">
        <ScrapbookPage type="notebook" className="min-h-[1000px]">
          {/* Page Header */}
          <div className="absolute top-8 left-16">
             <h1 className="text-4xl md:text-5xl font-serif text-heritage-navy -rotate-1">
               Our Friendship Wall
             </h1>
             <div className="h-1 w-32 bg-champagne-gold mt-2 -rotate-1 opacity-60" />
          </div>

          <ScrapbookNote x="65%" y="5%" rotate={5} persona="emotional" width="250px">
            "Looking back, these were the people who made 4 years feel like 4 minutes."
          </ScrapbookNote>

          {/* Major Memory: The Crew */}
          <ScrapbookPhoto
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop"
            alt="Group of friends"
            caption="The Core Four (Plus Rahul)"
            x="10%"
            y="15%"
            rotate={-3}
            width="350px"
            type="polaroid"
            handwriting="font-serif italic"
          />

          {/* Scattered Minor Memories */}
          <ScrapbookPhoto
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=400&auto=format&fit=crop"
            alt="Canteen study session"
            caption="Canteen Chronicles"
            x="55%"
            y="25%"
            rotate={4}
            width="220px"
            type="print"
          />

          <ScrapbookNote x="45%" y="45%" rotate={-10} persona="clown" width="180px" type="sticky">
            Rahul definitely didn't finish his assignment here... 😂
          </ScrapbookNote>

          <ScrapbookPhoto
            src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=400&auto=format&fit=crop"
            alt="Late night at lab"
            caption="3 AM Lab Vibes"
            x="15%"
            y="55%"
            rotate={2}
            width="240px"
            type="polaroid"
            hiddenMemory={
              <div className="p-2 text-charcoal">
                <p className="font-mono text-xs uppercase opacity-50 mb-1 italic text-blue-800">Found Note:</p>
                <p className="font-serif italic text-blue-900">"We actually broke the oscilloscope right after this photo was taken. Don't tell Prof. Sharma."</p>
              </div>
            }
          />

          <ScrapbookNote x="70%" y="60%" rotate={8} persona="chaotic" width="200px" type="torn">
            BEST. TRIP. EVER.
          </ScrapbookNote>

          <ScrapbookPhoto
            src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=400&auto=format&fit=crop"
            alt="Last day photo"
            caption="The Final Sign-off"
            x="45%"
            y="70%"
            rotate={-2}
            width="320px"
            type="polaroid"
          />

          <ScrapbookNote x="10%" y="85%" rotate={-2} persona="artist" width="300px">
            ★ Class of 2025: Not just a year, a legacy ★
          </ScrapbookNote>

          {/* Small Doodles (Simulated with Text/Emoji for now) */}
          <div className="absolute top-[20%] left-[50%] text-4xl opacity-20 rotate-12 pointer-events-none text-burnt-sienna">
            ✎
          </div>
          <div className="absolute bottom-[15%] right-[10%] text-5xl opacity-20 -rotate-12 pointer-events-none text-heritage-navy">
            ♥
          </div>

        </ScrapbookPage>
      </div>
    </ScrapbookDesk>
  );
}

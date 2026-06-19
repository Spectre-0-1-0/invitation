import { Senior } from "@/types/archive";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";

export function SeniorSpotlight({ senior }: { senior: Senior }) {
  return (
    <Card variant="scrapbook" className="bg-heritage-navy text-white border-none p-1">
      <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[4/5] bg-white/10 rounded-sm overflow-hidden rotate-1">
           {senior.image && (
             <Image
               src={senior.image}
               alt={senior.name}
               fill
               className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
             />
           )}
        </div>
        <div>
           <div className="flex items-center gap-2 text-champagne-gold mb-6">
              <Star size={16} fill="currentColor" aria-hidden="true" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">Class Spotlight</span>
           </div>
           <Heading level={2} className="text-white text-5xl md:text-6xl mb-6">{senior.name}</Heading>
           <p className="text-parchment-base/70 text-lg mb-10 italic font-serif leading-relaxed">
              &quot;{senior.quote}&quot;
           </p>
           <div className="space-y-4 mb-10">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-champagne-gold">Key Highlights</h4>
              <ul className="grid grid-cols-1 gap-3">
                 {senior.memoryHighlights?.map((h, i) => (
                   <li key={i} className="text-sm flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-champagne-gold mt-2 flex-shrink-0" />
                      <span className="text-parchment-base/80">{h}</span>
                   </li>
                 ))}
                 {(!senior.memoryHighlights || senior.memoryHighlights.length === 0) && (
                   <li className="text-sm italic text-parchment-base/40">No highlights shared yet.</li>
                 )}
              </ul>
           </div>
           <Link
             href={`/seniors/${senior.id}`}
             className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-champagne-gold hover:text-white transition-colors group focus:outline-none focus:ring-2 focus:ring-champagne-gold focus:ring-offset-4 focus:ring-offset-heritage-navy rounded-sm"
           >
              View Full Profile <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
           </Link>
        </div>
      </div>
    </Card>
  );
}

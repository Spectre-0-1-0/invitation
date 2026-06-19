'use client';

import { useState, useEffect } from 'react';
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/animations/FadeIn";
import { EmptyState } from "@/components/shared/EmptyState";
import Link from "next/link";
import Image from "next/image";
import { Folder, Image as ImageIcon, Camera, Search } from "lucide-react";
import { Memory, GalleryAlbum } from "@/types/archive";
import { trackDiscovery } from "@/lib/analytics";

export default function GalleryClient({
  initialAlbums,
  initialMemories
}: {
  initialAlbums: GalleryAlbum[],
  initialMemories: Memory[]
}) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredMemories = initialMemories.filter(m => {
    const matchesFilter = filter === 'All' || m.category.toLowerCase() === filter.toLowerCase();
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
                         m.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    if (search.length > 2) {
      const timer = setTimeout(() => {
        trackDiscovery('search', { query: search, resultsCount: filteredMemories.length, type: 'gallery' });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [search, filteredMemories.length]);

  const categories = ['All', 'Candids', 'Events', 'Milestones'];

  return (
    <div className="space-y-32">
      {/* Albums Section */}
      <section aria-labelledby="curated-collections-heading">
        <FadeIn>
          <h2 id="curated-collections-heading" className="text-xs font-mono uppercase tracking-[0.4em] text-champagne-gold mb-10 flex items-center gap-3">
            <Folder size={14} aria-hidden="true" /> Curated Collections
          </h2>
        </FadeIn>
        {initialAlbums.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {initialAlbums.map((album, i) => (
              <FadeIn key={album.id} delay={i * 0.1}>
                <Link
                  href={`/gallery/event/${album.id}`}
                  className="group block rounded-md focus:outline-none focus:ring-2 focus:ring-champagne-gold focus:ring-offset-8"
                  aria-label={`View collection: ${album.title}`}
                >
                  <Card variant="scrapbook" className="p-3 bg-white">
                    <div className="relative aspect-[16/10] bg-parchment-muted overflow-hidden">
                       <div className="absolute inset-0 bg-heritage-navy/20 group-hover:bg-heritage-navy/10 transition-colors duration-500 z-10" />
                       <div className="absolute inset-0 flex items-center justify-center z-20">
                          <Camera className="text-white/20 group-hover:scale-110 transition-transform duration-500" size={48} aria-hidden="true" />
                       </div>
                       {album.coverImage && (
                         <Image
                           src={album.coverImage}
                           alt=""
                           fill
                           className="object-cover"
                         />
                       )}
                    </div>
                    <div className="mt-6 px-2 pb-2">
                      <h3 className="font-serif text-2xl text-heritage-navy group-hover:text-champagne-gold transition-colors">{album.title}</h3>
                      <p className="text-[10px] font-mono uppercase tracking-widest mt-2 text-charcoal-muted">
                         {album.memoryIds.length} Captured Moments
                      </p>
                    </div>
                  </Card>
                </Link>
              </FadeIn>
            ))}
          </div>
        ) : (
          <EmptyState title="No collections yet" message="Curated albums will appear here soon." />
        )}
      </section>

      {/* All Memories Grid */}
      <section aria-labelledby="open-archive-heading">
         <FadeIn>
           <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 border-b border-parchment-dark pb-6 gap-8">
              <div>
                <h2 id="open-archive-heading" className="text-xs font-mono uppercase tracking-[0.4em] text-champagne-gold flex items-center gap-3">
                  <ImageIcon size={14} aria-hidden="true" /> The Open Archive
                </h2>
                <p className="text-charcoal-muted text-xs mt-2 italic">A chronological stream of our shared days.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="relative w-full sm:w-64">
                  <label htmlFor="gallery-search" className="sr-only">Search memories</label>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-muted/40 w-3 h-3" aria-hidden="true" />
                  <input
                    id="gallery-search"
                    type="text"
                    placeholder="Search memories..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/50 border border-parchment-muted rounded-full focus:outline-none focus:ring-2 focus:ring-champagne-gold transition-all text-[10px] font-bold uppercase tracking-widest"
                  />
                </div>

                <nav className="flex gap-6 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto" aria-label="Filter memories by category">
                   {categories.map((cat) => (
                     <button
                       key={cat}
                       onClick={() => {
                         setFilter(cat);
                         trackDiscovery('filter', { category: cat });
                       }}
                       aria-pressed={filter === cat}
                       className={`text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-champagne-gold focus:ring-offset-4 ${
                         filter === cat
                           ? 'text-heritage-navy border-b-2 border-heritage-navy pb-1'
                           : 'text-charcoal-muted hover:text-heritage-navy pb-1'
                       }`}
                     >
                       {cat}
                     </button>
                   ))}
                </nav>
              </div>
           </div>
         </FadeIn>

         <div role="region" aria-live="polite" aria-label="Gallery search results">
           {filteredMemories.length > 0 ? (
             <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
                {filteredMemories.map((memory, i) => (
                  <FadeIn key={memory.id} delay={i * 0.05}>
                    <Link
                      href={`/gallery/${memory.id}`}
                      onClick={() => trackDiscovery('memory_view', { memoryId: memory.id, title: memory.title })}
                      className="group block rounded-md focus:outline-none focus:ring-2 focus:ring-champagne-gold focus:ring-offset-8"
                      aria-label={`View memory: ${memory.title}`}
                    >
                      <Card variant="polaroid" className="group cursor-pointer">
                        <div className="aspect-auto bg-parchment-muted overflow-hidden relative min-h-[200px]">
                           <Image
                             src={memory.url}
                             alt=""
                             width={400}
                             height={600}
                             className="w-full h-auto object-cover"
                           />
                           <div className="absolute inset-0 bg-heritage-navy/0 group-hover:bg-heritage-navy/5 transition-colors duration-500" aria-hidden="true" />
                        </div>
                        <div className="mt-4 px-1">
                          <div className="flex justify-between items-center mb-2">
                            <Badge variant="outline" className="text-[9px] py-0 border-parchment-dark">{memory.category}</Badge>
                            <span className="text-[9px] font-mono text-charcoal-muted opacity-60">{new Date(memory.date).toLocaleDateString()}</span>
                          </div>
                          <h4 className="font-serif text-base text-heritage-navy group-hover:text-champagne-gold transition-colors leading-tight">
                            {memory.title}
                          </h4>
                        </div>
                      </Card>
                    </Link>
                  </FadeIn>
                ))}
             </div>
           ) : (
             <EmptyState
               title="No memories found"
               message={`We couldn't find any memories matching "${search}" in the ${filter} category.`}
             />
           )}
         </div>
      </section>
    </div>
  );
}

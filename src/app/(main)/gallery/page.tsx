import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { getAlbums, getMemories } from "@/lib/data-fetcher";
import Link from "next/link";
import { Folder } from "lucide-react";

export const metadata = { title: "Memory Gallery" };

export default async function GalleryPage() {
  const albums = await getAlbums();
  const memories = await getMemories();

  return (
    <Section>
      <Container>
        <Heading level={1} className="mb-12">Memory Gallery</Heading>

        <div className="space-y-20">
          {/* Albums Section */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-champagne-gold mb-8 flex items-center gap-2">
              <Folder size={14} /> Featured Albums
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {albums.map((album) => (
                <Link key={album.id} href={`/gallery/album/${album.id}`} className="group">
                  <div className="relative aspect-[16/10] bg-parchment-muted rounded-md overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                     <div className="absolute inset-0 bg-heritage-navy/20 group-hover:bg-heritage-navy/10 transition-colors" />
                     <div className="absolute bottom-6 left-6 text-white">
                        <h3 className="font-serif text-2xl">{album.title}</h3>
                        <p className="text-xs font-mono uppercase tracking-widest mt-1 opacity-80">
                           {album.memoryIds.length} Memories
                        </p>
                     </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* All Memories Masonry-style Grid */}
          <div>
             <div className="flex items-end justify-between mb-8 border-b pb-4">
                <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-champagne-gold">All Moments</h2>
                <div className="flex gap-4">
                   <button className="text-[10px] font-bold uppercase tracking-widest text-heritage-navy border-b-2 border-heritage-navy">All</button>
                   <button className="text-[10px] font-bold uppercase tracking-widest text-charcoal-muted hover:text-heritage-navy transition-colors">Candids</button>
                   <button className="text-[10px] font-bold uppercase tracking-widest text-charcoal-muted hover:text-heritage-navy transition-colors">Events</button>
                </div>
             </div>

             <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {memories.map((memory) => (
                  <div key={memory.id} className="break-inside-avoid bg-white p-2 rounded-md shadow-sm group cursor-pointer hover:shadow-md transition-all border border-parchment-muted">
                    <div className="aspect-auto rounded-sm bg-parchment-muted overflow-hidden relative min-h-[200px]">
                       <div className="absolute inset-0 bg-heritage-navy/0 group-hover:bg-heritage-navy/5 transition-colors" />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-[10px] py-0">{memory.category}</Badge>
                        <span className="text-[10px] font-mono text-charcoal-muted">{memory.date}</span>
                      </div>
                      <h4 className="font-serif text-lg text-heritage-navy group-hover:text-champagne-gold transition-colors">
                        {memory.title}
                      </h4>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
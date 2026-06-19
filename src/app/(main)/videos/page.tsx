import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/animations/FadeIn";
import { PlayCircle, Film } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata = {
  title: "Video Archive",
  description: "Cinematic glimpses into the Class of 2025 journey."
};

export default function VideosPage() {
  // In a real app, this would come from getMemories() filtered by type: 'video'
  const videos: any[] = [];

  return (
    <Section className="pt-20">
      <Container>
        <div className="flex flex-col items-center text-center mb-24">
          <FadeIn>
            <div className="p-4 bg-heritage-navy text-white rounded-full mb-8 shadow-xl shadow-heritage-navy/20 inline-block">
              <Film size={28} />
            </div>
            <Heading level={1} className="text-5xl md:text-7xl mb-8">Cinematic <span className="italic font-light">Archive</span></Heading>
            <p className="text-lg md:text-xl text-charcoal-muted max-w-2xl mx-auto font-serif italic">
               Moving memories and shared laughter. Relive our journey through
               the cinematic lens of the Class of 2025.
            </p>
          </FadeIn>
        </div>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {videos.map((video, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="group cursor-pointer">
                  <div className="aspect-video bg-heritage-navy rounded-md relative overflow-hidden mb-6 flex items-center justify-center border-4 border-white shadow-polaroid rotate-1 group-hover:rotate-0 transition-all duration-500">
                     <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                     <PlayCircle size={64} className="text-white relative z-10 opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all" />
                     <div className="absolute bottom-4 right-4 bg-black/60 text-white text-[10px] px-2 py-1 rounded-sm font-mono">
                        {video.duration}
                     </div>
                  </div>
                  <div className="flex justify-between items-start px-2">
                    <div>
                       <Badge variant="outline" className="mb-3 text-[10px] uppercase tracking-widest">{video.category}</Badge>
                       <h3 className="font-serif text-2xl text-heritage-navy group-hover:text-champagne-gold transition-colors">{video.title}</h3>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        ) : (
          <FadeIn>
             <EmptyState
               title="The film reel is empty"
               message="Video memories are currently being processed and will be added to the archive shortly."
               icon={<Film size={40} />}
             />
          </FadeIn>
        )}
      </Container>
    </Section>
  );
}

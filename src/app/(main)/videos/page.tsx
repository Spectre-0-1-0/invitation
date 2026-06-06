import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { PlayCircle, Film } from "lucide-react";

export const metadata = { title: "Video Archive" };

export default function VideosPage() {
  const videos = [
    { title: "Freshman Orientation Recap", category: "Milestone", duration: "3:45" },
    { title: "Senior Week Highlights", category: "Event", duration: "12:20" },
    { title: "The 2024 Charity Gala", category: "Event", duration: "5:12" },
  ];

  return (
    <Section>
      <Container>
        <div className="flex flex-col items-center text-center mb-16">
          <div className="p-3 bg-heritage-navy text-white rounded-full mb-6">
            <Film size={24} />
          </div>
          <Heading level={1}>Video Archive</Heading>
          <p className="mt-4 text-charcoal-muted max-w-xl">
            Cinematic glimpses into our shared journey.
            From the nervous first days to the triumphant final celebrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {videos.map((video, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-video bg-heritage-navy rounded-md relative overflow-hidden mb-6 flex items-center justify-center">
                 {/* Video Placeholder */}
                 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                 <PlayCircle size={64} className="text-white relative z-10 opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all" />
                 <div className="absolute bottom-4 right-4 bg-black/60 text-white text-[10px] px-2 py-1 rounded-sm font-mono">
                    {video.duration}
                 </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                   <Badge variant="outline" className="mb-2 text-[10px]">{video.category}</Badge>
                   <h3 className="font-serif text-2xl text-heritage-navy group-hover:text-champagne-gold transition-colors">{video.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

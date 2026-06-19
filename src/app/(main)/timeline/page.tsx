import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/animations/FadeIn";
import { getTimeline } from "@/lib/data-fetcher";
import { Milestone, Compass, GraduationCap } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata = {
  title: "The Timeline",
  description: "A chronological journey of the Class of 2025 milestones."
};

export default async function TimelinePage() {
  const timeline = await getTimeline();

  return (
    <Section className="relative min-h-screen pt-20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-parchment-dark via-champagne-gold/20 to-parchment-dark hidden md:block" />

      <Container className="relative z-10">
        <div className="text-center mb-32">
           <FadeIn>
             <span className="text-xs font-mono uppercase tracking-[0.3em] text-champagne-gold mb-6 block font-bold">The Journey</span>
             <Heading level={1} className="text-5xl md:text-7xl mb-8">Our <span className="italic font-light">Milestones</span></Heading>
             <p className="text-lg md:text-xl text-charcoal-muted max-w-2xl mx-auto font-serif italic">
                From the first day of orientation to the final signature on our thesis.
                Relive the moments that defined our four years together.
             </p>
           </FadeIn>
        </div>

        {timeline.length > 0 ? (
          <div className="relative">
            {timeline.map((event, index) => (
              <div
                key={event.id}
                className={`flex flex-col md:flex-row gap-8 items-center mb-32 md:mb-48 last:mb-0 ${
                  index % 2 === 0 ? "" : "md:flex-row-reverse"
                }`}
              >
                <div className="w-full md:w-[45%]">
                  <FadeIn direction={index % 2 === 0 ? "right" : "left"}>
                    <div className="group relative">
                      <div className="absolute -inset-4 bg-champagne-gold/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                      <div className="relative p-10 bg-white rounded-md shadow-scrapbook border border-parchment-muted overflow-hidden">
                         <div className="absolute top-0 left-0 w-2 h-full bg-heritage-navy opacity-10" />
                         <Badge variant="secondary" className="mb-6 font-bold uppercase tracking-widest">{event.period}</Badge>
                         <h2 className="font-serif text-3xl mb-6 text-heritage-navy leading-tight">{event.milestone}</h2>
                         <p className="text-charcoal-muted leading-relaxed text-lg">{event.description}</p>
                      </div>
                    </div>
                  </FadeIn>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-heritage-navy border-8 border-parchment-base flex items-center justify-center text-white hidden md:flex z-20 shadow-xl">
                   {event.importance === "major" ? <Milestone size={18} /> : <Compass size={18} />}
                </div>

                <div className="hidden md:block md:w-[45%]" />
              </div>
            ))}

            <div className="flex justify-center mt-20">
               <FadeIn delay={0.5}>
                 <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-champagne-gold flex items-center justify-center text-heritage-navy shadow-2xl">
                       <GraduationCap size={32} />
                    </div>
                    <Heading level={3} className="text-center">Convocation Day</Heading>
                    <p className="text-sm font-mono uppercase tracking-[0.2em] text-charcoal-muted">June 2025</p>
                 </div>
               </FadeIn>
            </div>
          </div>
        ) : (
          <FadeIn>
            <EmptyState
              title="The Road Ahead"
              message="The timeline is currently being plotted. Our history is just getting started."
              icon={<Compass size={40} />}
            />
          </FadeIn>
        )}
      </Container>
    </Section>
  );
}

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { getTimeline } from "@/lib/data-fetcher";
import { Calendar } from "lucide-react";

export const metadata = { title: "The Timeline" };

export default async function TimelinePage() {
  const timeline = await getTimeline();

  return (
    <Section className="relative min-h-screen">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-parchment-muted hidden md:block" />
      <Container className="relative z-10">
        <div className="text-center mb-24">
           <Heading level={1}>The Timeline</Heading>
           <p className="mt-4 text-charcoal-muted">Four years of milestones, condensed into moments.</p>
        </div>

        <div className="relative">
          {timeline.map((event, index) => (
            <div
              key={event.id}
              className={`flex flex-col md:flex-row gap-8 items-center mb-16 md:mb-32 last:mb-0 ${
                index % 2 === 0 ? "" : "md:flex-row-reverse"
              }`}
            >
              <div className="w-full md:w-[45%]">
                <div className="p-8 bg-white rounded-md shadow-sm border border-parchment-muted relative group hover:border-champagne-gold transition-colors">
                   <Badge variant="secondary" className="mb-4">{event.period}</Badge>
                   <h2 className="font-serif text-2xl mb-4 text-heritage-navy">{event.title}</h2>
                   <p className="text-charcoal-muted leading-relaxed">{event.description}</p>
                </div>
              </div>

              <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-heritage-navy border-4 border-parchment-base flex items-center justify-center text-white hidden md:flex z-20">
                 <Calendar size={16} />
              </div>

              <div className="hidden md:block md:w-[45%]" />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

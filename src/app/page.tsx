import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { Camera, Users, MessageCircle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const previews = [
    {
      title: "The Seniors",
      description: "Meet the individuals who defined our journey.",
      icon: <Users className="w-6 h-6" />,
      link: "/seniors",
      color: "bg-heritage-navy/5",
    },
    {
      title: "Memory Gallery",
      description: "A visual archive of our best moments together.",
      icon: <Camera className="w-6 h-6" />,
      link: "/gallery",
      color: "bg-champagne-gold/10",
    },
    {
      title: "The Timeline",
      description: "Revisiting the milestones of our college years.",
      icon: <Calendar className="w-6 h-6" />,
      link: "/timeline",
      color: "bg-burnt-sienna/10",
    },
    {
      title: "Message Wall",
      description: "Farewells, wisdom, and words of appreciation.",
      icon: <MessageCircle className="w-6 h-6" />,
      link: "/messages",
      color: "bg-heritage-navy/5",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <Section className="min-h-[90vh] flex items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-champagne-gold/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-heritage-navy/5 blur-3xl" />

        <Container className="relative z-10 text-center">
          <span className="text-xs md:text-sm font-mono tracking-[0.3em] uppercase text-champagne-gold mb-6 block">
            The Digital Legacy of
          </span>
          <Heading level={1} className="leading-[1.1] md:text-8xl">
            Class of <span className="text-heritage-navy italic font-light">2025</span>
          </Heading>
          <p className="mt-8 text-lg md:text-xl text-charcoal-muted max-w-2xl mx-auto leading-relaxed">
            Four years, thousands of memories, and a lifelong bond.
            Welcome to the sanctuary of our collective story.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/gallery">
              <Button size="lg" className="w-full sm:w-auto">Explore Archive</Button>
            </Link>
            <Link href="/tribute">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">Watch Tribute</Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Journey Preview Grid */}
      <Section variant="muted">
        <Container>
          <div className="text-center mb-16">
            <Heading level={2}>Revisit the Journey</Heading>
            <p className="mt-4 text-charcoal-muted">Choose a path to begin your exploration</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {previews.map((item) => (
              <Link key={item.link} href={item.link}>
                <Card className="h-full group hover:border-champagne-gold transition-all duration-300">
                  <div className={cn("p-8 h-full flex flex-col", item.color)}>
                    <div className="p-3 bg-white rounded-md w-fit shadow-sm text-heritage-navy group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h3 className="mt-6 text-xl font-serif text-heritage-navy">{item.title}</h3>
                    <p className="mt-2 text-sm text-charcoal-muted leading-relaxed">
                      {item.description}
                    </p>
                    <div className="mt-auto pt-6 flex items-center text-xs font-bold uppercase tracking-wider text-heritage-navy group-hover:text-champagne-gold transition-colors">
                      View Section &rarr;
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* Featured Quote */}
      <Section>
        <Container className="text-center">
          <div className="max-w-4xl mx-auto">
            <span className="text-6xl font-serif text-champagne-gold opacity-50 block mb-4">&ldquo;</span>
            <p className="text-2xl md:text-4xl font-serif text-heritage-navy italic leading-snug">
              We didn&apos;t realize we were making memories, <br className="hidden md:block" />
              we just knew we were having fun.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="h-[1px] w-12 bg-parchment-muted" />
              <span className="font-mono text-xs uppercase tracking-widest text-charcoal-muted">Our Collective Philosophy</span>
              <div className="h-[1px] w-12 bg-parchment-muted" />
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

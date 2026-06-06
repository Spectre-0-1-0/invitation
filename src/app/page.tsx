import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/animations/FadeIn";
import Link from "next/link";
import { Camera, Users, MessageCircle, Calendar, ArrowRight, Heart } from "lucide-react";
import { getMemories } from "@/lib/data-fetcher";

export default async function Home() {
  const memories = await getMemories();
  const featuredMemory = memories.find(m => m.featured);

  const previews = [
    {
      title: "The Seniors",
      description: "Meet the individuals who defined our journey.",
      icon: <Users className="w-5 h-5" />,
      link: "/seniors",
      color: "text-heritage-navy",
    },
    {
      title: "Memory Gallery",
      description: "A visual archive of our best moments.",
      icon: <Camera className="w-5 h-5" />,
      link: "/gallery",
      color: "text-champagne-gold",
    },
    {
      title: "The Timeline",
      description: "The milestones that marked our growth.",
      icon: <Calendar className="w-5 h-5" />,
      link: "/timeline",
      color: "text-burnt-sienna",
    },
    {
      title: "Message Wall",
      description: "Words of wisdom and heartfelt farewells.",
      icon: <MessageCircle className="w-5 h-5" />,
      link: "/messages",
      color: "text-heritage-navy",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Immersive Hero Section */}
      <Section className="min-h-screen flex items-center relative overflow-hidden pt-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#D4AF3710_0%%,_transparent_40%%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_#1A2B4808_0%%,_transparent_40%%)]" />

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn delay={0.2}>
              <span className="text-xs md:text-sm font-mono tracking-[0.4em] uppercase text-champagne-gold mb-8 block font-bold">
                Established 2021 &bull; Class of 2025
              </span>
            </FadeIn>

            <FadeIn delay={0.4}>
              <Heading level={1} className="text-6xl md:text-[9rem] leading-[0.9] tracking-tighter mb-8">
                Our <span className="font-light italic">Story</span> <br />
                <span className="text-heritage-navy">Starts Here.</span>
              </Heading>
            </FadeIn>

            <FadeIn delay={0.6}>
              <p className="mt-10 text-xl md:text-2xl text-charcoal-muted max-w-2xl mx-auto leading-relaxed font-serif italic">
                Four years of laughter, late nights, and lifelong bonds.
                This is our digital sanctuary. Welcome home.
              </p>
            </FadeIn>

            <FadeIn delay={0.8} className="mt-16 flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/gallery">
                <Button size="lg" className="w-full sm:w-auto px-10 shadow-xl shadow-heritage-navy/20">
                  Enter the Archive
                </Button>
              </Link>
              <Link href="/tribute">
                <Button size="lg" variant="ghost" className="w-full sm:w-auto group">
                  Watch Final Tribute <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </FadeIn>
          </div>
        </Container>

        {/* Scroll Indicator */}
        <FadeIn delay={1.2} className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block">
           <div className="flex flex-col items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-charcoal-muted/40">
              <span>Scroll to Begin</span>
              <div className="w-px h-12 bg-gradient-to-b from-charcoal-muted/40 to-transparent" />
           </div>
        </FadeIn>
      </Section>

      {/* Narrative Spotlight */}
      <Section className="bg-white border-y border-parchment-muted overflow-hidden">
        <Container>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <FadeIn direction="right">
                 <div className="relative">
                    <Card variant="polaroid" className="max-w-md mx-auto relative z-10">
                       <div className="aspect-[4/5] bg-parchment-muted" />
                    </Card>
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-champagne-gold/5 rounded-full blur-3xl -z-10" />
                    <div className="absolute -bottom-10 -left-10 p-6 bg-heritage-navy text-white rounded-md shadow-2xl z-20 max-w-[200px] -rotate-6">
                       <p className="text-xs font-serif italic font-light">&quot;The first day we met in the quad. We had no idea what was coming.&quot;</p>
                    </div>
                 </div>
              </FadeIn>

              <FadeIn direction="left" delay={0.2}>
                 <span className="text-xs font-mono uppercase tracking-[0.2em] text-champagne-gold mb-4 block">The Memory Spotlight</span>
                 <Heading level={2} className="text-5xl md:text-6xl mb-8 leading-tight">A collection of <br /> shared history.</Heading>
                 <p className="text-lg text-charcoal-muted leading-relaxed mb-10">
                    From the high-stakes finals weeks to the midnight pizza runs,
                    every moment was a brushstroke on the canvas of our college experience.
                    We haven&apos;t just collected photos; we&apos;ve archived our growth.
                 </p>
                 <Link href="/timeline" className="inline-flex items-center gap-3 text-heritage-navy font-bold uppercase tracking-widest text-xs hover:text-champagne-gold transition-colors group">
                    View our full timeline <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                 </Link>
              </FadeIn>
           </div>
        </Container>
      </Section>

      {/* Module Navigation Grid */}
      <Section variant="muted">
        <Container>
          <div className="text-center mb-20">
            <FadeIn>
               <Heading level={2} className="text-4xl md:text-5xl">Explore the Legacy</Heading>
               <p className="mt-4 text-charcoal-muted">Every corner of this site holds a piece of us.</p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {previews.map((item, i) => (
              <FadeIn key={item.link} delay={i * 0.1}>
                <Link href={item.link}>
                  <Card className="h-full group hover:shadow-xl transition-all duration-500 border-none bg-white p-1">
                    <div className="p-8 h-full flex flex-col items-center text-center">
                      <div className={cn("p-4 bg-parchment-base rounded-full mb-6 group-hover:scale-110 transition-transform duration-500", item.color)}>
                        {item.icon}
                      </div>
                      <h3 className="text-xl font-serif text-heritage-navy mb-3">{item.title}</h3>
                      <p className="text-sm text-charcoal-muted leading-relaxed mb-6">
                        {item.description}
                      </p>
                      <div className="mt-auto text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal-muted group-hover:text-champagne-gold transition-colors flex items-center gap-2">
                        Open Section <ArrowRight size={10} />
                      </div>
                    </div>
                  </Card>
                </Link>
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>

      {/* The Final Word */}
      <Section className="relative py-32 md:py-48 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
        <Container className="text-center relative z-10">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <Heart className="mx-auto text-burnt-sienna mb-10 opacity-20" size={40} />
              <p className="text-3xl md:text-5xl font-serif text-heritage-navy italic leading-tight mb-12">
                &quot;We leave these halls not just as graduates, but as the authors of a shared story that will never truly end.&quot;
              </p>
              <div className="h-[1px] w-24 bg-champagne-gold/30 mx-auto mb-12" />
              <Link href="/tribute">
                 <Button variant="outline" size="lg" className="px-16 border-champagne-gold text-heritage-navy hover:bg-champagne-gold hover:text-white">Visit the Final Tribute</Button>
              </Link>
            </div>
          </FadeIn>
        </Container>
      </Section>
    </div>
  );
}

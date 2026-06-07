import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/animations/FadeIn";
import { getMessages, getSeniors } from "@/lib/data-fetcher";
import { MessageSquareQuote, Heart, Laugh, Star, Send } from "lucide-react";

export const metadata = { title: "Message Wall" };

export default async function MessagesPage() {
  const messages = await getMessages();
  const seniors = await getSeniors();

  const getCategoryIcon = (category: string | null) => {
    switch (category) {
      case 'funny': return <Laugh size={14} />;
      case 'thank-you': return <Heart size={14} />;
      case 'appreciation': return <Star size={14} />;
      default: return <Send size={14} />;
    }
  };

  return (
    <Section variant="muted" className="pt-20">
      <Container>
        <div className="flex flex-col items-center text-center mb-24">
          <FadeIn>
            <div className="p-4 bg-heritage-navy text-white rounded-full mb-8 shadow-xl shadow-heritage-navy/20">
              <MessageSquareQuote size={28} />
            </div>
            <Heading level={1} className="text-5xl md:text-7xl mb-8">Words of <span className="italic font-light">Wisdom</span></Heading>
            <p className="text-lg md:text-xl text-charcoal-muted max-w-2xl mx-auto font-serif italic">
               A living collection of farewells, inside jokes, and heartfelt gratitude.
               The words that will echo long after we leave these halls.
            </p>
          </FadeIn>

          <FadeIn delay={0.2} className="mt-12 flex flex-wrap justify-center gap-3">
             {['All Messages', 'Thank You', 'Funny', 'Farewell', 'Appreciation'].map((cat, i) => (
               <button key={i} className="px-6 py-2 bg-white border border-parchment-dark/30 rounded-full text-[10px] font-bold uppercase tracking-widest text-charcoal-muted hover:border-champagne-gold hover:text-heritage-navy transition-all shadow-sm">
                  {cat}
               </button>
             ))}
          </FadeIn>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-10 space-y-10">
          {messages.map((message, i) => {
            const target = message.targetId ? seniors.find(s => s.id === message.targetId) : null;

            return (
              <FadeIn key={message.id} delay={i * 0.05}>
                <div className="break-inside-avoid bg-white p-10 rounded-md shadow-scrapbook border border-parchment-muted flex flex-col relative group hover:border-champagne-gold transition-all duration-500">
                  <div className="absolute top-6 right-8 text-6xl font-serif text-champagne-gold/10 select-none group-hover:text-champagne-gold/20 transition-colors">&rdquo;</div>

                  <div className="flex items-center gap-2 mb-6">
                    <Badge variant="outline" className="flex items-center gap-1.5 text-[9px] py-1 px-3 border-parchment-dark/50 text-charcoal-muted">
                      {getCategoryIcon(message.category)}
                      {message.category?.replace('-', ' ') || 'Message'}
                    </Badge>
                    {target && (
                      <Badge variant="secondary" className="text-[9px] py-1 px-3 font-bold">
                        To: {target.name}
                      </Badge>
                    )}
                  </div>

                  <p className="text-heritage-navy leading-relaxed font-serif text-xl italic mb-10">
                    &quot;{message.content}&quot;
                  </p>

                  <div className="mt-auto pt-8 border-t border-parchment-muted flex justify-between items-end">
                    <div>
                      <span className="block text-sm font-bold text-heritage-navy tracking-tight">{message.fromName}</span>
                      {message.relationship && (
                        <span className="block text-[10px] font-mono uppercase tracking-widest text-charcoal-muted mt-1 opacity-70">{message.relationship}</span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-charcoal-muted opacity-40 uppercase tracking-tighter">
                      {new Date(message.timestamp).getFullYear()}
                    </span>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

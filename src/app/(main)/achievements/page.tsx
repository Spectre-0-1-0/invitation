import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/animations/FadeIn";
import { getAchievements, getSeniors } from "@/lib/data-fetcher";
import { Trophy, Award, Star, Rocket, FlaskConical, Users, Medal } from "lucide-react";

export const metadata = {
  title: "Excellence & Honors",
  description: "Celebrating the academic and personal achievements of the Class of 2025."
};

export default async function AchievementsPage() {
  const achievements = await getAchievements();
  const seniors = await getSeniors();

  const getIcon = (category: string) => {
    switch (category) {
      case 'academic': return <Award size={24} />;
      case 'placement': return <Rocket size={24} />;
      case 'research': return <FlaskConical size={24} />;
      case 'club': return <Users size={24} />;
      case 'sports': return <Medal size={24} />;
      default: return <Trophy size={24} />;
    }
  };

  return (
    <Section className="pt-20">
      <Container>
        <div className="flex flex-col items-center text-center mb-24">
          <FadeIn>
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-champagne-gold mb-6 block font-bold">The Hall of Fame</span>
            <Heading level={1} className="text-5xl md:text-7xl mb-8">Excellence & <span className="italic font-light">Honors</span></Heading>
            <p className="text-lg md:text-xl text-charcoal-muted max-w-2xl mx-auto font-serif italic">
               Celebrating the hard-won victories, academic milestones, and outstanding
               contributions that brought pride to the Class of 2025.
            </p>
          </FadeIn>
        </div>

        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {achievements.map((achievement, i) => {
              const recipient = seniors.find(s => s.id === achievement.recipientId);

              return (
                <FadeIn key={achievement.id} delay={i * 0.1}>
                  <div className="p-10 border border-parchment-dark/30 bg-white shadow-scrapbook rounded-md flex flex-col md:flex-row gap-8 group hover:border-champagne-gold transition-all duration-500">
                    <div className="p-5 bg-parchment-muted rounded-full h-fit w-fit text-heritage-navy group-hover:bg-heritage-navy group-hover:text-white transition-all duration-500 flex-shrink-0">
                      {getIcon(achievement.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="secondary" className="font-bold">{achievement.category}</Badge>
                        <span className="text-[10px] font-mono text-charcoal-muted opacity-60 uppercase tracking-widest">{achievement.date}</span>
                      </div>
                      <h2 className="font-serif text-2xl text-heritage-navy mb-4 leading-tight group-hover:text-champagne-gold transition-colors">{achievement.title}</h2>
                      <p className="text-sm text-charcoal-muted leading-relaxed mb-6 italic">
                         {achievement.description}
                      </p>
                      <div className="pt-6 border-t border-parchment-muted flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-heritage-navy">
                        <Star size={12} className="text-champagne-gold fill-champagne-gold" aria-hidden="true" />
                        <span>Recipient: <span className="text-heritage-navy">{recipient?.name || achievement.recipientId}</span></span>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
             <FadeIn>
               <div className="py-24 text-center border-2 border-dashed border-parchment-dark/20 rounded-xl bg-white/30">
                  <Trophy size={48} className="mx-auto text-parchment-dark mb-6" />
                  <p className="text-charcoal-muted font-serif italic text-lg">&quot;Excellence is a journey, and our hall of fame is still being written.&quot;</p>
               </div>
             </FadeIn>
          </div>
        )}
      </Container>
    </Section>
  );
}

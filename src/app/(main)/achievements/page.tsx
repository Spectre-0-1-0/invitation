import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/animations/FadeIn";
import { getSeniors } from "@/lib/data-fetcher";
import { Trophy, Award, Star, Rocket, FlaskConical, Users, Medal } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata = {
  title: "Excellence & Honors",
  description: "Celebrating the academic and personal achievements of the Class of 2025."
};

export default async function AchievementsPage() {
  const seniors = await getSeniors();

  // Aggregate achievements from seniors
  // Casting to any to handle Prisma's dynamic return type in this context
  const achievements = seniors.flatMap((senior: any) =>
    (senior.achievements || []).map((text: string, i: number) => ({
      id: `${senior.id}-ach-${i}`,
      title: text,
      recipientName: senior.name,
      recipientSlug: senior.slug,
      category: 'academic'
    }))
  );

  const getIcon = (category: string) => {
    switch (category) {
      case 'academic': return <Award size={24} />;
      case 'placement': return <Rocket size={24} />;
      case 'research': return <FlaskConical size={24} />;
      case 'club': return <Users size={24} />;
      case 'sports': return <Medal size={24} />;
      default: return <Star size={24} />;
    }
  };

  return (
    <Section className="pt-20">
      <Container>
        <div className="flex flex-col items-center text-center mb-32">
          <FadeIn>
             <div className="p-4 bg-champagne-gold text-white rounded-full mb-8 shadow-xl shadow-champagne-gold/20 inline-block">
               <Trophy size={28} />
             </div>
             <Heading level={1} className="text-5xl md:text-7xl mb-8">Honors & <span className="italic font-light">Excellence</span></Heading>
             <p className="text-lg md:text-xl text-charcoal-muted max-w-2xl mx-auto font-serif italic">
                A celebration of individual triumphs and collective progress.
                The milestones that marked our growth and dedication.
             </p>
          </FadeIn>
        </div>

        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {achievements.map((achievement, i) => (
              <FadeIn key={achievement.id} delay={i * 0.1}>
                <div className="bg-white p-10 rounded-md shadow-scrapbook border border-parchment-muted flex gap-8 items-start hover:border-champagne-gold transition-colors duration-500 group">
                  <div className="p-4 bg-parchment-base text-champagne-gold rounded-lg group-hover:scale-110 transition-transform duration-500">
                    {getIcon(achievement.category)}
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-4 text-[9px] uppercase tracking-widest border-parchment-dark/50">{achievement.category}</Badge>
                    <h3 className="font-serif text-2xl text-heritage-navy mb-4 leading-tight">{achievement.title}</h3>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-charcoal-muted">Recipient:</span>
                       <span className="text-sm font-bold text-heritage-navy">{achievement.recipientName}</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        ) : (
          <FadeIn>
            <EmptyState
              title="Excellence Unfolding"
              message="The hall of fame is currently preparing its displays. Our achievements are being carefully archived."
              icon={<Medal size={40} />}
            />
          </FadeIn>
        )}
      </Container>
    </Section>
  );
}

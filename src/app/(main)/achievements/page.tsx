import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { getAchievements, getSeniors } from "@/lib/data-fetcher";
import { Trophy, Award, Star } from "lucide-react";

export const metadata = { title: "Achievements" };

export default async function AchievementsPage() {
  const achievements = await getAchievements();
  const seniors = await getSeniors();

  return (
    <Section>
      <Container>
        <div className="flex flex-col items-center text-center mb-20">
          <div className="p-3 bg-champagne-gold text-heritage-navy rounded-full mb-6">
            <Trophy size={24} />
          </div>
          <Heading level={1}>Excellence & Honors</Heading>
          <p className="mt-4 text-charcoal-muted max-w-2xl">
            Recognizing the outstanding contributions, hard-won victories,
            and academic excellence of the Class of 2025.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {achievements.map((achievement) => {
            const recipient = seniors.find(s => s.id === achievement.recipientId);

            return (
              <div key={achievement.id} className="p-8 border bg-white shadow-sm rounded-md flex gap-6 group hover:border-champagne-gold transition-all">
                <div className="p-4 bg-parchment-muted rounded-md h-fit text-champagne-gold group-hover:bg-champagne-gold group-hover:text-white transition-colors">
                  <Award size={32} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary">{achievement.category}</Badge>
                    <span className="text-[10px] font-mono text-charcoal-muted">{achievement.date}</span>
                  </div>
                  <h2 className="font-serif text-2xl text-heritage-navy mt-1">{achievement.title}</h2>
                  <div className="mt-4 flex items-center gap-2 text-sm text-charcoal-muted">
                    <Star size={14} className="text-champagne-gold fill-champagne-gold" />
                    <span>Recipient: <span className="text-heritage-navy font-bold">{recipient?.name || achievement.recipientId}</span></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

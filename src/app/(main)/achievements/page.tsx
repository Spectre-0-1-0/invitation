import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { getAchievements, getSeniors } from "@/lib/data-fetcher";

export const metadata = { title: "Achievements" };

export default async function AchievementsPage() {
  const achievements = await getAchievements();
  const seniors = await getSeniors();

  return (
    <Section>
      <Container>
        <h1 className="font-serif text-4xl mb-12 text-heritage-navy text-center">Our Achievements</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {achievements.map((achievement) => {
            const recipient = seniors.find(s => s.id === achievement.recipientId);
            return (
              <div key={achievement.id} className="p-6 border bg-white shadow-sm rounded-md flex justify-between items-center">
                <div>
                  <span className="text-xs font-mono text-champagne-gold uppercase">{achievement.category}</span>
                  <h2 className="font-serif text-xl">{achievement.title}</h2>
                  <p className="text-sm text-charcoal-muted">Recipient: {recipient?.name || achievement.recipientId}</p>
                </div>
                <div className="text-right text-xs font-mono text-charcoal-muted">
                  {achievement.date}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

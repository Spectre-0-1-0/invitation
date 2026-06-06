import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { getMessages } from "@/lib/data-fetcher";

export const metadata = { title: "Message Wall" };

export default async function MessagesPage() {
  const messages = await getMessages();

  return (
    <Section>
      <Container>
        <h1 className="font-serif text-4xl mb-12 text-heritage-navy">Message Wall</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.map((message) => (
            <div key={message.id} className="p-6 bg-white border border-parchment-muted shadow-sm rounded-md">
              <p className="text-charcoal leading-relaxed">&quot;{message.content}&quot;</p>
              <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm">
                <span className="font-medium">{message.from}</span>
                {message.relationship && <span className="text-charcoal-muted text-xs italic">{message.relationship}</span>}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
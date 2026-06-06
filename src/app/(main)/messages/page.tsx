import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { getMessages, getSeniors } from "@/lib/data-fetcher";
import { MessageSquareQuote } from "lucide-react";

export const metadata = { title: "Message Wall" };

export default async function MessagesPage() {
  const messages = await getMessages();
  const seniors = await getSeniors();

  return (
    <Section variant="muted">
      <Container>
        <div className="flex flex-col items-center text-center mb-16">
          <div className="p-3 bg-heritage-navy text-white rounded-full mb-6">
            <MessageSquareQuote size={24} />
          </div>
          <Heading level={1}>Message Wall</Heading>
          <p className="mt-4 text-charcoal-muted max-w-xl">
            A digital collection of farewells, words of wisdom, and heartfelt notes
            exchanged as we prepare for our next chapters.
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {messages.map((message) => {
            const target = message.targetId ? seniors.find(s => s.id === message.targetId) : null;

            return (
              <div
                key={message.id}
                className="break-inside-avoid bg-white p-8 rounded-md shadow-sm border border-parchment-muted flex flex-col relative group hover:shadow-md transition-all"
              >
                <div className="absolute top-4 right-6 text-4xl font-serif text-champagne-gold/20 select-none">&rdquo;</div>

                {target && (
                  <Badge variant="outline" className="mb-4 w-fit text-[10px]">
                    To: {target.name}
                  </Badge>
                )}

                <p className="text-charcoal leading-relaxed font-serif text-lg italic">
                  &quot;{message.content}&quot;
                </p>

                <div className="mt-8 pt-6 border-t border-parchment-muted flex justify-between items-center">
                  <div>
                    <span className="block text-sm font-bold text-heritage-navy">{message.from}</span>
                    {message.relationship && (
                      <span className="block text-xs text-charcoal-muted mt-0.5">{message.relationship}</span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-charcoal-muted opacity-60">
                    {new Date(message.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

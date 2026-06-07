import { cn } from "@/lib/utils"

interface JournalBlockProps {
  content: string
  title?: string
  className?: string
}

export function JournalBlock({ content, title, className }: JournalBlockProps) {
  return (
    <div className={cn("max-w-2xl mx-auto", className)}>
      {title && (
        <h3 className="font-serif text-3xl mb-6 text-heritage-navy border-b border-parchment-dark/30 pb-4 inline-block">
          {title}
        </h3>
      )}
      <div className="space-y-6">
        {content.split('\n\n').map((paragraph, i) => (
          <p
            key={i}
            className="text-lg md:text-xl text-charcoal-muted leading-relaxed font-serif italic first-letter:text-5xl first-letter:font-bold first-letter:text-heritage-navy first-letter:mr-3 first-letter:float-left first-letter:mt-1"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  )
}

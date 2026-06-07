import { cn } from "@/lib/utils"
import { Container } from "@/components/layout/Container"

interface ScrapbookSectionProps {
  children: React.ReactNode
  className?: string
  bgTexture?: boolean
}

export function ScrapbookSection({ children, className, bgTexture = true }: ScrapbookSectionProps) {
  return (
    <section className={cn(
      "relative py-24 md:py-48 overflow-hidden",
      bgTexture && "bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat",
      className
    )}>
      {/* Decorative Scrapbook Elements */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-parchment-base to-transparent z-10" />
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-parchment-base to-transparent z-10" />

      <Container className="relative z-20">
        {children}
      </Container>
    </section>
  )
}

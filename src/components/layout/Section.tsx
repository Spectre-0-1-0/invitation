import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: "parchment" | "white" | "muted";
}

export function Section({ children, className, variant = "parchment", ...props }: SectionProps) {
  const variants = {
    parchment: "bg-parchment-base",
    white: "bg-white",
    muted: "bg-parchment-muted",
  };

  return (
    <section className={cn("py-16 md:py-32", variants[variant], className)} {...props}>
      {children}
    </section>
  );
}

import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "scrapbook" | "polaroid" | "ghost";
}

export function Card({ children, className, variant = "default", ...props }: CardProps) {
  const variants = {
    default: "bg-white border border-parchment-muted shadow-sm rounded-soft",
    scrapbook: "bg-white shadow-scrapbook border-none rounded-sm rotate-[0.5deg] hover:rotate-0 transition-transform duration-500",
    polaroid: "bg-white p-3 pb-12 shadow-polaroid rounded-photo -rotate-1 hover:rotate-0 transition-transform duration-500 border border-parchment-dark",
    ghost: "bg-transparent border-none shadow-none",
  };

  return (
    <div
      className={cn(
        "overflow-hidden focus-within:ring-2 focus-within:ring-champagne-gold focus-within:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("p-6 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("p-6 pt-0 border-t mt-auto", className)} {...props}>
      {children}
    </div>
  );
}

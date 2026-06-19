import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "outline";
}

export function Badge({ children, className, variant = "primary", ...props }: BadgeProps) {
  const variants = {
    primary: "bg-heritage-navy text-white",
    secondary: "bg-champagne-gold text-heritage-navy",
    outline: "border border-parchment-dark text-charcoal-muted",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase font-bold",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

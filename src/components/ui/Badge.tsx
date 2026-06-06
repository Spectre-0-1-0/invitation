import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "outline";
}

export function Badge({ children, className, variant = "primary", ...props }: BadgeProps) {
  const variants = {
    primary: "bg-heritage-navy text-white",
    secondary: "bg-champagne-gold text-heritage-navy",
    outline: "border border-heritage-navy text-heritage-navy",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono tracking-wider uppercase",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

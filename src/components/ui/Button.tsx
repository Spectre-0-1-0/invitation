import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-heritage-navy text-white hover:bg-opacity-90 focus-visible:ring-offset-2 focus-visible:ring-2 focus-visible:ring-heritage-navy",
      secondary: "bg-champagne-gold text-heritage-navy hover:bg-opacity-90 focus-visible:ring-offset-2 focus-visible:ring-2 focus-visible:ring-champagne-gold",
      outline: "border-2 border-heritage-navy text-heritage-navy hover:bg-heritage-navy hover:text-white focus-visible:ring-offset-2 focus-visible:ring-2 focus-visible:ring-heritage-navy",
      ghost: "text-heritage-navy hover:bg-parchment-muted focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-heritage-navy",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus:outline-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };

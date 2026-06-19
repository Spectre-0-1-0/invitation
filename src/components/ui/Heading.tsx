import { cn } from "@/lib/utils";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4;
}

export function Heading({ children, className, level = 1, ...props }: HeadingProps) {
  const levels = {
    1: "text-5xl md:text-8xl font-serif text-heritage-navy tracking-tight",
    2: "text-4xl md:text-6xl font-serif text-heritage-navy tracking-tight",
    3: "text-2xl md:text-3xl font-serif text-heritage-navy",
    4: "text-xl font-serif text-heritage-navy",
  };

  switch (level) {
    case 1: return <h1 className={cn(levels[1], className)} {...props}>{children}</h1>;
    case 2: return <h2 className={cn(levels[2], className)} {...props}>{children}</h2>;
    case 3: return <h3 className={cn(levels[3], className)} {...props}>{children}</h3>;
    case 4: return <h4 className={cn(levels[4], className)} {...props}>{children}</h4>;
    default: return <h1 className={cn(levels[1], className)} {...props}>{children}</h1>;
  }
}

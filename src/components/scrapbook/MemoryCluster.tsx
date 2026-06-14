import { cn } from "@/lib/utils"

interface MemoryClusterProps {
  children: React.ReactNode
  className?: string
}

export function MemoryCluster({ children, className }: MemoryClusterProps) {
  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-24 items-center",
      className
    )}>
      {children}
    </div>
  )
}

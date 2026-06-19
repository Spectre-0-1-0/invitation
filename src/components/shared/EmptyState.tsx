import React from 'react';
import { Heading } from '@/components/ui/Heading';
import { cn } from '@/lib/utils';
import { CameraOff, AlertCircle, Search } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No memories found",
  message = "It looks like this section of the archive is still waiting to be filled.",
  icon = <CameraOff size={40} />,
  className,
  action
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-24 px-6 text-center border-2 border-dashed border-parchment-dark/30 rounded-xl bg-parchment-base/10",
      className
    )}>
      <div className="w-20 h-20 bg-parchment-muted rounded-full flex items-center justify-center text-charcoal-muted/40 mb-8 animate-pulse">
        {icon}
      </div>
      <Heading level={3} className="text-2xl text-heritage-navy mb-4 font-serif">{title}</Heading>
      <p className="text-charcoal-muted max-w-sm mx-auto font-serif italic mb-8">{message}</p>
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
};

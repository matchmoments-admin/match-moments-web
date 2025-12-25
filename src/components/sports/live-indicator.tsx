'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LiveIndicatorProps {
  status?: string;
  className?: string;
  showPulse?: boolean;
}

/**
 * Animated live indicator badge
 */
export function LiveIndicator({ 
  status = 'Live', 
  className,
  showPulse = true 
}: LiveIndicatorProps) {
  const isLive = status.toLowerCase() === 'live';
  
  return (
    <Badge 
      variant={isLive ? 'destructive' : 'secondary'}
      className={cn('relative', className)}
    >
      {showPulse && isLive && (
        <span className="absolute -left-1 -top-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}
      <span className={showPulse && isLive ? 'ml-2' : ''}>
        {status}
      </span>
    </Badge>
  );
}


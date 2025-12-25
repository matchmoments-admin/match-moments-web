'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AutoRefreshIndicatorProps {
  /**
   * Refresh interval in milliseconds
   */
  interval: number;
  
  /**
   * Whether auto-refresh is active
   */
  isActive: boolean;
  
  className?: string;
}

/**
 * Visual indicator showing countdown to next refresh
 */
export function AutoRefreshIndicator({ 
  interval, 
  isActive,
  className 
}: AutoRefreshIndicatorProps) {
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(Math.floor(interval / 1000));

  useEffect(() => {
    if (!isActive) return;

    const startTime = Date.now();
    const updateTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, Math.floor((interval - elapsed) / 1000));
      setSecondsUntilRefresh(remaining);

      if (remaining === 0) {
        // Reset the timer
        setSecondsUntilRefresh(Math.floor(interval / 1000));
      }
    }, 1000);

    return () => clearInterval(updateTimer);
  }, [interval, isActive]);

  if (!isActive) return null;

  return (
    <div className={cn('text-sm text-muted-foreground flex items-center gap-2', className)}>
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
      </div>
      <span>Refreshing in {secondsUntilRefresh}s</span>
    </div>
  );
}


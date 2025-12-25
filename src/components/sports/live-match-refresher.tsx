'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface LiveMatchRefresherProps {
  /**
   * Refresh interval in milliseconds
   * @default 30000 (30 seconds)
   */
  interval?: number;
  
  /**
   * Only refresh if match status is live
   */
  isLive?: boolean;
}

/**
 * Client component that auto-refreshes the page for live match updates
 * Place this in server components that need real-time data
 */
export function LiveMatchRefresher({ 
  interval = 30000, 
  isLive = true 
}: LiveMatchRefresherProps) {
  const router = useRouter();

  useEffect(() => {
    // Only set up interval if the match is live
    if (!isLive) return;

    const refreshInterval = setInterval(() => {
      // Use router.refresh() to revalidate server components
      router.refresh();
    }, interval);

    return () => clearInterval(refreshInterval);
  }, [interval, isLive, router]);

  return null; // This component doesn't render anything
}


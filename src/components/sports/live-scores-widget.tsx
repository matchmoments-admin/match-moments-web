'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { LiveIndicator } from './live-indicator';
import { AutoRefreshIndicator } from './auto-refresh-indicator';

interface Match {
  Id: string;
  Home_Team__r: { Id: string; Name: string; Logo_Url__c?: string };
  Away_Team__r: { Id: string; Name: string; Logo_Url__c?: string };
  Home_Score__c: number;
  Away_Score__c: number;
  Match_Status__c: string;
  Competition__r?: { Name: string };
  Sport__c?: string;
  Gender_Class__c?: string;
}

interface LiveScoresWidgetProps {
  /**
   * Refresh interval in milliseconds
   * @default 30000 (30 seconds)
   */
  refreshInterval?: number;
  
  /**
   * Filter by sport
   */
  sport?: string;
  
  /**
   * Filter by gender
   */
  gender?: string;
  
  /**
   * Maximum number of matches to display
   */
  limit?: number;
}

/**
 * Live scores widget with auto-refresh
 * Fetches and displays live matches from the API
 */
export function LiveScoresWidget({ 
  refreshInterval = 30000,
  sport,
  gender,
  limit = 10
}: LiveScoresWidgetProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLiveMatches = async () => {
    try {
      const params = new URLSearchParams();
      if (sport) params.append('sport', sport);
      if (gender) params.append('gender', gender);
      if (limit) params.append('limit', limit.toString());

      const response = await fetch(`/api/sports/matches/live?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch live matches');
      }

      const data = await response.json();
      setMatches(data.success ? data.data : []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchLiveMatches();

    // Set up auto-refresh
    const interval = setInterval(fetchLiveMatches, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, sport, gender, limit]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Live Matches</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <p>Unable to load live matches</p>
        </div>
      </Card>
    );
  }

  if (matches.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Live Matches</h3>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <p>No live matches at the moment</p>
        </div>
      </Card>
    );
  }

  const hasLiveMatches = matches.length > 0;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Live Matches</h3>
        {hasLiveMatches && (
          <AutoRefreshIndicator 
            interval={refreshInterval} 
            isActive={hasLiveMatches}
          />
        )}
      </div>

      <div className="space-y-3">
        {matches.map((match) => {
          const sportPath = match.Sport__c?.toLowerCase() || 'soccer';
          const genderPath = match.Gender_Class__c?.toLowerCase().includes('women') ? 'womens' : 'mens';
          
          return (
            <Link
              key={match.Id}
              href={`/${genderPath}/${sportPath}/fixtures/${match.Id}`}
              className="block"
            >
              <div className="rounded-lg border border-border hover:border-primary transition-colors p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-muted-foreground">
                    {match.Competition__r?.Name}
                  </div>
                  <LiveIndicator 
                    status={match.Match_Status__c} 
                    showPulse={true}
                  />
                </div>

                <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
                  {/* Home Team */}
                  <div className="flex items-center gap-2">
                    {match.Home_Team__r.Logo_Url__c && (
                      <Image
                        src={match.Home_Team__r.Logo_Url__c}
                        alt={match.Home_Team__r.Name}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    )}
                    <span className="font-medium text-sm truncate">
                      {match.Home_Team__r.Name}
                    </span>
                  </div>

                  {/* Score */}
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {match.Home_Score__c || 0} - {match.Away_Score__c || 0}
                    </div>
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center gap-2 justify-end">
                    <span className="font-medium text-sm truncate">
                      {match.Away_Team__r.Name}
                    </span>
                    {match.Away_Team__r.Logo_Url__c && (
                      <Image
                        src={match.Away_Team__r.Logo_Url__c}
                        alt={match.Away_Team__r.Name}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}


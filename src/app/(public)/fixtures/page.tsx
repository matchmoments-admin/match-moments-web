'use client';

import { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

interface Team {
  id: string;
  name: string;
  logoUrl: string;
  abbreviation?: string;
}

interface Competition {
  id: string;
  name: string;
  logoUrl?: string;
}

interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: 'scheduled' | 'live' | 'finished';
  competition: Competition;
  venue?: string;
  matchDate: Date | string;
  sport: string;
  isLive: boolean;
}

interface MatchesByCompetition {
  [competitionName: string]: Match[];
}

const SPORTS = [
  { id: 'all', label: 'All Sports' },
  { id: 'Soccer', label: 'Soccer' },
  { id: 'Basketball', label: 'Basketball' },
  { id: 'Cricket', label: 'Cricket' },
  { id: 'Tennis', label: 'Tennis' },
  { id: 'NFL', label: 'NFL' },
  { id: 'Rugby', label: 'Rugby' },
];

// League mappings for ESPN API
const LEAGUE_MAP: Record<string, string> = {
  'Soccer': 'all', // Can use specific leagues like 'eng.1' for Premier League
  'Basketball': 'nba',
  'Cricket': 'all',
  'Tennis': 'all',
  'NFL': 'nfl',
  'Rugby': 'all',
};

export default function AllFixturesPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Date range for selector (7 days before and after)
  const dateRange = Array.from({ length: 15 }, (_, i) => {
    const date = addDays(new Date(), i - 7);
    return date;
  });

  useEffect(() => {
    fetchMatches();
  }, [selectedDate, selectedSport]);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // If "all" sports selected, fetch multiple sports and combine
      if (selectedSport === 'all') {
        const sportKeys = ['Soccer', 'Basketball', 'NFL'];
        const dateStr = format(selectedDate, 'yyyyMMdd');
        
        const responses = await Promise.all(
          sportKeys.map(sport =>
            fetch(`/api/espn/fixtures?sport=${sport}&league=${LEAGUE_MAP[sport]}&date=${dateStr}`)
              .then(res => res.json())
              .catch(() => ({ success: false, data: [] }))
          )
        );
        
        const allMatches = responses
          .filter(res => res.success)
          .flatMap(res => res.data || []);
        
        setMatches(allMatches);
      } else {
        // Fetch single sport
        const dateStr = format(selectedDate, 'yyyyMMdd');
        const league = LEAGUE_MAP[selectedSport] || 'all';
        
        const response = await fetch(
          `/api/espn/fixtures?sport=${selectedSport}&league=${league}&date=${dateStr}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch matches');
        }

        const data = await response.json();
        setMatches(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError('Unable to load matches. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Group matches by competition
  const matchesByCompetition: MatchesByCompetition = matches.reduce((acc, match) => {
    const competitionName = match.competition.name;
    if (!acc[competitionName]) {
      acc[competitionName] = [];
    }
    acc[competitionName].push(match);
    return acc;
  }, {} as MatchesByCompetition);

  // Stats
  const liveCount = matches.filter(m => m.status === 'live').length;
  const finishedCount = matches.filter(m => m.status === 'finished').length;
  const upcomingCount = matches.filter(m => m.status === 'scheduled').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-5xl font-bold mb-2">All Fixtures</h1>
          <p className="text-xl text-gray-600">Live scores, schedules and results across all sports</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          {/* Sport Filter */}
          <div className="mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {SPORTS.map((sport) => (
                <button
                  key={sport.id}
                  onClick={() => setSelectedSport(sport.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
                    selectedSport === sport.id
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {sport.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {dateRange.map((date) => {
              const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
              const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              
              return (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-shrink-0 px-4 py-3 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-xs font-medium mb-1 ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                      {isToday ? 'TODAY' : format(date, 'EEE').toUpperCase()}
                    </div>
                    <div className="text-xl font-bold">
                      {format(date, 'd')}
                    </div>
                    <div className={`text-xs ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                      {format(date, 'MMM')}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading fixtures...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchMatches}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Try Again
            </button>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold mb-2">No Fixtures</h3>
            <p className="text-gray-600">
              No matches scheduled for {format(selectedDate, 'MMMM d, yyyy')}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(matchesByCompetition).map(([competitionName, competitionMatches]) => (
              <div key={competitionName} className="bg-white rounded-lg overflow-hidden shadow-sm">
                {/* Competition Header */}
                <div className="bg-gray-100 px-6 py-4 border-b">
                  <div className="flex items-center gap-3">
                    {competitionMatches[0]?.competition.logoUrl && (
                      <div className="relative h-6 w-6">
                        <Image
                          src={competitionMatches[0].competition.logoUrl}
                          alt={competitionName}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <h2 className="text-xl font-bold">{competitionName}</h2>
                    <span className="text-sm text-gray-600">
                      ({competitionMatches.length} {competitionMatches.length === 1 ? 'match' : 'matches'})
                    </span>
                  </div>
                </div>

                {/* Matches List */}
                <div className="divide-y">
                  {competitionMatches.map((match) => (
                    <Link
                      key={match.id}
                      href={`/games/${match.id}`}
                      className="block hover:bg-gray-50 transition-colors"
                    >
                      <div className="px-6 py-4">
                        <div className="flex items-center justify-between gap-4">
                          {/* Time/Status */}
                          <div className="w-20 text-sm flex-shrink-0">
                            {match.status === 'live' ? (
                              <span className="flex items-center gap-2 text-red-600 font-bold">
                                <span className="h-2 w-2 bg-red-600 rounded-full animate-pulse"></span>
                                LIVE
                              </span>
                            ) : match.status === 'finished' ? (
                              <span className="text-gray-500 font-medium">FT</span>
                            ) : (
                              <span className="text-gray-600">
                                {format(new Date(match.matchDate), 'HH:mm')}
                              </span>
                            )}
                          </div>

                          {/* Teams and Scores */}
                          <div className="flex-1 max-w-2xl">
                            {/* Home Team */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                {match.homeTeam.logoUrl && (
                                  <div className="relative h-6 w-6 flex-shrink-0">
                                    <Image
                                      src={match.homeTeam.logoUrl}
                                      alt={match.homeTeam.name}
                                      fill
                                      className="object-contain"
                                    />
                                  </div>
                                )}
                                <span className="font-medium truncate">
                                  {match.homeTeam.name}
                                </span>
                              </div>
                              <span className="text-xl font-bold w-12 text-right flex-shrink-0">
                                {match.homeScore}
                              </span>
                            </div>

                            {/* Away Team */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                {match.awayTeam.logoUrl && (
                                  <div className="relative h-6 w-6 flex-shrink-0">
                                    <Image
                                      src={match.awayTeam.logoUrl}
                                      alt={match.awayTeam.name}
                                      fill
                                      className="object-contain"
                                    />
                                  </div>
                                )}
                                <span className="font-medium truncate">
                                  {match.awayTeam.name}
                                </span>
                              </div>
                              <span className="text-xl font-bold w-12 text-right flex-shrink-0">
                                {match.awayScore}
                              </span>
                            </div>
                          </div>

                          {/* Venue (optional, hidden on mobile) */}
                          {match.venue && (
                            <div className="hidden lg:block w-48 text-sm text-gray-500 text-right flex-shrink-0">
                              {match.venue}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats Footer */}
      {matches.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-black">
                  {matches.length}
                </div>
                <div className="text-sm text-gray-600">Total Matches</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">
                  {liveCount}
                </div>
                <div className="text-sm text-gray-600">Live Now</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {finishedCount}
                </div>
                <div className="text-sm text-gray-600">Finished</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {upcomingCount}
                </div>
                <div className="text-sm text-gray-600">Upcoming</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


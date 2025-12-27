'use client';

import { useState, useEffect } from 'react';
import { format, addDays, subMonths } from 'date-fns';
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
  status: 'scheduled' | 'live' | 'finished' | 'halftime' | 'postponed' | 'cancelled';
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
  { id: 'soccer', label: 'Soccer' },
  { id: 'basketball', label: 'Basketball' },
  { id: 'cricket', label: 'Cricket' },
  { id: 'tennis', label: 'Tennis' },
  { id: 'nfl', label: 'NFL' },
  { id: 'rugby', label: 'Rugby' },
];

export default function AllFixturesPage() {
  // Initialize with a 3-month date range
  const defaultStartDate = subMonths(new Date(), 1);
  const defaultEndDate = addDays(new Date(), 60);
  
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // null = show all dates in range
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
  }, [startDate, endDate, selectedSport]);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Format dates for Salesforce query (ISO 8601 format)
      const startDateStr = format(startDate, "yyyy-MM-dd'T'00:00:00'Z'");
      const endDateStr = format(endDate, "yyyy-MM-dd'T'23:59:59'Z'");
      
      // Build API URL
      let apiUrl = `/api/sports/matches?startDate=${startDateStr}&endDate=${endDateStr}&limit=500`;
      
      // Add sport filter if not "all"
      if (selectedSport !== 'all') {
        apiUrl += `&sport=${selectedSport}`;
      }
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }

      const data = await response.json();
      
      if (data.success) {
        setMatches(data.data || []);
      } else {
        throw new Error(data.error || 'Failed to fetch matches');
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError('Unable to load matches. Please try again later.');
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter matches by selected date for display (if a specific date is selected)
  const filteredMatches = selectedDate 
    ? matches.filter(match => {
        const matchDate = new Date(match.matchDate);
        const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
        const matchDateStr = format(matchDate, 'yyyy-MM-dd');
        return matchDateStr === selectedDateStr;
      })
    : matches; // Show all matches in range if no specific date selected

  // Group filtered matches by date (if viewing all) or by competition (if viewing single date)
  interface MatchesByGroup {
    [key: string]: Match[];
  }
  
  const matchesByGroup: MatchesByGroup = selectedDate
    ? // Group by competition for single date view
      filteredMatches.reduce((acc, match) => {
        const competitionName = match.competition.name;
        if (!acc[competitionName]) {
          acc[competitionName] = [];
        }
        acc[competitionName].push(match);
        return acc;
      }, {} as MatchesByGroup)
    : // Group by date for range view
      filteredMatches.reduce((acc, match) => {
        const dateKey = format(new Date(match.matchDate), 'yyyy-MM-dd');
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(match);
        return acc;
      }, {} as MatchesByGroup);
  
  // Sort date keys chronologically when viewing all dates
  const sortedGroupKeys = selectedDate 
    ? Object.keys(matchesByGroup).sort() // Alphabetical for competitions
    : Object.keys(matchesByGroup).sort(); // Chronological for dates

  // Stats for selected date
  const liveCount = filteredMatches.filter(m => m.status === 'live').length;
  const finishedCount = filteredMatches.filter(m => m.status === 'finished').length;
  const upcomingCount = filteredMatches.filter(m => m.status === 'scheduled').length;

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
          {/* Date Range Filter */}
          <div className="mb-4 flex flex-wrap gap-4 items-end">
            <div className="flex gap-4 items-end">
              <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  id="start-date"
                  value={format(startDate, 'yyyy-MM-dd')}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
              <div>
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  id="end-date"
                  value={format(endDate, 'yyyy-MM-dd')}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
            </div>
            <button
              onClick={fetchMatches}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium transition-colors"
            >
              Update
            </button>
          </div>

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

          {/* Date Selector (for viewing specific days) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date to View (optional - leave unselected to view all)
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedDate(null)}
                className={`flex-shrink-0 px-4 py-3 rounded-lg border-2 transition-all ${
                  selectedDate === null
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className={`text-xs font-medium mb-1 ${selectedDate === null ? 'text-white' : 'text-gray-500'}`}>
                    ALL
                  </div>
                  <div className="text-xl font-bold">
                    📅
                  </div>
                  <div className={`text-xs ${selectedDate === null ? 'text-white' : 'text-gray-500'}`}>
                    Dates
                  </div>
                </div>
              </button>
              {dateRange.map((date) => {
                const isSelected = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
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
        ) : filteredMatches.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold mb-2">No Fixtures</h3>
            <p className="text-gray-600">
              {selectedDate 
                ? `No matches scheduled for ${format(selectedDate, 'MMMM d, yyyy')}`
                : `No matches found in date range (${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')})`
              }
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Total matches in date range: {matches.length}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedGroupKeys.map((groupKey) => {
              const groupMatches = matchesByGroup[groupKey];
              const groupTitle = selectedDate 
                ? groupKey // Competition name
                : format(new Date(groupKey), 'EEEE, MMMM d, yyyy'); // Date string
              
              return (
                <div key={groupKey} className="bg-white rounded-lg overflow-hidden shadow-sm">
                  {/* Group Header */}
                  <div className="bg-gray-100 px-6 py-4 border-b">
                    <div className="flex items-center gap-3">
                      {selectedDate && groupMatches[0]?.competition.logoUrl && (
                        <div className="relative h-6 w-6">
                          <Image
                            src={groupMatches[0].competition.logoUrl}
                            alt={groupTitle}
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                      <h2 className="text-xl font-bold">{groupTitle}</h2>
                      <span className="text-sm text-gray-600">
                        ({groupMatches.length} {groupMatches.length === 1 ? 'match' : 'matches'})
                      </span>
                    </div>
                  </div>

                  {/* Matches List */}
                  <div className="divide-y">
                    {groupMatches.map((match) => (
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
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Stats Footer */}
      {filteredMatches.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-center">
              {selectedDate 
                ? `Stats for ${format(selectedDate, 'MMMM d, yyyy')}`
                : `Stats for ${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`
              }
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-black">
                  {filteredMatches.length}
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
            <p className="text-center text-sm text-gray-500 mt-4">
              Total matches in date range ({format(startDate, 'MMM d')} - {format(endDate, 'MMM d')}): {matches.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}


import { NextRequest, NextResponse } from 'next/server';

/**
 * ESPN API Proxy - Fetches fixtures directly from ESPN
 * Use this as a data source while Salesforce data is being configured
 * 
 * GET /api/espn/fixtures?date=20241227&sport=soccer&league=eng.1
 */

interface ESPNCompetitor {
  id: string;
  team: {
    id: string;
    name: string;
    displayName: string;
    abbreviation: string;
    logo?: string;
  };
  score?: string;
  homeAway: 'home' | 'away';
}

interface ESPNCompetition {
  id: string;
  competitors: ESPNCompetitor[];
  status: {
    type: {
      name: string;
      state: string;
      completed: boolean;
    };
  };
  venue?: {
    fullName: string;
  };
}

interface ESPNEvent {
  id: string;
  date: string;
  name: string;
  shortName: string;
  competitions: ESPNCompetition[];
}

interface ESPNLeague {
  id: string;
  name: string;
  abbreviation: string;
  logos?: Array<{ href: string }>;
}

interface ESPNScoreboard {
  events: ESPNEvent[];
  leagues: ESPNLeague[];
}

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sport = searchParams.get('sport') || 'soccer';
  const league = searchParams.get('league') || 'all';
  const date = searchParams.get('date'); // YYYYMMDD format
  
  try {
    // Map our sport names to ESPN sport names
    const sportMap: Record<string, string> = {
      'Soccer': 'soccer',
      'Basketball': 'basketball',
      'Cricket': 'cricket',
      'Tennis': 'tennis',
      'NFL': 'football',
      'American Football': 'football',
      'Rugby': 'rugby',
    };

    const espnSport = sportMap[sport] || sport.toLowerCase();
    
    // Build ESPN API URL
    let espnUrl = `https://site.api.espn.com/apis/site/v2/sports/${espnSport}`;
    
    if (league !== 'all') {
      espnUrl += `/${league}`;
    }
    
    espnUrl += '/scoreboard';
    
    if (date) {
      espnUrl += `?dates=${date}`;
    }

    console.log('[ESPN API] Fetching from:', espnUrl);

    const response = await fetch(espnUrl, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`ESPN API returned ${response.status}`);
    }

    const data: ESPNScoreboard = await response.json();

    // Transform ESPN data to our format
    const matches = data.events?.map((event) => {
      const competition = event.competitions[0];
      const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
      const awayTeam = competition.competitors.find(c => c.homeAway === 'away');
      
      // Determine status
      let status: 'scheduled' | 'live' | 'finished' = 'scheduled';
      let isLive = false;
      if (competition.status.type.completed) {
        status = 'finished';
      } else if (competition.status.type.state === 'in') {
        status = 'live';
        isLive = true;
      }

      return {
        id: event.id,
        homeTeam: {
          id: homeTeam?.team.id || '',
          name: homeTeam?.team.displayName || '',
          shortName: homeTeam?.team.abbreviation || '',
          logoUrl: homeTeam?.team.logo || '',
          sport: sport,
          gender: 'mens' as const,
          abbreviation: homeTeam?.team.abbreviation || '',
        },
        awayTeam: {
          id: awayTeam?.team.id || '',
          name: awayTeam?.team.displayName || '',
          shortName: awayTeam?.team.abbreviation || '',
          logoUrl: awayTeam?.team.logo || '',
          sport: sport,
          gender: 'mens' as const,
          abbreviation: awayTeam?.team.abbreviation || '',
        },
        homeScore: homeTeam?.score ? parseInt(homeTeam.score) : 0,
        awayScore: awayTeam?.score ? parseInt(awayTeam.score) : 0,
        status,
        isLive,
        competition: {
          id: data.leagues[0]?.id || '',
          name: data.leagues[0]?.name || sport,
          sport: sport,
          gender: 'mens' as const,
          logoUrl: data.leagues[0]?.logos?.[0]?.href || '',
          tier: 1,
          season: {
            id: '',
            name: new Date().getFullYear().toString(),
          },
        },
        venue: competition.venue?.fullName,
        matchDate: new Date(event.date),
        sport: sport,
        gender: 'mens' as const,
      };
    }) || [];

    return NextResponse.json({
      success: true,
      data: matches,
      meta: {
        total: matches.length,
        source: 'ESPN',
        sport,
        league,
        date,
      },
    });

  } catch (error) {
    console.error('[ESPN API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch from ESPN',
        data: [],
      },
      { status: 500 }
    );
  }
}

/**
 * Usage Examples:
 * 
 * Premier League fixtures for today:
 * /api/espn/fixtures?sport=Soccer&league=eng.1
 * 
 * Premier League for specific date:
 * /api/espn/fixtures?sport=Soccer&league=eng.1&date=20241227
 * 
 * All soccer leagues:
 * /api/espn/fixtures?sport=Soccer&league=all
 * 
 * Champions League:
 * /api/espn/fixtures?sport=Soccer&league=uefa.champions
 * 
 * NBA:
 * /api/espn/fixtures?sport=Basketball&league=nba
 * 
 * NFL:
 * /api/espn/fixtures?sport=NFL&league=nfl
 */


import { NextRequest, NextResponse } from 'next/server';
import { getTeams } from '@/lib/salesforce/queries/teams';
import type { TeamFilters } from '@/lib/salesforce/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const filters: TeamFilters = {
      sport: searchParams.get('sport') || undefined,
      gender: searchParams.get('gender') || undefined,
      league: searchParams.get('league') || undefined,
      country: searchParams.get('country') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
    };

    const teams = await getTeams(filters);

    return NextResponse.json({
      success: true,
      data: teams,
      count: teams.length,
    });
  } catch (error: any) {
    console.error('[API] Error fetching teams:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch teams',
      },
      { status: 500 }
    );
  }
}


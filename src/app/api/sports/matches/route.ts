import { NextRequest, NextResponse } from 'next/server';
import { getMatches } from '@/lib/salesforce/queries/matches';
import type { MatchFilters } from '@/lib/salesforce/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const filters: MatchFilters = {
      sport: searchParams.get('sport') || undefined,
      gender: searchParams.get('gender') || undefined,
      competition: searchParams.get('competition') || undefined,
      team: searchParams.get('team') || undefined,
      status: searchParams.get('status') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
    };

    const matches = await getMatches(filters);

    return NextResponse.json({
      success: true,
      data: matches,
      count: matches.length,
    });
  } catch (error: any) {
    console.error('[API] Error fetching matches:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch matches',
      },
      { status: 500 }
    );
  }
}


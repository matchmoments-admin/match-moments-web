import { NextRequest, NextResponse } from 'next/server';
import { getMatchById, getMatchPeriods, getMatchEvents, getMatchMoments, getMatchLineups } from '@/lib/salesforce/queries/matches';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch match and all related data in parallel
    const [match, periods, events, moments, lineups] = await Promise.all([
      getMatchById(id),
      getMatchPeriods(id),
      getMatchEvents(id),
      getMatchMoments(id),
      getMatchLineups(id),
    ]);

    if (!match) {
      return NextResponse.json(
        {
          success: false,
          error: 'Match not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...match,
        periods,
        events,
        moments,
        lineups,
      },
    });
  } catch (error: any) {
    console.error('[API] Error fetching match details:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch match details',
      },
      { status: 500 }
    );
  }
}


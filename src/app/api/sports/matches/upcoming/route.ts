import { NextRequest, NextResponse } from 'next/server';
import { getUpcomingMatches } from '@/lib/salesforce/queries/matches';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const days = searchParams.get('days') ? parseInt(searchParams.get('days')!) : 7;

    const matches = await getUpcomingMatches(days);

    return NextResponse.json({
      success: true,
      data: matches,
      count: matches.length,
    });
  } catch (error: any) {
    console.error('[API] Error fetching upcoming matches:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch upcoming matches',
      },
      { status: 500 }
    );
  }
}


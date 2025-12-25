import { NextResponse } from 'next/server';
import { getLiveMatches } from '@/lib/salesforce/queries/matches';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const matches = await getLiveMatches();

    return NextResponse.json({
      success: true,
      data: matches,
      count: matches.length,
    });
  } catch (error: any) {
    console.error('[API] Error fetching live matches:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch live matches',
      },
      { status: 500 }
    );
  }
}


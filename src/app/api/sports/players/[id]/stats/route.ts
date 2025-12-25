import { NextRequest, NextResponse } from 'next/server';
import { getPlayerStats } from '@/lib/salesforce/queries/players';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const seasonId = searchParams.get('season') || undefined;

    const stats = await getPlayerStats(id, seasonId);

    return NextResponse.json({
      success: true,
      data: stats,
      count: stats.length,
    });
  } catch (error: any) {
    console.error('[API] Error fetching player stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch player stats',
      },
      { status: 500 }
    );
  }
}


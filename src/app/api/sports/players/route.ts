import { NextRequest, NextResponse } from 'next/server';
import { getPlayers } from '@/lib/salesforce/queries/players';
import type { PlayerFilters } from '@/lib/salesforce/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const filters: PlayerFilters = {
      sport: searchParams.get('sport') || undefined,
      gender: searchParams.get('gender') || undefined,
      team: searchParams.get('team') || undefined,
      position: searchParams.get('position') || undefined,
      nationality: searchParams.get('nationality') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
    };

    const players = await getPlayers(filters);

    return NextResponse.json({
      success: true,
      data: players,
      count: players.length,
    });
  } catch (error: any) {
    console.error('[API] Error fetching players:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch players',
      },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { getMoments } from '@/lib/salesforce/queries/moments';
import type { MomentFilters } from '@/lib/salesforce/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const filters: MomentFilters = {
      match: searchParams.get('match') || undefined,
      player: searchParams.get('player') || undefined,
      team: searchParams.get('team') || undefined,
      eventType: searchParams.get('eventType') || undefined,
      sport: searchParams.get('sport') || undefined,
      gender: searchParams.get('gender') || undefined,
      minViralScore: searchParams.get('minViralScore') ? parseInt(searchParams.get('minViralScore')!) : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
    };

    const moments = await getMoments(filters);

    return NextResponse.json({
      success: true,
      data: moments,
      count: moments.length,
    });
  } catch (error: any) {
    console.error('[API] Error fetching moments:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch moments',
      },
      { status: 500 }
    );
  }
}


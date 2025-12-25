import { NextRequest, NextResponse } from 'next/server';
import { getTrendingMoments } from '@/lib/salesforce/queries/moments';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;
    const sport = searchParams.get('sport') || undefined;
    const gender = searchParams.get('gender') || undefined;

    const moments = await getTrendingMoments(limit, sport, gender);

    return NextResponse.json({
      success: true,
      data: moments,
      count: moments.length,
    });
  } catch (error: any) {
    console.error('[API] Error fetching trending moments:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch trending moments',
      },
      { status: 500 }
    );
  }
}


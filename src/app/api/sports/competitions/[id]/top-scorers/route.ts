import { NextRequest, NextResponse } from 'next/server';
import { getTopScorers } from '@/lib/salesforce/queries/players';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;

    const scorers = await getTopScorers(id, limit);

    return NextResponse.json({
      success: true,
      data: scorers,
      count: scorers.length,
    });
  } catch (error: any) {
    console.error('[API] Error fetching top scorers:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch top scorers',
      },
      { status: 500 }
    );
  }
}


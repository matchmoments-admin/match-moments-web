import { NextRequest, NextResponse } from 'next/server';
import { getStandings } from '@/lib/salesforce/queries/competitions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const searchParams = request.nextUrl.searchParams;
    const seasonId = searchParams.get('season') || undefined;

    const standings = await getStandings(id, seasonId);

    return NextResponse.json({
      success: true,
      data: standings,
      count: standings.length,
    });
  } catch (error: any) {
    console.error('[API] Error fetching standings:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch standings',
      },
      { status: 500 }
    );
  }
}


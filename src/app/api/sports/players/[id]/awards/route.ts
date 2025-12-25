import { NextRequest, NextResponse } from 'next/server';
import { getPlayerAwards } from '@/lib/salesforce/queries/players';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const awards = await getPlayerAwards(id);

    return NextResponse.json({
      success: true,
      data: awards,
      count: awards.length,
    });
  } catch (error: any) {
    console.error('[API] Error fetching player awards:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch player awards',
      },
      { status: 500 }
    );
  }
}


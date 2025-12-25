import { NextRequest, NextResponse } from 'next/server';
import { getPlayerById } from '@/lib/salesforce/queries/players';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const player = await getPlayerById(id);

    if (!player) {
      return NextResponse.json(
        {
          success: false,
          error: 'Player not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: player,
    });
  } catch (error: any) {
    console.error('[API] Error fetching player:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch player',
      },
      { status: 500 }
    );
  }
}


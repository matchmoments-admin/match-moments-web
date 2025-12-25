import { NextRequest, NextResponse } from 'next/server';
import { getTeamById } from '@/lib/salesforce/queries/teams';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const team = await getTeamById(id);

    if (!team) {
      return NextResponse.json(
        {
          success: false,
          error: 'Team not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: team,
    });
  } catch (error: any) {
    console.error('[API] Error fetching team:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch team',
      },
      { status: 500 }
    );
  }
}


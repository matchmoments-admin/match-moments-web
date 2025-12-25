import { NextRequest, NextResponse } from 'next/server';
import { getTeamSquad } from '@/lib/salesforce/queries/teams';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const squad = await getTeamSquad(id);

    return NextResponse.json({
      success: true,
      data: squad,
      count: squad.length,
    });
  } catch (error: any) {
    console.error('[API] Error fetching team squad:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch team squad',
      },
      { status: 500 }
    );
  }
}


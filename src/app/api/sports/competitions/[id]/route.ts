import { NextRequest, NextResponse } from 'next/server';
import { getCompetitionById } from '@/lib/salesforce/queries/competitions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const competition = await getCompetitionById(id);

    if (!competition) {
      return NextResponse.json(
        {
          success: false,
          error: 'Competition not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: competition,
    });
  } catch (error: any) {
    console.error('[API] Error fetching competition:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch competition',
      },
      { status: 500 }
    );
  }
}


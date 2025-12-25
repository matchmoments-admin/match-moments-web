import { NextRequest, NextResponse } from 'next/server';
import { getPlayerCareer } from '@/lib/salesforce/queries/players';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const career = await getPlayerCareer(id);

    return NextResponse.json({
      success: true,
      data: career,
      count: career.length,
    });
  } catch (error: any) {
    console.error('[API] Error fetching player career:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch player career',
      },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { getMomentById } from '@/lib/salesforce/queries/moments';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const moment = await getMomentById(id);

    if (!moment) {
      return NextResponse.json(
        {
          success: false,
          error: 'Moment not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: moment,
    });
  } catch (error: any) {
    console.error('[API] Error fetching moment:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch moment',
      },
      { status: 500 }
    );
  }
}


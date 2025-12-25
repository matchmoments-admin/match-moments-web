import { NextRequest, NextResponse } from 'next/server';
import { getSeasonById } from '@/lib/salesforce/queries/seasons';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const season = await getSeasonById(id);

    if (!season) {
      return NextResponse.json(
        { success: false, error: 'Season not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: season,
    });
  } catch (error) {
    console.error('Error fetching season:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch season' 
      },
      { status: 500 }
    );
  }
}


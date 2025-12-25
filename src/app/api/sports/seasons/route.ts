import { NextRequest, NextResponse } from 'next/server';
import { getSeasons } from '@/lib/salesforce/queries/seasons';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sport = searchParams.get('sport') || undefined;

    const seasons = await getSeasons(sport);

    return NextResponse.json({
      success: true,
      data: seasons,
      count: seasons.length,
    });
  } catch (error) {
    console.error('Error fetching seasons:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch seasons' 
      },
      { status: 500 }
    );
  }
}


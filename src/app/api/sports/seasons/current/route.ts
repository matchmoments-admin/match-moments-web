import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSeason } from '@/lib/salesforce/queries/seasons';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sport = searchParams.get('sport');

    if (!sport) {
      return NextResponse.json(
        { success: false, error: 'Sport parameter is required' },
        { status: 400 }
      );
    }

    const season = await getCurrentSeason(sport);

    if (!season) {
      return NextResponse.json(
        { success: false, error: 'No current season found for this sport' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: season,
    });
  } catch (error) {
    console.error('Error fetching current season:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch current season' 
      },
      { status: 500 }
    );
  }
}


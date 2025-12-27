import { NextRequest, NextResponse } from 'next/server';
import { getCompetitions } from '@/lib/salesforce/queries/competitions';
import type { CompetitionFilters } from '@/lib/salesforce/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Note: Gender filtering removed - Competition__c doesn't have Gender_Class__c field
    const filters: CompetitionFilters = {
      sport: searchParams.get('sport') || undefined,
      season: searchParams.get('season') || undefined,
      country: searchParams.get('country') || undefined,
      tier: searchParams.get('tier') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
    };

    const competitions = await getCompetitions(filters);

    return NextResponse.json({
      success: true,
      data: competitions,
      count: competitions.length,
    });
  } catch (error: any) {
    console.error('[API] Error fetching competitions:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch competitions',
      },
      { status: 500 }
    );
  }
}


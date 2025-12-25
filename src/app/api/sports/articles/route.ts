import { NextRequest, NextResponse } from 'next/server';
import { getArticles } from '@/lib/salesforce/queries/articles';
import type { ArticleFilters } from '@/lib/salesforce/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const filters: ArticleFilters = {
      team: searchParams.get('team') || undefined,
      competition: searchParams.get('competition') || undefined,
      match: searchParams.get('match') || undefined,
      player: searchParams.get('player') || undefined,
      articleType: searchParams.get('type') || undefined,
      isPublished: searchParams.get('published') !== 'false',
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
    };

    const articles = await getArticles(filters);

    return NextResponse.json({
      success: true,
      data: articles,
      count: articles.length,
    });
  } catch (error: any) {
    console.error('[API] Error fetching articles:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch articles',
      },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { getLatestArticles } from '@/lib/salesforce/queries/articles';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

    const articles = await getLatestArticles(limit);

    return NextResponse.json({
      success: true,
      data: articles,
      count: articles.length,
    });
  } catch (error: any) {
    console.error('[API] Error fetching latest articles:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch latest articles',
      },
      { status: 500 }
    );
  }
}


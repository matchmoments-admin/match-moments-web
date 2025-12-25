import { NextRequest, NextResponse } from 'next/server';
import { getArticleById } from '@/lib/salesforce/queries/articles';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const article = await getArticleById(id);

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          error: 'Article not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: article,
    });
  } catch (error: any) {
    console.error('[API] Error fetching article:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch article',
      },
      { status: 500 }
    );
  }
}


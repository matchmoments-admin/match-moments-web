import Link from 'next/link';
import { StandardCard } from '@/components/shared/cards/standard-card';

export interface ArticleContentProps {
  content: string;
  relatedArticles?: Array<{
    id: string;
    title: string;
    category: string;
    categoryHref: string;
    author: string;
    readTime: number;
    imageUrl: string;
    href: string;
    date: string;
  }>;
}

export function ArticleContent({ content, relatedArticles }: ArticleContentProps) {
  return (
    <div className="bg-white py-12">
      {/* Article Body */}
      <div className="mx-auto max-w-[800px] px-4 md:px-8">
        <div className="prose prose-lg max-w-none">
          {/* Render article content */}
          <div
            className="article-content text-base font-normal leading-[19.2px]"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        {/* Share & Social (placeholder) */}
        <div className="mt-12 flex items-center gap-4 border-t border-gray-200 pt-8">
          <span className="text-sm font-medium text-gray-500">Share:</span>
          <div className="flex gap-3">
            <ShareButton platform="twitter" />
            <ShareButton platform="facebook" />
            <ShareButton platform="linkedin" />
          </div>
        </div>

        {/* Author Bio (placeholder) */}
        <div className="mt-12 rounded-2xl bg-gray-50 p-6">
          <h3 className="text-lg font-bold">About the Author</h3>
          <p className="mt-2 text-sm text-gray-600">
            Author bio and information goes here.
          </p>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles && relatedArticles.length > 0 && (
        <div className="mt-16 border-t border-gray-200 bg-gray-50 py-12">
          <div className="mx-auto max-w-[1920px] px-4 md:px-8">
            <h2 className="mb-8 text-3xl font-bold">Related Articles</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((article) => (
                <StandardCard key={article.id} {...article} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ShareButton({ platform }: { platform: string }) {
  return (
    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300">
      <span className="sr-only">Share on {platform}</span>
      {/* Icon placeholder */}
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
      </svg>
    </button>
  );
}


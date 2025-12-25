import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';

async function getArticle(articleId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/sports/articles/${articleId}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

async function getRelatedArticles(article: any) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    let url = `${baseUrl}/api/sports/articles?limit=3`;
    
    if (article.Team__c) {
      url += `&team=${article.Team__c}`;
    } else if (article.Competition__c) {
      url += `&competition=${article.Competition__c}`;
    } else if (article.Player__c) {
      url += `&player=${article.Player__c}`;
    }
    
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      return [];
    }

    const result = await response.json();
    const articles = result.success ? result.data : [];
    
    // Filter out the current article
    return articles.filter((a: any) => a.Id !== article.Id).slice(0, 3);
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}

export default async function ArticleDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const article = await getArticle(params.id);
  
  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(article);

  return (
    <main className="bg-background">
      <div className="container-main py-8">
        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          {article.Article_Type__c && (
            <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-sm font-medium mb-4">
              {article.Article_Type__c}
            </span>
          )}
          
          <h1 className="text-5xl font-bold mb-6">{article.Heading__c}</h1>
          
          <div className="flex items-center gap-4 text-gray-600 mb-8">
            {article.Author__c && (
              <span>By {article.Author__c}</span>
            )}
            {article.Published_Date__c && (
              <>
                <span>•</span>
                <span>{format(new Date(article.Published_Date__c), 'MMMM d, yyyy')}</span>
              </>
            )}
          </div>

          {/* Related Entities */}
          {(article.Team__r || article.Player__r || article.Competition__r || article.Match__r) && (
            <div className="flex flex-wrap gap-4 mb-8 p-6 bg-gray-50 rounded-2xl">
              {article.Team__r && (
                <Link 
                  href={`/womens/soccer/teams/${article.Team__r.Id}`}
                  className="flex items-center gap-3 px-4 py-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                >
                  {article.Team__r.Logo_Url__c && (
                    <Image
                      src={article.Team__r.Logo_Url__c}
                      alt={article.Team__r.Name || ''}
                      width={24}
                      height={24}
                    />
                  )}
                  <span className="font-medium">{article.Team__r.Name}</span>
                </Link>
              )}
              
              {article.Player__r && (
                <Link 
                  href={`/womens/soccer/players/${article.Player__r.Id}`}
                  className="flex items-center gap-3 px-4 py-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                >
                  {article.Player__r.Profile_Image_URL__c && (
                    <Image
                      src={article.Player__r.Profile_Image_URL__c}
                      alt={article.Player__r.Name || ''}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  )}
                  <span className="font-medium">{article.Player__r.Name}</span>
                </Link>
              )}
              
              {article.Competition__r && (
                <Link 
                  href={`/womens/soccer/competitions/${article.Competition__r.Id}`}
                  className="px-4 py-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium">{article.Competition__r.Name}</span>
                </Link>
              )}
              
              {article.Match__r && (
                <Link 
                  href={`/womens/soccer/fixtures/${article.Match__r.Id}`}
                  className="px-4 py-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium">{article.Match__r.Name}</span>
                </Link>
              )}
            </div>
          )}

          {/* Featured Image */}
          {article.Thumbnail_URL__c && (
            <div className="relative w-full h-96 mb-8 rounded-3xl overflow-hidden">
              <Image
                src={article.Thumbnail_URL__c}
                alt={article.Heading__c || ''}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Article Body */}
          <div className="prose prose-lg max-w-none mb-12">
            {article.Body__c && article.Body__c.split('\n').map((paragraph: string, index: number) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Article Footer */}
          <div className="border-t border-gray-200 pt-8">
            {article.Source__c && (
              <p className="text-sm text-gray-500">Source: {article.Source__c}</p>
            )}
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="max-w-4xl mx-auto mt-12 pt-12 border-t border-gray-200">
            <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related: any) => (
                <Link
                  key={related.Id}
                  href={`/articles/${related.Id}`}
                  className="group rounded-2xl bg-white border border-gray-200 overflow-hidden hover:border-black transition-colors"
                >
                  {related.Thumbnail_URL__c && (
                    <div className="relative w-full h-32 bg-gray-100">
                      <Image
                        src={related.Thumbnail_URL__c}
                        alt={related.Heading__c || ''}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-bold mb-2 group-hover:underline line-clamp-2">
                      {related.Heading__c}
                    </h4>
                    {related.Published_Date__c && (
                      <span className="text-xs text-gray-500">
                        {format(new Date(related.Published_Date__c), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back Link */}
        <div className="max-w-4xl mx-auto mt-12">
          <Link 
            href="/articles"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all articles
          </Link>
        </div>
      </div>
    </main>
  );
}


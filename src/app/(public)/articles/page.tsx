import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

export const metadata = {
  title: 'Latest Sports News & Articles | Match Moments',
  description: 'Stay updated with the latest news, analysis, and stories from women\'s and men\'s sports',
};

async function getArticles() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/sports/articles/latest?limit=50`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return [];
    }

    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <main className="bg-background">
      <div className="container-main py-8">
        {/* Page Header */}
        <section className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Latest News & Articles</h1>
          <p className="text-xl text-gray-600">
            Stay updated with the latest news, analysis, and stories from women's and men's sports
          </p>
        </section>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article: any) => (
              <Link
                key={article.Id}
                href={`/articles/${article.Id}`}
                className="group rounded-3xl bg-white border border-gray-200 overflow-hidden hover:border-black transition-colors"
              >
                {article.Thumbnail_URL__c && (
                  <div className="relative w-full h-48 bg-gray-100">
                    <Image
                      src={article.Thumbnail_URL__c}
                      alt={article.Heading__c || ''}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  {article.Article_Type__c && (
                    <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-sm font-medium mb-3">
                      {article.Article_Type__c}
                    </span>
                  )}
                  <h3 className="text-xl font-bold mb-2 group-hover:underline">
                    {article.Heading__c}
                  </h3>
                  {article.Body__c && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.Body__c.substring(0, 150)}...
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    {article.Published_Date__c && (
                      <span>{format(new Date(article.Published_Date__c), 'MMM d, yyyy')}</span>
                    )}
                    {article.Author__c && (
                      <span>By {article.Author__c}</span>
                    )}
                  </div>
                  {(article.Team__r || article.Competition__r || article.Player__r) && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                      {article.Team__r && (
                        <span className="inline-flex items-center gap-2 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          {article.Team__r.Logo_Url__c && (
                            <Image
                              src={article.Team__r.Logo_Url__c}
                              alt={article.Team__r.Name || ''}
                              width={16}
                              height={16}
                            />
                          )}
                          {article.Team__r.Name}
                        </span>
                      )}
                      {article.Player__r && (
                        <span className="inline-flex items-center gap-2 text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                          {article.Player__r.Profile_Image_URL__c && (
                            <Image
                              src={article.Player__r.Profile_Image_URL__c}
                              alt={article.Player__r.Name || ''}
                              width={16}
                              height={16}
                              className="rounded-full"
                            />
                          )}
                          {article.Player__r.Name}
                        </span>
                      )}
                      {article.Competition__r && (
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                          {article.Competition__r.Name}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-3xl bg-white border border-gray-200">
            <p className="text-gray-500">No articles available yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}


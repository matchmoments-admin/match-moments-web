import Image from 'next/image';
import { StandardCard } from '@/components/shared/cards/standard-card';
import { mockNBAArticles } from '@/lib/mock-data';
import { getSportsImage } from '@/lib/image-utils';

// This is a placeholder - in production, fetch real data based on topic
async function getTopicData(slug: string) {
  const topicMap: Record<string, { title: string; category: string }> = {
    nba: { title: 'NBA', category: 'nba' },
    nfl: { title: 'NFL', category: 'nfl' },
    nhl: { title: 'NHL', category: 'nhl' },
    soccer: { title: 'Soccer', category: 'soccer' },
    mlb: { title: 'MLB', category: 'baseball' },
  };

  const topic = topicMap[slug] || { title: 'Sports', category: 'sports' };

  return {
    title: topic.title,
    heroImage: getSportsImage(topic.category as any, { width: 1920, height: 600 }),
    articles: mockNBAArticles, // In production, filter by topic
  };
}

export default async function TopicPage({
  params,
}: {
  params: { slug: string };
}) {
  const topicData = await getTopicData(params.slug);

  return (
    <main className="bg-white">
      {/* Hero Banner */}
      <div className="relative h-[300px] w-full md:h-[400px]">
        <Image
          src={topicData.heroImage}
          alt={topicData.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 md:p-8 md:pb-12">
          <div className="mx-auto max-w-[1920px]">
            <h1 className="text-4xl font-bold text-white md:text-[56px] md:leading-[56px] md:tracking-[-1.41634px]">
              {topicData.title}
            </h1>
            <p className="mt-2 text-lg text-white/90 md:text-xl">
              The latest news, analysis, and commentary
            </p>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="mx-auto max-w-[1920px] px-4 py-12 md:px-8">
        {/* Filter Bar (placeholder) */}
        <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex gap-4">
            <button className="rounded-full bg-black px-4 py-2 text-sm font-normal text-white">
              All
            </button>
            <button className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-normal text-black hover:bg-gray-100">
              Articles
            </button>
            <button className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-normal text-black hover:bg-gray-100">
              Podcasts
            </button>
            <button className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-normal text-black hover:bg-gray-100">
              Videos
            </button>
          </div>

          <select className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-black focus:outline-none">
            <option>Most Recent</option>
            <option>Most Popular</option>
            <option>Oldest First</option>
          </select>
        </div>

        {/* Articles */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topicData.articles.map((article) => (
            <StandardCard key={article.id} {...article} />
          ))}
        </div>

        {/* Pagination (placeholder) */}
        <div className="mt-12 flex justify-center gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100">
            ←
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
            1
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100">
            2
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100">
            3
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100">
            →
          </button>
        </div>
      </div>
    </main>
  );
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const topicData = await getTopicData(params.slug);

  return {
    title: `${topicData.title} - Match Moments`,
    description: `Latest ${topicData.title} news, analysis, and commentary from Match Moments`,
  };
}


import { ArticleHero } from './components/article-hero';
import { ArticleContent } from './components/article-content';
import { getCardImage } from '@/lib/image-utils';

// This is a placeholder - in production, fetch real data
async function getArticle(slug: string) {
  // Mock article data
  return {
    title: 'Will the Thunder\'s Dominance Clog Up the NBA Trade Market?',
    category: 'NBA',
    categoryHref: '/topic/nba',
    categoryBadgeColor: 'bg-gray-800',
    author: 'Kirk Goldsberry',
    date: 'Dec. 10, 2024',
    readTime: 7,
    imageUrl: getCardImage('nba'),
    content: `
      <p>The Oklahoma City Thunder are off to a historic start this season, and their dominance is raising questions about how it might impact the NBA's trade market leading up to the February deadline.</p>
      
      <p>With a record that puts them among the league's elite, the Thunder have established themselves as serious championship contenders. This success could have a ripple effect across the league, influencing how other teams approach potential trades.</p>
      
      <h2>The Impact on Contenders</h2>
      
      <p>Teams that consider themselves contenders now face a difficult decision: do they go all-in to match the Thunder's level, or do they take a more cautious approach?</p>
      
      <p>The trade market typically heats up when multiple teams believe they have a legitimate shot at the championship. However, when one team appears significantly stronger than the rest, it can create a chilling effect on major moves.</p>
      
      <h2>What This Means for Star Players</h2>
      
      <p>Star players on struggling teams may also be affected by the Thunder's success. If competing teams are less willing to part with assets due to one team's dominance, it could limit opportunities for players seeking trades to contending situations.</p>
      
      <p>The dynamics of this season's trade market will be fascinating to watch as we approach the deadline.</p>
    `,
    relatedArticles: [
      {
        id: '1',
        title: 'Should You Go All In for Giannis? History Screams No.',
        category: 'NBA',
        categoryHref: '/topic/nba',
        author: 'Howard Beck',
        readTime: 11,
        imageUrl: getCardImage('basketball'),
        href: '/article/giannis-trade-history',
        date: 'Dec. 9',
      },
      {
        id: '2',
        title: 'The NBA Has Entered a Golden Age of Buckets',
        category: 'NBA',
        categoryHref: '/topic/nba',
        author: 'Kirk Goldsberry',
        readTime: 7,
        imageUrl: getCardImage('nba'),
        href: '/article/golden-age-buckets',
        date: 'Dec. 2',
      },
      {
        id: '3',
        title: 'Five Burning NBA Questions: Giannis Watch and Trade Season',
        category: 'NBA',
        categoryHref: '/topic/nba',
        author: 'Michael Pina',
        readTime: 12,
        imageUrl: getCardImage('basketball'),
        href: '/article/burning-nba-questions',
        date: 'Dec. 8',
      },
    ],
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug);

  return (
    <main>
      <ArticleHero
        title={article.title}
        category={article.category}
        categoryHref={article.categoryHref}
        categoryBadgeColor={article.categoryBadgeColor}
        author={article.author}
        date={article.date}
        readTime={article.readTime}
        imageUrl={article.imageUrl}
      />

      <ArticleContent
        content={article.content}
        relatedArticles={article.relatedArticles}
      />
    </main>
  );
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug);

  return {
    title: `${article.title} - Match Moments`,
    description: article.title,
  };
}


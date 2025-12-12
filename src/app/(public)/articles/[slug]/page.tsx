import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArticleCard } from '@/components/shared/article-card';
import { sportsImages } from '@/lib/unsplash';

// Mock article data - replace with actual data fetching
const getArticle = (slug: string) => {
  const articles: Record<string, any> = {
    'best-sports-moments-2025': {
      title: 'The Best Sports Moments of 2025',
      author: 'Match Moments Staff',
      date: 'Dec. 12, 2025',
      readTime: '10',
      category: 'Sports',
      categoryHref: '/sports',
      heroImage: sportsImages.hero(),
      content: `
        <p>2025 has been an incredible year for sports, filled with unforgettable moments that have captivated fans around the world. From championship victories to record-breaking performances, we've witnessed history in the making.</p>
        
        <p>In this comprehensive look back, we'll explore the top moments that defined the year in sports. These moments span across multiple leagues and sports, showcasing the incredible talent and determination of athletes worldwide.</p>
        
        <p>Whether it was a buzzer-beater in the NBA Finals, a game-winning touchdown in the Super Bowl, or a stunning goal in the World Cup, 2025 delivered moments that will be remembered for generations to come.</p>
        
        <p>Join us as we relive these incredible achievements and celebrate the athletes who made them possible. From individual brilliance to team triumphs, this year had it all.</p>
      `,
    },
  };

  return articles[slug] || null;
};

const relatedArticles = [
  {
    title: 'NBA Playoff Race Heats Up',
    category: 'NBA',
    categoryHref: '/sports/nba',
    imageUrl: sportsImages.basketball(),
    imageAlt: 'NBA basketball',
    href: '/articles/nba-playoff-race',
    author: 'John Smith',
    date: 'Dec. 12',
    readTime: '5',
  },
  {
    title: 'NFL Week 15 Preview',
    category: 'NFL',
    categoryHref: '/sports/nfl',
    imageUrl: sportsImages.football(),
    imageAlt: 'NFL football',
    href: '/articles/nfl-week-15',
    author: 'Jane Doe',
    date: 'Dec. 12',
    readTime: '7',
  },
  {
    title: 'Champions League Roundup',
    category: 'Soccer',
    categoryHref: '/sports/soccer',
    imageUrl: sportsImages.soccer(),
    imageAlt: 'Soccer match',
    href: '/articles/champions-league',
    author: 'Mike Johnson',
    date: 'Dec. 11',
    readTime: '6',
  },
];

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = getArticle(params.slug);
  
  if (!article) {
    return {
      title: 'Article Not Found - Match Moments',
    };
  }

  return {
    title: `${article.title} - Match Moments`,
    description: `Read ${article.title} by ${article.author} on Match Moments`,
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative w-full h-[600px]">
        <Image
          src={article.heroImage}
          alt={article.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="max-w-[800px] mx-auto px-8 pb-8 w-full">
            <Link
              href={article.categoryHref}
              className="text-sm font-bold text-white/90 hover:text-white transition-colors duration-150 mb-2 inline-block"
            >
              {article.category}
            </Link>
            <h1 className="text-[56px] font-bold leading-[56px] tracking-[-1.41634px] text-white mb-4">
              {article.title}
            </h1>
            <div className="text-base font-normal text-white/90">
              By {article.author} • {article.date} • {article.readTime} min read
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-[800px] mx-auto px-8 py-12">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>

      {/* Related Articles */}
      <section className="max-w-[1920px] mx-auto px-8 pb-24">
        <h2 className="text-2xl font-medium leading-[28.8px] tracking-[-0.621127px] mb-6">
          Related Articles
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {relatedArticles.map((related, index) => (
            <ArticleCard key={index} {...related} variant="standard" />
          ))}
        </div>
      </section>
    </div>
  );
}


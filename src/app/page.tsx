import { HeroCarousel } from '@/components/shared/hero-carousel';
import { FeaturedCard } from '@/components/shared/cards/featured-card';
import { StandardCard } from '@/components/shared/cards/standard-card';
import { PodcastCard } from '@/components/shared/cards/podcast-card';
import { SectionHeader } from '@/components/shared/sections/section-header';
import { NoteworthyList } from '@/components/shared/sections/noteworthy-list';
import {
  mockHeroSlides,
  mockFeaturedArticles,
  mockNFLArticles,
  mockNBAArticles,
  mockPodcasts,
  mockNoteworthyReads,
  mockBestOf2025,
} from '@/lib/mock-data';

export default function HomePage() {
  return (
    <main className="bg-white">
      {/* Hero Carousel */}
      <HeroCarousel slides={mockHeroSlides} autoPlay autoPlayInterval={6000} />

      {/* Main Container */}
      <div className="mx-auto max-w-[1920px] px-4 py-12 md:px-8">
        {/* The Latest Section */}
        <section className="mb-16">
          <SectionHeader
            title="The Latest"
            viewAllHref="/latest"
            viewAllText="View All"
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {mockFeaturedArticles.map((article) => (
              <FeaturedCard key={article.id} {...article} />
            ))}
          </div>
        </section>

        {/* Featured Article + Noteworthy Reads */}
        <section className="mb-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Featured Article */}
            <div className="lg:col-span-2">
              <FeaturedCard {...mockNFLArticles[0]} />
            </div>

            {/* Noteworthy Reads Sidebar */}
            <div>
              <NoteworthyList items={mockNoteworthyReads.slice(0, 8)} />
            </div>
          </div>
        </section>

        {/* Best of 2025 Section */}
        <section className="mb-16">
          <SectionHeader
            title="The Best of 2025"
            viewAllHref="/year-in-review"
            description="Our favorite sports moments from the year"
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {mockBestOf2025.map((article) => (
              <StandardCard key={article.id} {...article} />
            ))}
          </div>
        </section>

        {/* NFL Week 15 Section */}
        <section className="mb-16 rounded-3xl bg-gray-50 p-8">
          <SectionHeader
            title="NFL Week 15 Is Here"
            viewAllHref="/topic/nfl"
            viewAllText="More NFL"
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {mockNFLArticles.map((article) => (
              <StandardCard key={article.id} {...article} />
            ))}
          </div>
        </section>

        {/* NBA Section */}
        <section className="mb-16">
          <SectionHeader
            title="What's Going On With Giannis?"
            viewAllHref="/topic/nba"
            viewAllText="More NBA"
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {mockNBAArticles.map((article) => (
              <StandardCard key={article.id} {...article} />
            ))}
          </div>
        </section>

        {/* Podcasts Section */}
        <section className="mb-16 rounded-3xl bg-black p-8 text-white">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">The Freshest NFL Podcasts</h2>
            <a
              href="/podcasts"
              className="text-base font-normal text-white hover:underline"
            >
              All Podcasts →
            </a>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {mockPodcasts.map((podcast) => (
              <PodcastCard key={podcast.id} {...podcast} />
            ))}
          </div>
        </section>

        {/* Special Project Callout */}
        <section className="mb-16">
          <div className="relative overflow-hidden rounded-3xl bg-black p-12 text-white">
            <div className="relative z-10">
              <span className="inline-block rounded bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide">
                Special Project
              </span>
              <h2 className="mt-4 text-4xl font-bold">
                The Best Moments in Sports History
              </h2>
              <p className="mt-4 text-lg opacity-90">
                Explore our complete archive of sports coverage, analysis, and memorable moments
                from across all major leagues and events.
              </p>
              <a
                href="/archive"
                className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-base font-medium text-black transition-opacity hover:opacity-90"
              >
                Explore Now
              </a>
            </div>
            {/* Decorative background pattern */}
            <div className="absolute right-0 top-0 h-full w-1/2 opacity-10">
              <div className="h-full w-full bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:24px_24px]"></div>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="mb-16">
          <div className="rounded-3xl bg-gray-50 p-8 md:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold">Match Moments Newsletter</h2>
              <p className="mt-4 text-lg text-gray-600">
                Get the latest sports news and analysis delivered to your inbox
              </p>
              <form className="mt-8 flex flex-col gap-4 sm:flex-row">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 rounded-full border border-gray-300 px-6 py-3 focus:border-black focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-full bg-black px-8 py-3 font-medium text-white hover:bg-black/90"
                >
                  Subscribe
                </button>
              </form>
              <p className="mt-4 text-sm text-gray-500">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArticleCard } from '@/components/shared/article-card';
import { ListCard } from '@/components/shared/list-card';
import { FilterTabs } from '@/components/shared/filter-tabs';

interface SportsContentProps {
  featuredArticle: any;
  latestStories: any[];
  latestVideos: any[];
  latestPodcasts: any[];
  moreContent: any[];
}

export function SportsContent({
  featuredArticle,
  latestStories,
  latestVideos,
  latestPodcasts,
  moreContent,
}: SportsContentProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-[1920px] mx-auto px-8 pb-24">
        {/* Hero Section */}
        <section className="mb-12 pt-8">
          <ArticleCard {...featuredArticle} variant="featured" />
        </section>

        {/* Latest Stories */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-medium leading-[28.8px] tracking-[-0.621127px]">
              Latest Stories
            </h2>
            <Link
              href="/archive"
              className="text-base font-normal text-black hover:underline transition-all duration-150 flex items-center gap-2"
            >
              <span>View All</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {latestStories.map((story, index) => (
              <ArticleCard key={index} {...story} variant="standard" />
            ))}
          </div>
        </section>

        {/* Latest Videos */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-medium leading-[28.8px] tracking-[-0.621127px]">
              Latest Videos
            </h2>
            <Link
              href="/videos"
              className="text-base font-normal text-black hover:underline transition-all duration-150 flex items-center gap-2"
            >
              <span>View All</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {latestVideos.map((video, index) => (
              <ArticleCard
                key={index}
                title={video.title}
                category={video.category}
                categoryHref={video.categoryHref}
                imageUrl={video.imageUrl}
                imageAlt={video.imageAlt}
                href={video.href}
                variant="standard"
                author={video.showName}
                date={video.date}
                readTime={video.duration}
              />
            ))}
          </div>
        </section>

        {/* Latest Podcasts */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-medium leading-[28.8px] tracking-[-0.621127px]">
              Latest Podcasts
            </h2>
            <Link
              href="/podcasts"
              className="text-base font-normal text-black hover:underline transition-all duration-150 flex items-center gap-2"
            >
              <span>View All</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {latestPodcasts.map((podcast, index) => (
              <ArticleCard
                key={index}
                title={podcast.title}
                category={podcast.category}
                categoryHref={podcast.categoryHref}
                imageUrl={podcast.imageUrl}
                imageAlt={podcast.imageAlt}
                href={podcast.href}
                variant="standard"
                author={podcast.showName}
                date={podcast.date}
                readTime={podcast.duration}
              />
            ))}
          </div>
        </section>

        {/* More on Sports */}
        <section className="mb-12">
          <h2 className="text-2xl font-medium leading-[28.8px] tracking-[-0.621127px] mb-6">
            More on Sports
          </h2>
          <FilterTabs
            filters={[
              { id: 'all', label: 'All' },
              { id: 'articles', label: 'Articles' },
              { id: 'podcasts', label: 'Podcasts' },
              { id: 'videos', label: 'Videos' },
            ]}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
          <div className="space-y-2">
            {moreContent.map((item, index) => (
              <ListCard key={index} {...item} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}


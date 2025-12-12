import type { Metadata } from 'next';
import { SportsContent } from '@/components/shared/sports-content';
import { sportsImages } from '@/lib/unsplash';

export const metadata: Metadata = {
  title: 'Sports - Match Moments',
  description: 'Latest sports news, articles, videos, and podcasts from Match Moments',
};

// Mock data - replace with actual data fetching
const featuredArticle = {
  title: 'The Best Sports Moments of 2025',
  category: 'Sports',
  categoryHref: '/sports',
  imageUrl: sportsImages.hero(),
  imageAlt: 'Sports highlights',
  href: '/articles/best-sports-moments-2025',
  author: 'Match Moments Staff',
  date: 'Dec. 12',
  readTime: '10',
};

const latestStories = [
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
  {
    title: 'MLB Offseason Moves',
    category: 'MLB',
    categoryHref: '/sports/mlb',
    imageUrl: sportsImages.baseball(),
    imageAlt: 'Baseball',
    href: '/articles/mlb-offseason',
    author: 'Sarah Williams',
    date: 'Dec. 11',
    readTime: '8',
  },
];

const latestVideos = [
  {
    title: 'Top 10 Plays of the Week',
    category: 'Sports',
    categoryHref: '/sports',
    imageUrl: sportsImages.general(),
    imageAlt: 'Sports highlights',
    href: '/videos/top-10-plays',
    showName: 'Match Moments Highlights',
    showHref: '/shows/highlights',
    date: 'Dec. 12',
    duration: '5:30',
    variant: 'video' as const,
  },
  {
    title: 'Game Analysis: Lakers vs Warriors',
    category: 'NBA',
    categoryHref: '/sports/nba',
    imageUrl: sportsImages.basketball(),
    imageAlt: 'Basketball game',
    href: '/videos/lakers-warriors',
    showName: 'NBA Breakdown',
    showHref: '/shows/nba-breakdown',
    date: 'Dec. 12',
    duration: '12:45',
    variant: 'video' as const,
  },
];

const latestPodcasts = [
  {
    title: 'Week 15 NFL Predictions',
    category: 'NFL',
    categoryHref: '/sports/nfl',
    imageUrl: sportsImages.football(),
    imageAlt: 'NFL podcast',
    href: '/podcasts/nfl-week-15',
    showName: 'The Match Moments NFL Show',
    showHref: '/podcasts/nfl-show',
    date: 'Dec. 12',
    duration: '45 min',
    variant: 'podcast' as const,
  },
  {
    title: 'NBA Trade Rumors Roundup',
    category: 'NBA',
    categoryHref: '/sports/nba',
    imageUrl: sportsImages.basketball(),
    imageAlt: 'NBA podcast',
    href: '/podcasts/nba-trades',
    showName: 'The Match Moments NBA Show',
    showHref: '/podcasts/nba-show',
    date: 'Dec. 11',
    duration: '38 min',
    variant: 'podcast' as const,
  },
];

const moreContent = [
  {
    title: 'Fantasy Football Week 15 Rankings',
    category: 'Fantasy Football',
    categoryHref: '/fantasy-football',
    imageUrl: sportsImages.football(),
    imageAlt: 'Fantasy football',
    href: '/articles/fantasy-week-15',
    showName: 'Fantasy Football Show',
    showHref: '/podcasts/fantasy',
    date: 'Dec. 12',
    duration: '1 hr 15 min',
    variant: 'podcast' as const,
  },
  {
    title: 'College Football Playoff Preview',
    category: 'College Football',
    categoryHref: '/sports/college-football',
    imageUrl: sportsImages.football(),
    imageAlt: 'College football',
    href: '/articles/cfp-preview',
    author: 'Tom Brown',
    date: 'Dec. 12',
    readTime: '12',
    variant: 'article' as const,
  },
];

export default function SportsPage() {
  return (
    <SportsContent
      featuredArticle={featuredArticle}
      latestStories={latestStories}
      latestVideos={latestVideos}
      latestPodcasts={latestPodcasts}
      moreContent={moreContent}
    />
  );
}

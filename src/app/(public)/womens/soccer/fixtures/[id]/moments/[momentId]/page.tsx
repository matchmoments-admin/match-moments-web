import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { BreadcrumbNav } from '@/components/sports/breadcrumb-nav';
import { MatchTimeline } from '@/components/sports/match-timeline';
import { MomentCard } from '@/components/sports/moment-card';
import { getMomentById, getMomentsByMatchId } from '@/lib/data/moments';
import { getMatchById } from '@/lib/data/matches';
import { notFound } from 'next/navigation';
import type { CommentaryEvent } from '@/types/sports';

// Mock events for timeline
const mockEvents: CommentaryEvent[] = [
  {
    id: 'moment-w-1',
    fixtureId: 'wsl-fixture-1',
    eventType: 'Goal',
    eventMinute: 23,
    description: 'Stunning strike from outside the box',
    socialShareTitle: 'Sam Kerr Screamer!',
    primaryPlayer: { id: 'sam-kerr', name: 'Sam Kerr' },
    viralScore: 95,
    period: {
      periodType: 'Half',
      periodNumber: 1,
      homeScore: 1,
      awayScore: 0,
      cumulativeHomeScore: 1,
      cumulativeAwayScore: 0,
    },
  },
  {
    id: 'moment-w-2',
    fixtureId: 'wsl-fixture-1',
    eventType: 'Goal',
    eventMinute: 67,
    description: 'Header from close range',
    primaryPlayer: { id: 'beth-mead', name: 'Beth Mead' },
    viralScore: 82,
    period: {
      periodType: 'Half',
      periodNumber: 2,
      homeScore: 1,
      awayScore: 1,
      cumulativeHomeScore: 2,
      cumulativeAwayScore: 1,
    },
  },
];

export const revalidate = 300; // ISR: 5 minutes

export default async function WomensMomentDetailPage({
  params,
}: {
  params: Promise<{ id: string; momentId: string }>;
}) {
  const { id, momentId } = await params;
  
  // Fetch real data from Salesforce
  const [fixture, moment, relatedMoments] = await Promise.all([
    getMatchById(id),
    getMomentById(momentId),
    getMomentsByMatchId(id).catch(() => []),
  ]);
  
  if (!fixture || !moment) {
    notFound();
  }

  // Filter out current moment from related moments
  const filteredRelatedMoments = relatedMoments.filter((m) => m.id !== momentId);

  return (
    <main className="bg-background">
      <div className="container-main py-8">
        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            { label: "Women's Sports", href: '/womens' },
            { label: 'Soccer', href: '/womens/soccer' },
            { label: 'Fixtures', href: '/womens/soccer/fixtures' },
            { label: `${fixture.homeTeam.name} vs ${fixture.awayTeam.name}`, href: `/womens/soccer/fixtures/${id}` },
            { label: moment.shareTitle || moment.eventType, href: `/womens/soccer/fixtures/${id}/moments/${momentId}`, current: true },
          ]}
        />

        {/* Competition Context */}
        <Link
          href={`/womens/soccer/competitions/${fixture.competition.id}`}
          className="inline-flex items-center gap-2 mb-6 rounded-full bg-white border border-gray-200 px-4 py-2 hover:border-black transition-colors"
        >
          {fixture.competition.logoUrl && (
            <Image
              src={fixture.competition.logoUrl}
              alt={fixture.competition.name}
              width={20}
              height={20}
              className="object-contain"
            />
          )}
          <span className="text-sm font-medium">{fixture.competition.name}</span>
        </Link>

        {/* Match Header */}
        <section className="mb-8 rounded-3xl bg-white border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {fixture.homeTeam.logoUrl && (
                <Image
                  src={fixture.homeTeam.logoUrl}
                  alt={fixture.homeTeam.name}
                  width={40}
                  height={40}
                />
              )}
              <span className="font-bold">{fixture.homeTeam.name}</span>
            </div>
            
            <div className="text-2xl font-bold px-8">
              {fixture.homeScore} - {fixture.awayScore}
            </div>
            
            <div className="flex items-center gap-4">
              <span className="font-bold">{fixture.awayTeam.name}</span>
              {fixture.awayTeam.logoUrl && (
                <Image
                  src={fixture.awayTeam.logoUrl}
                  alt={fixture.awayTeam.name}
                  width={40}
                  height={40}
                />
              )}
            </div>
          </div>
        </section>

        {/* Moment Content */}
        <section className="mb-8">
          <div className="aspect-video rounded-3xl bg-gray-900 flex items-center justify-center mb-6">
            <div className="text-white text-center">
              <div className="text-8xl mb-4">⚽</div>
              <p className="text-xl">Video Player Placeholder</p>
            </div>
          </div>
        </section>

        {/* Event Time */}
        <section className="mb-8 rounded-3xl bg-purple-50 border border-purple-200 p-6">
          <h3 className="text-lg font-bold mb-2">Event Time</h3>
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-gray-600">Minute:</span>{' '}
              <span className="font-medium">{moment.eventMinute}'</span>
            </div>
          </div>
        </section>

        {/* Event Details */}
        <section className="mb-8 rounded-3xl bg-white border border-gray-200 p-8">
          <div className="mb-6">
            <span className="inline-block rounded-full bg-black text-white px-4 py-2 text-sm font-medium mb-4">
              {moment.eventType}
            </span>
            <h1 className="text-4xl font-bold mb-4">
              {moment.shareTitle || moment.description}
            </h1>
          </div>

          {moment.primaryPlayer && (
            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-600 uppercase mb-2">Player</h4>
              <Link
                href={`/womens/soccer/players/${moment.primaryPlayer.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 hover:bg-gray-200 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium">{moment.primaryPlayer.name}</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}

          <div className="mb-6">
            <p className="text-lg text-gray-700">{moment.description}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{moment.eventMinute}' minute</span>
          </div>
        </section>

        {/* Full Timeline */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold mb-6">Full Match Timeline</h3>
          <MatchTimeline
            events={mockEvents}
            fixtureId={id}
            currentMomentId={momentId}
            gender="womens"
            sport="soccer"
          />
          <Link
            href={`/womens/soccer/fixtures/${id}`}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-200 px-6 py-3 hover:border-black transition-colors"
          >
            View Full Match Details
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </section>

        {/* Related Moments */}
        {relatedMoments.length > 0 && (
          <section>
            <h3 className="text-2xl font-bold mb-6">Other Moments from This Match</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredRelatedMoments.map((m) => (
                <MomentCard key={m.id} moment={m} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}


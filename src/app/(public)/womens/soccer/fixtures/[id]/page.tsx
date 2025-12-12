'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { BreadcrumbNav } from '@/components/sports/breadcrumb-nav';
import { PeriodBreakdownEnhanced } from '@/components/sports/period-breakdown-enhanced';
import { MatchTimeline } from '@/components/sports/match-timeline';
import { mockWomensFixtures } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import type { CommentaryEvent, FixturePeriod } from '@/types/sports';

// Mock commentary events for demo
const mockEvents: CommentaryEvent[] = [
  {
    id: 'evt-1',
    fixtureId: 'wsl-fixture-1',
    eventType: 'Kick-off',
    eventMinute: 1,
    description: 'Match starts',
    viralScore: 0,
  },
  {
    id: 'evt-2',
    fixtureId: 'wsl-fixture-1',
    eventType: 'Goal',
    eventMinute: 23,
    description: 'Stunning strike from outside the box',
    socialShareTitle: 'What a goal!',
    primaryPlayer: { id: 'sam-kerr', name: 'Sam Kerr' },
    viralScore: 95,
  },
  {
    id: 'evt-3',
    fixtureId: 'wsl-fixture-1',
    eventType: 'Goal',
    eventMinute: 67,
    description: 'Header from close range',
    primaryPlayer: { id: 'player-2', name: 'Beth Mead' },
    viralScore: 82,
  },
];

// Mock periods
const mockPeriods: FixturePeriod[] = [
  {
    periodNumber: 1,
    periodType: 'Half',
    homeScore: 1,
    awayScore: 0,
    cumulativeHomeScore: 1,
    cumulativeAwayScore: 0,
  },
  {
    periodNumber: 2,
    periodType: 'Half',
    homeScore: 1,
    awayScore: 1,
    cumulativeHomeScore: 2,
    cumulativeAwayScore: 1,
  },
];

export default function WomensFixtureDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [activeTab, setActiveTab] = useState<'summary' | 'stats' | 'lineups'>('summary');
  
  const fixture = mockWomensFixtures.find((f) => f.id === params.id);
  
  if (!fixture) {
    notFound();
  }

  return (
    <main className="bg-background">
      <div className="container-main py-8">
        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            { label: "Women's Sports", href: '/womens' },
            { label: 'Soccer', href: '/womens/soccer' },
            { label: 'Fixtures', href: '/womens/soccer/fixtures' },
            { label: `${fixture.homeTeam.name} vs ${fixture.awayTeam.name}`, href: `/womens/soccer/fixtures/${params.id}`, current: true },
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
        <section className="mb-12 rounded-3xl bg-white border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1 text-center">
              <div className="flex flex-col items-center">
                {fixture.homeTeam.logoUrl && (
                  <Image
                    src={fixture.homeTeam.logoUrl}
                    alt={fixture.homeTeam.name}
                    width={80}
                    height={80}
                    className="mb-4"
                  />
                )}
                <h2 className="text-2xl font-bold">{fixture.homeTeam.name}</h2>
              </div>
            </div>
            
            <div className="px-8 text-center">
              <div className="text-6xl font-bold mb-2">
                {fixture.homeScore} - {fixture.awayScore}
              </div>
              <div className="text-sm text-gray-600">
                {fixture.status === 'finished' ? 'Full Time' : fixture.status}
              </div>
            </div>
            
            <div className="flex-1 text-center">
              <div className="flex flex-col items-center">
                {fixture.awayTeam.logoUrl && (
                  <Image
                    src={fixture.awayTeam.logoUrl}
                    alt={fixture.awayTeam.name}
                    width={80}
                    height={80}
                    className="mb-4"
                  />
                )}
                <h2 className="text-2xl font-bold">{fixture.awayTeam.name}</h2>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600 border-t border-gray-200 pt-4">
            {format(new Date(fixture.matchDate), 'MMMM d, yyyy • h:mm a')} • {fixture.venue}
          </div>
        </section>

        {/* Period Breakdown */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Score by Period</h3>
          <div className="rounded-3xl bg-white border border-gray-200 p-6">
            <PeriodBreakdownEnhanced
              homeTeam={fixture.homeTeam.name}
              awayTeam={fixture.awayTeam.name}
              periods={mockPeriods}
              finalHome={fixture.homeScore}
              finalAway={fixture.awayScore}
            />
          </div>
        </section>

        {/* Full Match Timeline */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Full Match Timeline</h3>
          <MatchTimeline
            events={mockEvents}
            fixtureId={params.id}
            gender="womens"
            sport="soccer"
          />
        </section>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-6 py-3 text-base font-medium transition-all relative ${
                activeTab === 'summary' ? 'text-black' : 'text-gray-500 hover:text-black'
              }`}
            >
              Summary
              {activeTab === 'summary' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-3 text-base font-medium transition-all relative ${
                activeTab === 'stats' ? 'text-black' : 'text-gray-500 hover:text-black'
              }`}
            >
              Stats
              {activeTab === 'stats' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('lineups')}
              className={`px-6 py-3 text-base font-medium transition-all relative ${
                activeTab === 'lineups' ? 'text-black' : 'text-gray-500 hover:text-black'
              }`}
            >
              Lineups
              {activeTab === 'lineups' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'summary' && (
          <div className="rounded-3xl bg-white border border-gray-200 p-8">
            <p>Match summary and highlights will appear here</p>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="rounded-3xl bg-white border border-gray-200 p-8">
            <p>Match statistics will appear here</p>
          </div>
        )}

        {activeTab === 'lineups' && (
          <div className="rounded-3xl bg-white border border-gray-200 p-8">
            <p>Team lineups will appear here</p>
          </div>
        )}
      </div>
    </main>
  );
}


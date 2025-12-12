'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BreadcrumbNav } from '@/components/sports/breadcrumb-nav';
import { FixtureCard } from '@/components/sports/fixture-card';
import { mockWomensCompetitions, mockWomensFixtures } from '@/lib/mock-data';
import { notFound } from 'next/navigation';

export default function WomensCompetitionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [activeTab, setActiveTab] = useState<'fixtures' | 'standings' | 'teams' | 'stats'>('fixtures');
  
  const competition = mockWomensCompetitions.find((c) => c.id === params.id);
  
  if (!competition) {
    notFound();
  }

  const competitionFixtures = mockWomensFixtures.filter(
    (f) => f.competition.id === params.id
  );

  return (
    <main className="bg-background">
      <div className="container-main py-8">
        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            { label: "Women's Sports", href: '/womens' },
            { label: 'Soccer', href: '/womens/soccer' },
            { label: 'Competitions', href: '/womens/soccer/competitions' },
            { label: competition.name, href: `/womens/soccer/competitions/${params.id}`, current: true },
          ]}
        />

        {/* Competition Header */}
        <section className="mb-8 rounded-3xl bg-white border border-gray-200 p-8">
          <div className="flex items-center gap-6">
            {competition.logoUrl && (
              <div className="relative h-24 w-24">
                <Image
                  src={competition.logoUrl}
                  alt={competition.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{competition.name}</h1>
              <p className="text-lg text-gray-600">
                {competition.country} • {competition.season}
              </p>
              {competition.numberOfTeams && (
                <p className="text-sm text-gray-500 mt-2">
                  {competition.numberOfTeams} Teams
                </p>
              )}
            </div>
            <div className="rounded-full bg-purple-100 text-purple-800 px-4 py-2 text-sm font-medium">
              Women's Soccer
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('fixtures')}
              className={`px-6 py-3 text-base font-medium transition-all relative ${
                activeTab === 'fixtures' ? 'text-black' : 'text-gray-500 hover:text-black'
              }`}
            >
              Fixtures
              {activeTab === 'fixtures' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('standings')}
              className={`px-6 py-3 text-base font-medium transition-all relative ${
                activeTab === 'standings' ? 'text-black' : 'text-gray-500 hover:text-black'
              }`}
            >
              Standings
              {activeTab === 'standings' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`px-6 py-3 text-base font-medium transition-all relative ${
                activeTab === 'teams' ? 'text-black' : 'text-gray-500 hover:text-black'
              }`}
            >
              Teams
              {activeTab === 'teams' && (
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
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'fixtures' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitionFixtures.map((fixture) => (
              <FixtureCard key={fixture.id} fixture={fixture} />
            ))}
            {competitionFixtures.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                No fixtures available
              </div>
            )}
          </div>
        )}

        {activeTab === 'standings' && (
          <div className="rounded-3xl bg-white border border-gray-200 p-8">
            <p className="text-center text-gray-500">Standings coming soon</p>
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="rounded-3xl bg-white border border-gray-200 p-8">
            <p className="text-center text-gray-500">Teams list coming soon</p>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="rounded-3xl bg-white border border-gray-200 p-8">
            <p className="text-center text-gray-500">Statistics coming soon</p>
          </div>
        )}
      </div>
    </main>
  );
}


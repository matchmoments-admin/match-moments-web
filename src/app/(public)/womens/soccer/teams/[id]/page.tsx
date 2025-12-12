'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BreadcrumbNav } from '@/components/sports/breadcrumb-nav';
import { FixtureCard } from '@/components/sports/fixture-card';
import { mockWomensTeams, mockWomensFixtures } from '@/lib/mock-data';
import { notFound } from 'next/navigation';

export default function WomensTeamDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'fixtures' | 'stats' | 'squad'>('overview');
  
  const team = mockWomensTeams.find((t) => t.id === params.id);
  
  if (!team) {
    notFound();
  }

  const teamFixtures = mockWomensFixtures.filter(
    (f) => f.homeTeam.id === params.id || f.awayTeam.id === params.id
  );

  return (
    <main className="bg-background">
      <div className="container-main py-8">
        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            { label: "Women's Sports", href: '/womens' },
            { label: 'Soccer', href: '/womens/soccer' },
            { label: 'Teams', href: '/womens/soccer/teams' },
            { label: team.name, href: `/womens/soccer/teams/${params.id}`, current: true },
          ]}
        />

        {/* Team Header */}
        <section className="mb-8 rounded-3xl bg-white border border-gray-200 p-8">
          <div className="flex items-center gap-6">
            {team.logoUrl && (
              <Image
                src={team.logoUrl}
                alt={team.name}
                width={96}
                height={96}
                className="flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{team.name}</h1>
              <p className="text-lg text-gray-600 mb-2">{team.country}</p>
              {team.stadium && (
                <p className="text-sm text-gray-500">Stadium: {team.stadium}</p>
              )}
              {team.foundedYear && (
                <p className="text-sm text-gray-500">Founded: {team.foundedYear}</p>
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
            {['overview', 'fixtures', 'stats', 'squad'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 text-base font-medium transition-all relative capitalize ${
                  activeTab === tab ? 'text-black' : 'text-gray-500 hover:text-black'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl bg-white border border-gray-200 p-6">
              <h3 className="text-lg font-bold mb-4">Stadium</h3>
              <p>{team.stadium || 'Not available'}</p>
            </div>
            <div className="rounded-3xl bg-white border border-gray-200 p-6">
              <h3 className="text-lg font-bold mb-4">Founded</h3>
              <p>{team.foundedYear || 'Not available'}</p>
            </div>
            <div className="rounded-3xl bg-white border border-gray-200 p-6">
              <h3 className="text-lg font-bold mb-4">Country</h3>
              <p>{team.country}</p>
            </div>
          </div>
        )}

        {activeTab === 'fixtures' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamFixtures.map((fixture) => (
              <FixtureCard key={fixture.id} fixture={fixture} />
            ))}
            {teamFixtures.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                No fixtures available
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="rounded-3xl bg-white border border-gray-200 p-8">
            <p className="text-center text-gray-500">Team statistics coming soon</p>
          </div>
        )}

        {activeTab === 'squad' && (
          <div className="rounded-3xl bg-white border border-gray-200 p-8">
            <p className="text-center text-gray-500">Squad information coming soon</p>
          </div>
        )}
      </div>
    </main>
  );
}


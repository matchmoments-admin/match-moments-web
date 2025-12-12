'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BreadcrumbNav } from '@/components/sports/breadcrumb-nav';
import { MomentCard } from '@/components/sports/moment-card';
import { mockWomensPlayers, mockTrendingWomensMoments } from '@/lib/mock-data';
import { notFound } from 'next/navigation';

function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default function WomensPlayerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [activeTab, setActiveTab] = useState<'stats' | 'moments' | 'career'>('stats');
  
  const player = mockWomensPlayers.find((p) => p.id === params.id);
  
  if (!player) {
    notFound();
  }

  const playerMoments = mockTrendingWomensMoments.filter(
    (m) => m.primaryPlayer?.id === params.id
  );

  return (
    <main className="bg-background">
      <div className="container-main py-8">
        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            { label: "Women's Sports", href: '/womens' },
            { label: 'Soccer', href: '/womens/soccer' },
            { label: 'Players', href: '/womens/soccer/players' },
            { label: player.name, href: `/womens/soccer/players/${params.id}`, current: true },
          ]}
        />

        {/* Player Header */}
        <section className="mb-8 rounded-3xl bg-white border border-gray-200 p-8">
          <div className="flex items-center gap-8">
            {player.photoUrl && (
              <div className="relative h-32 w-32 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={player.photoUrl}
                  alt={player.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{player.name}</h1>
              <p className="text-xl text-gray-600 mb-4">{player.position}</p>
              
              <Link
                href={`/womens/soccer/teams/${player.currentTeamId}`}
                className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 hover:bg-gray-200 transition-colors mb-4"
              >
                <span className="text-sm font-medium">{player.currentTeamName}</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <div className="grid grid-cols-3 gap-4 mt-4">
                {player.jerseyNumber && (
                  <div>
                    <div className="text-sm text-gray-600">Number</div>
                    <div className="text-2xl font-bold">#{player.jerseyNumber}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-600">Nationality</div>
                  <div className="text-lg font-medium">{player.nationality}</div>
                </div>
                {player.dateOfBirth && (
                  <div>
                    <div className="text-sm text-gray-600">Age</div>
                    <div className="text-lg font-medium">{calculateAge(player.dateOfBirth)}</div>
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-full bg-purple-100 text-purple-800 px-4 py-2 text-sm font-medium">
              Women's Soccer
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-2 border-b border-gray-200">
            {['stats', 'moments', 'career'].map((tab) => (
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
        {activeTab === 'stats' && (
          <div className="rounded-3xl bg-white border border-gray-200 p-8">
            <h3 className="text-2xl font-bold mb-6">Season Statistics</h3>
            <p className="text-center text-gray-500">Player statistics coming soon</p>
          </div>
        )}

        {activeTab === 'moments' && (
          <div>
            <h3 className="text-2xl font-bold mb-6">Player Moments</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {playerMoments.map((moment) => (
                <MomentCard key={moment.id} moment={moment} />
              ))}
              {playerMoments.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No moments available
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'career' && (
          <div className="rounded-3xl bg-white border border-gray-200 p-8">
            <h3 className="text-2xl font-bold mb-6">Career Timeline</h3>
            <p className="text-center text-gray-500">Career history coming soon</p>
          </div>
        )}
      </div>
    </main>
  );
}


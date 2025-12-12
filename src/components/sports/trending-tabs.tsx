'use client';

import { useState } from 'react';
import { TrendingMoment, GenderCategory } from '@/types/sports';
import { MomentCard } from './moment-card';

interface TrendingTabsProps {
  womensMoments: TrendingMoment[];
  mensMoments: TrendingMoment[];
  allMoments: TrendingMoment[];
  defaultTab?: GenderCategory | 'all';
}

export function TrendingTabs({
  womensMoments,
  mensMoments,
  allMoments,
  defaultTab = 'womens',
}: TrendingTabsProps) {
  const [activeTab, setActiveTab] = useState<GenderCategory | 'all'>(defaultTab);

  const getMoments = () => {
    switch (activeTab) {
      case 'womens':
        return womensMoments;
      case 'mens':
        return mensMoments;
      case 'all':
        return allMoments;
      default:
        return womensMoments;
    }
  };

  const moments = getMoments();

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('womens')}
          className={`px-6 py-3 text-base font-medium transition-all relative ${
            activeTab === 'womens'
              ? 'text-black'
              : 'text-gray-500 hover:text-black'
          }`}
        >
          Women's Moments
          {activeTab === 'womens' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('mens')}
          className={`px-6 py-3 text-base font-medium transition-all relative ${
            activeTab === 'mens'
              ? 'text-black'
              : 'text-gray-500 hover:text-black'
          }`}
        >
          Men's Moments
          {activeTab === 'mens' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-3 text-base font-medium transition-all relative ${
            activeTab === 'all'
              ? 'text-black'
              : 'text-gray-500 hover:text-black'
          }`}
        >
          All Moments
          {activeTab === 'all' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
          )}
        </button>
      </div>

      {/* Moments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {moments.map((moment) => (
          <MomentCard key={moment.id} moment={moment} />
        ))}
      </div>
    </div>
  );
}


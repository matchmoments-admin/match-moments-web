'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu } from 'lucide-react';
import { Sidebar } from './sidebar';
import { NavPills } from '@/components/shared/nav-pills';

const navPills = [
  { label: 'The Latest', href: '/archive' },
  { label: 'NBA', href: '/sports/nba' },
  { label: 'NFL', href: '/sports/nfl' },
  { label: 'Soccer', href: '/sports/soccer' },
  { label: 'College Football', href: '/sports/college-football' },
  { label: 'MLB', href: '/sports/mlb' },
  { label: 'Fantasy Football', href: '/fantasy-football' },
];

export function Navigation() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`w-full bg-white sticky top-0 z-30 transition-all duration-150 ${
          isScrolled ? 'shadow-sm' : ''
        }`}
      >
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between h-[74px] px-8 max-w-[1920px] mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-black hover:no-underline">
              Match Moments
            </span>
          </Link>

          {/* Center Search */}
          <button
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-[#E5E7EB] text-base font-normal text-[#696969] hover:border-black transition-all duration-150"
            aria-label="Discover anything"
          >
            <Search className="h-4 w-4" />
            <span>Discover anything</span>
          </button>

          {/* Right Navigation */}
          <nav className="flex items-center gap-4">
            <Link
              href="/videos"
              className="text-base font-normal text-black hover:underline transition-all duration-150"
            >
              Videos
            </Link>
            <Link
              href="/podcasts"
              className="text-base font-normal text-black hover:underline transition-all duration-150"
            >
              Podcasts
            </Link>
            <button
              className="text-base font-normal text-black hover:underline transition-all duration-150 p-2"
              aria-label="Open navigation menu"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </nav>
        </div>

        {/* Navigation Pills Row */}
        <NavPills pills={navPills} />
      </header>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}


'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ICONS } from '@/lib/sport-icons';
import { useScroll } from '@/hooks/use-scroll';
import { Sidebar } from './sidebar';
import { GlobalSearch } from './global-search';
import { iconClass, ICON_TRANSITIONS } from '@/lib/icon-styles';

export function Header() {
  const { isScrolled } = useScroll({ threshold: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-200 ${
          isScrolled ? 'shadow-md' : ''
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1920px] items-center justify-between px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 flex-shrink-0 rounded-full bg-black"></div>
            <span className="hidden text-lg font-bold sm:inline">MATCH MOMENTS</span>
          </Link>

          {/* Center - Global Search */}
          <div className="hidden md:block">
            <GlobalSearch />
          </div>

          {/* Right Navigation */}
          <nav className="flex items-center gap-4 md:gap-6">
            {/* Mobile Search */}
            <div className="md:hidden">
              <GlobalSearch />
            </div>

            {/* Videos Link */}
            <Link
              href="/videos"
              className="hidden items-center gap-2 text-base font-normal hover:underline md:flex"
            >
              <ICONS.video className={iconClass('media', ICON_TRANSITIONS.default)} />
              Videos
            </Link>

            {/* Podcasts Link */}
            <Link
              href="/podcasts"
              className="hidden items-center gap-2 text-base font-normal hover:underline md:flex"
            >
              <ICONS.microphone className={iconClass('media', ICON_TRANSITIONS.default)} />
              Podcasts
            </Link>

            {/* Hamburger Menu */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
              aria-label="Open menu"
            >
              <ICONS.menu className={iconClass('action', ICON_TRANSITIONS.default)} />
            </button>
          </nav>
        </div>

        {/* Horizontal Navigation Pills (Second Row) - Gender-First */}
        <div className="border-t border-gray-200 px-8">
          <div className="no-scrollbar mx-auto flex max-w-[1920px] gap-2 overflow-x-auto py-3">
            <NavPill href="/womens" active>
              Women's Sports
            </NavPill>
            <NavPill href="/mens">
              Men's Sports
            </NavPill>
            <NavPill href="/sports/soccer">Soccer</NavPill>
            <NavPill href="/sports/basketball">Basketball</NavPill>
            <NavPill href="/sports/cricket">Cricket</NavPill>
            <NavPill href="/sports/tennis">Tennis</NavPill>
            <NavPill href="/sports/nfl">NFL</NavPill>
            <NavPill href="/sports/rugby">Rugby</NavPill>
            <NavPill href="/games">Fixtures</NavPill>
            <NavPill href="/videos">Videos</NavPill>
            <NavPill href="/podcasts">Podcasts</NavPill>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Search Overlay (placeholder) */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50"
          onClick={() => setIsSearchOpen(false)}
        >
          <div className="mx-auto mt-20 max-w-2xl rounded-lg bg-white p-6">
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-black focus:outline-none"
              autoFocus
            />
          </div>
        </div>
      )}
    </>
  );
}

interface NavPillProps {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}

function NavPill({ href, active, children }: NavPillProps) {
  return (
    <Link
      href={href}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-normal transition-colors ${
        active
          ? 'bg-black text-white'
          : 'border border-gray-200 bg-white text-black hover:bg-gray-100'
      }`}
    >
      {children}
    </Link>
  );
}


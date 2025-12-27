'use client';

import Link from 'next/link';
import { ICONS } from '@/lib/sport-icons';
import { iconClass, ICON_TRANSITIONS } from '@/lib/icon-styles';

export function Navigation() {
  return (
    <header className="w-full bg-white">
      <div className="flex items-center justify-between h-[146px] px-8 max-w-[1920px] mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold text-black hover:no-underline">
            Match Moments
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          <Link 
            href="/fixtures" 
            className="text-base font-normal text-black hover:underline transition-all duration-150"
          >
            Fixtures
          </Link>
          <Link 
            href="/games" 
            className="text-base font-normal text-black hover:underline transition-all duration-150"
          >
            Games
          </Link>
          <Link 
            href="/sports" 
            className="text-base font-normal text-black hover:underline transition-all duration-150"
          >
            Sports
          </Link>
          <button 
            className="text-base font-normal text-black hover:underline transition-all duration-150 p-2"
            aria-label="Open Search"
          >
            <ICONS.search className={iconClass('nav', ICON_TRANSITIONS.default)} />
          </button>
          <button 
            className="text-base font-normal text-black hover:underline transition-all duration-150 p-2 md:hidden"
            aria-label="Open Menu"
          >
            <ICONS.menu className={iconClass('nav', ICON_TRANSITIONS.default)} />
          </button>
        </nav>
      </div>
    </header>
  );
}


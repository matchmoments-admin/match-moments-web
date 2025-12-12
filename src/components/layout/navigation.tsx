'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-black/10">
      <div className="mx-auto max-w-[1140px] px-2">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-black hover:no-underline">
            Match Moments
          </Link>

          {/* Right Actions */}
          <nav className="flex items-center gap-6">
            <Link 
              href="/games" 
              className="text-xl font-normal text-black hover:underline"
            >
              Read
            </Link>
            <button 
              className="text-xl text-black hover:underline"
              aria-label="Open Search"
            >
              <Search className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}


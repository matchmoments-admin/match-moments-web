'use client';

import Link from 'next/link';
import { GenderCategory } from '@/types/sports';

interface GenderNavProps {
  currentGender?: GenderCategory;
}

export function GenderNav({ currentGender }: GenderNavProps) {
  return (
    <div className="flex gap-4 justify-center mb-8">
      <Link
        href="/womens"
        className={`px-6 py-3 rounded-full text-lg font-medium transition-all ${
          currentGender === 'womens'
            ? 'bg-black text-white'
            : 'bg-gray-100 text-black hover:bg-gray-200'
        }`}
      >
        Women's Sports
      </Link>
      <Link
        href="/mens"
        className={`px-6 py-3 rounded-full text-lg font-medium transition-all ${
          currentGender === 'mens'
            ? 'bg-black text-white'
            : 'bg-gray-100 text-black hover:bg-gray-200'
        }`}
      >
        Men's Sports
      </Link>
    </div>
  );
}

interface GenderNavCardsProps {
  className?: string;
}

export function GenderNavCards({ className = '' }: GenderNavCardsProps) {
  return (
    <section className={`grid md:grid-cols-2 gap-8 ${className}`}>
      {/* Women's Sports - Primary */}
      <Link href="/womens" className="group">
        <div className="relative overflow-hidden rounded-3xl bg-black p-12 text-white transition-transform hover:scale-[1.02]">
          <div className="relative z-10">
            <span className="inline-block rounded bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide">
              Click for all
            </span>
            <h2 className="mt-4 text-5xl font-bold text-white">
              Women's Sports
            </h2>
            <p className="mt-4 text-lg opacity-90">
              Soccer, Basketball, Cricket, Tennis & more
            </p>
            <div className="mt-6 flex gap-8">
              <div>
                <div className="text-3xl font-bold">25+</div>
                <div className="text-sm opacity-75">Competitions</div>
              </div>
              <div>
                <div className="text-3xl font-bold">300+</div>
                <div className="text-sm opacity-75">Teams</div>
              </div>
              <div>
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm opacity-75">Moments</div>
              </div>
            </div>
          </div>
          {/* Decorative background pattern */}
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-10">
            <div className="h-full w-full bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:24px_24px]"></div>
          </div>
        </div>
      </Link>

      {/* Men's Sports - Secondary */}
      <Link href="/mens" className="group">
        <div className="relative overflow-hidden rounded-3xl bg-gray-100 p-12 text-black transition-transform hover:scale-[1.02]">
          <div className="relative z-10">
            <span className="inline-block rounded bg-black/10 px-3 py-1 text-xs font-bold uppercase tracking-wide">
              Click for all
            </span>
            <h2 className="mt-4 text-5xl font-bold text-black">
              Men's Sports
            </h2>
            <p className="mt-4 text-lg opacity-75">
              Soccer, Basketball, Cricket, NFL & more
            </p>
            <div className="mt-6 flex gap-8">
              <div>
                <div className="text-3xl font-bold">30+</div>
                <div className="text-sm opacity-60">Competitions</div>
              </div>
              <div>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm opacity-60">Teams</div>
              </div>
              <div>
                <div className="text-3xl font-bold">15K+</div>
                <div className="text-sm opacity-60">Moments</div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}


import Link from 'next/link';
import { SportType, SPORT_METADATA } from '@/types/sports';
import { SportIcon } from '@/components/ui/sport-icon';

interface SportCardProps {
  sport: SportType;
  href?: string;
  showGenderLinks?: boolean;
  variant?: 'hero' | 'regular' | 'compact';
  tag?: string;
}

export function SportCard({
  sport,
  href,
  showGenderLinks = false,
  variant = 'regular',
  tag,
}: SportCardProps) {
  const metadata = SPORT_METADATA[sport];
  const defaultHref = href || `/sports/${sport}`;

  if (variant === 'hero') {
    return (
      <Link href={defaultHref} className="group">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-black to-gray-800 p-8 text-white transition-transform hover:scale-[1.02]">
          <div className="relative z-10">
            <div className="mb-3">
              <SportIcon sport={sport} className="h-16 w-16" />
            </div>
            <h3 className="text-3xl font-bold mb-2">{metadata.name}</h3>
            <p className="text-lg opacity-90 mb-4">{metadata.globalFans} fans worldwide</p>
            {tag && (
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide">
                {tag}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={defaultHref} className="group">
        <div className="flex items-center gap-4 rounded-2xl bg-white border border-gray-200 p-4 transition-all hover:border-black hover:shadow-md">
          <SportIcon sport={sport} className="h-10 w-10 text-black" />
          <div className="flex-1">
            <h4 className="text-lg font-bold">{metadata.name}</h4>
            <p className="text-sm text-gray-600">{metadata.globalFans} fans</p>
          </div>
        </div>
      </Link>
    );
  }

  // Regular variant
  return (
    <Link href={defaultHref} className="group">
      <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-200 p-6 transition-all hover:border-black hover:shadow-lg">
        <div className="mb-4">
          <SportIcon sport={sport} className="h-12 w-12 text-black" />
        </div>
        <h3 className="text-2xl font-bold mb-2">{metadata.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{metadata.globalFans} fans worldwide</p>
        
        {tag && (
          <span className="inline-block rounded-full bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-wide mb-4">
            {tag}
          </span>
        )}
        
        {showGenderLinks && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
            <Link
              href={`/womens/${sport}`}
              className="flex-1 text-center rounded-full bg-gray-100 px-3 py-2 text-xs font-medium hover:bg-black hover:text-white transition-colors"
            >
              Women's
            </Link>
            <Link
              href={`/mens/${sport}`}
              className="flex-1 text-center rounded-full bg-gray-100 px-3 py-2 text-xs font-medium hover:bg-black hover:text-white transition-colors"
            >
              Men's
            </Link>
          </div>
        )}
      </div>
    </Link>
  );
}


import Link from 'next/link';
import Image from 'next/image';
import { type Competition } from '@/types/domain';

interface CompetitionCardProps {
  competition: Competition;
  variant?: 'standard' | 'featured';
}

export function CompetitionCard({ competition, variant = 'standard' }: CompetitionCardProps) {
  // Competition__c doesn't have Gender_Class__c, so default to 'mens' for routing
  const gender = competition.gender || 'mens';
  const href = `/${gender}/${competition.sport}/competitions/${competition.id}`;

  if (variant === 'featured') {
    return (
      <Link href={href} className="group">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-black to-gray-800 p-8 text-white transition-transform hover:scale-[1.02]">
          <div className="relative z-10">
            {competition.logoUrl && (
              <div className="relative h-16 w-16 mb-4">
                <Image
                  src={competition.logoUrl}
                  alt={competition.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <h3 className="text-2xl font-bold mb-2">{competition.name}</h3>
            <p className="text-sm opacity-90 mb-4">
              {competition.country} • {competition.season.name}
            </p>
            {/* Number of teams not available in current data model */}
            {competition.gender && (
              <div className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                competition.gender === 'womens'
                  ? 'bg-purple-500/20'
                  : 'bg-blue-500/20'
              }`}>
                {competition.gender === 'womens' ? "Women's" : "Men's"}
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="group">
      <div className="flex items-center gap-4 rounded-2xl bg-white border border-gray-200 p-4 transition-all hover:border-black hover:shadow-md">
        {competition.logoUrl && (
          <div className="relative h-12 w-12 flex-shrink-0">
            <Image
              src={competition.logoUrl}
              alt={competition.name}
              fill
              className="object-contain"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-bold truncate">{competition.name}</h4>
          <p className="text-sm text-gray-600 truncate">
            {competition.country} • {competition.season.name}
          </p>
        </div>
        {competition.gender && (
          <div className={`rounded-full px-2 py-1 text-xs font-medium ${
            competition.gender === 'womens'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {competition.gender === 'womens' ? "W" : "M"}
          </div>
        )}
      </div>
    </Link>
  );
}


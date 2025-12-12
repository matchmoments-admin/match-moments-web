import Link from 'next/link';
import Image from 'next/image';
import { Team } from '@/types/sports';

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  const href = `/${team.gender}/${team.sport}/teams/${team.id}`;

  return (
    <Link href={href} className="group">
      <div className="flex flex-col items-center rounded-3xl bg-white border border-gray-200 p-6 text-center transition-all hover:border-black hover:shadow-lg">
        {team.logoUrl && (
          <div className="relative h-20 w-20 mb-4">
            <Image
              src={team.logoUrl}
              alt={team.name}
              fill
              className="object-contain"
            />
          </div>
        )}
        <h3 className="text-xl font-bold mb-2 group-hover:underline">
          {team.shortName || team.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3">{team.country}</p>
        {team.stadium && (
          <p className="text-xs text-gray-500">{team.stadium}</p>
        )}
        <div className={`mt-4 rounded-full px-3 py-1 text-xs font-medium ${
          team.gender === 'womens'
            ? 'bg-purple-100 text-purple-800'
            : 'bg-blue-100 text-blue-800'
        }`}>
          {team.gender === 'womens' ? "Women's" : "Men's"}
        </div>
      </div>
    </Link>
  );
}


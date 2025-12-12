import Link from 'next/link';
import Image from 'next/image';
import { Player } from '@/types/sports';

interface PlayerCardProps {
  player: Player;
}

export function PlayerCard({ player }: PlayerCardProps) {
  const href = `/${player.gender}/${player.sport}/players/${player.id}`;

  return (
    <Link href={href} className="group">
      <div className="flex flex-col items-center rounded-3xl bg-white border border-gray-200 p-6 text-center transition-all hover:border-black hover:shadow-lg">
        {player.photoUrl && (
          <div className="relative h-24 w-24 mb-4 rounded-full overflow-hidden">
            <Image
              src={player.photoUrl}
              alt={player.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <h3 className="text-xl font-bold mb-1 group-hover:underline">
          {player.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{player.position}</p>
        {player.jerseyNumber && (
          <div className="text-2xl font-bold text-gray-400 mb-3">
            #{player.jerseyNumber}
          </div>
        )}
        <p className="text-xs text-gray-500 mb-3">{player.currentTeamName}</p>
        <div className="flex gap-2 items-center text-xs text-gray-500">
          <span>{player.nationality}</span>
          {player.dateOfBirth && (
            <>
              <span>•</span>
              <span>{calculateAge(player.dateOfBirth)} yrs</span>
            </>
          )}
        </div>
        <div className={`mt-4 rounded-full px-3 py-1 text-xs font-medium ${
          player.gender === 'womens'
            ? 'bg-purple-100 text-purple-800'
            : 'bg-blue-100 text-blue-800'
        }`}>
          {player.gender === 'womens' ? "Women's" : "Men's"}
        </div>
      </div>
    </Link>
  );
}

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


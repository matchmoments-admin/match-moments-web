import Link from 'next/link';
import Image from 'next/image';
import { type Moment } from '@/types/domain';
import { ICONS } from '@/lib/sport-icons';

interface MomentCardProps {
  moment: Moment;
}

export function MomentCard({ moment }: MomentCardProps) {
  const momentUrl = `/${moment.gender}/${moment.sport}/fixtures/${moment.match.id}/moments/${moment.id}`;

  return (
    <Link href={momentUrl} className="group">
      <article className="overflow-hidden rounded-3xl bg-white border border-gray-200 transition-all hover:border-black hover:shadow-lg">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={moment.thumbnailUrl}
            alt={moment.shareTitle || moment.description}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {/* Play button overlay for videos */}
          {moment.videoUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-black/75 p-4 transition-all group-hover:bg-black/90 group-hover:scale-110">
                <svg
                  className="h-8 w-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
          {/* Viral score badge */}
          {moment.viralScore && moment.viralScore >= 70 && (
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/75 px-3 py-1 text-xs font-bold text-white backdrop-blur">
              <ICONS.flame className="h-3 w-3" strokeWidth={2} />
              {moment.viralScore}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Event type and time */}
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">{moment.eventType}</span>
            <span>•</span>
            <span>{moment.eventMinute}'</span>
            {/* Gender badge */}
            <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-medium ${
              moment.gender === 'womens'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {moment.gender === 'womens' ? "Women's" : "Men's"}
            </span>
          </div>

          {/* Title */}
          <h3 className="mb-2 text-lg font-bold leading-tight text-black group-hover:underline">
            {moment.shareTitle || moment.description}
          </h3>

          {/* Match info */}
          <p className="mb-3 text-sm text-gray-600">
            {moment.match.homeTeam} vs {moment.match.awayTeam}
          </p>

          {/* Competition */}
          <div className="text-xs text-gray-500">
            {moment.match.competition}
          </div>

          {/* Engagement stats */}
          {(moment.viewCount || moment.shareCount) && (
            <div className="mt-3 flex gap-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
              {moment.viewCount && (
                <div className="flex items-center gap-1">
                  <ICONS.eye className="h-4 w-4" strokeWidth={1.5} />
                  {(moment.viewCount / 1000000).toFixed(1)}M
                </div>
              )}
              {moment.shareCount && (
                <div className="flex items-center gap-1">
                  <ICONS.share className="h-4 w-4" strokeWidth={1.5} />
                  {(moment.shareCount / 1000).toFixed(0)}K
                </div>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}


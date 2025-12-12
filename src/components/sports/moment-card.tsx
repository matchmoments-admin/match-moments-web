import Link from 'next/link';
import Image from 'next/image';
import { TrendingMoment } from '@/types/sports';

interface MomentCardProps {
  moment: TrendingMoment;
}

export function MomentCard({ moment }: MomentCardProps) {
  const momentUrl = `/${moment.gender}/${moment.sport}/fixtures/${moment.fixtureId}/moments/${moment.id}`;

  return (
    <Link href={momentUrl} className="group">
      <article className="overflow-hidden rounded-3xl bg-white border border-gray-200 transition-all hover:border-black hover:shadow-lg">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={moment.thumbnailUrl}
            alt={moment.socialShareTitle || moment.description}
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
            <div className="absolute top-3 right-3 rounded-full bg-black/75 px-3 py-1 text-xs font-bold text-white backdrop-blur">
              🔥 {moment.viralScore}
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
            {moment.socialShareTitle || moment.description}
          </h3>

          {/* Match info */}
          <p className="mb-3 text-sm text-gray-600">
            {moment.fixture.homeTeam} vs {moment.fixture.awayTeam}
          </p>

          {/* Competition */}
          <div className="text-xs text-gray-500">
            {moment.fixture.competition}
          </div>

          {/* Engagement stats */}
          {(moment.totalViews || moment.totalShares) && (
            <div className="mt-3 flex gap-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
              {moment.totalViews && (
                <div className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {(moment.totalViews / 1000000).toFixed(1)}M
                </div>
              )}
              {moment.totalShares && (
                <div className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  {(moment.totalShares / 1000).toFixed(0)}K
                </div>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}


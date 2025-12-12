import Link from 'next/link';
import Image from 'next/image';
import { Play, Mic, Video as VideoIcon } from 'lucide-react';
import { iconClass, ICON_TRANSITIONS } from '@/lib/icon-styles';

export interface PodcastCardProps {
  title: string;
  showName: string;
  duration: string;
  date: string;
  imageUrl: string;
  href: string;
  type?: 'podcast' | 'video';
}

export function PodcastCard({
  title,
  showName,
  duration,
  date,
  imageUrl,
  href,
  type = 'podcast',
}: PodcastCardProps) {
  const isPodcast = type === 'podcast';

  return (
    <article className="group cursor-pointer overflow-hidden rounded-3xl bg-white">
      <Link href={href} className="block">
        {/* Thumbnail with Play Button */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Duration Badge */}
          <div className="absolute right-2 top-2 rounded bg-black/80 px-2 py-1 text-xs font-medium text-white">
            {duration}
          </div>

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 transition-all group-hover:scale-110 group-hover:bg-white">
              <Play className={iconClass('nav', 'ml-1 text-black', ICON_TRANSITIONS.default)} fill="black" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Type Badge */}
          <div className="flex items-center gap-2">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full ${
                isPodcast ? 'bg-gray-800' : 'bg-gray-700'
              }`}
            >
              {isPodcast ? (
                <Mic className={iconClass('inline', 'text-white', ICON_TRANSITIONS.default)} />
              ) : (
                <VideoIcon className={iconClass('inline', 'text-white', ICON_TRANSITIONS.default)} />
              )}
            </div>
            <span className="text-category">
              {isPodcast ? 'Podcasts' : 'Videos'}
            </span>
          </div>

          {/* Title */}
          <h3 className="mt-2 text-xl font-medium group-hover:underline">
            {title}
          </h3>

          {/* Show Name */}
          <div className="text-metadata mt-2">{showName}</div>

          {/* Date & Duration */}
          <div className="mt-1 text-sm text-muted-foreground">
            <span>{date}</span>
            <span> • </span>
            <span>{duration}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}


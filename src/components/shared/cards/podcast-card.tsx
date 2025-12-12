import Link from 'next/link';
import Image from 'next/image';
import { Play, Mic, Video as VideoIcon } from 'lucide-react';

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
              <Play className="ml-1 h-6 w-6 text-black" fill="black" />
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
                <Mic className="h-4 w-4 text-white" />
              ) : (
                <VideoIcon className="h-4 w-4 text-white" />
              )}
            </div>
            <span className="text-sm font-bold text-[#6B7280]">
              {isPodcast ? 'Podcasts' : 'Videos'}
            </span>
          </div>

          {/* Title */}
          <h3 className="mt-2 text-xl font-medium group-hover:underline">
            {title}
          </h3>

          {/* Show Name */}
          <div className="mt-2 text-base text-[#696969]">{showName}</div>

          {/* Date & Duration */}
          <div className="mt-1 text-sm text-[#696969]">
            <span>{date}</span>
            <span> • </span>
            <span>{duration}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

